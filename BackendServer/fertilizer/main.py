import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import shutil
from tempfile import NamedTemporaryFile
from pathlib import Path
from ultralytics import YOLO
import uuid

app = FastAPI()

# Set up CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://*.railway.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

path_r = os.getcwd()
print("sss",path_r)
# Load the YOLO model - update this path to the location in your deployed app
MODEL_PATH = path_r + "/models/orchid_yolo_model.pt"  # Adjust this path as needed
model = YOLO(MODEL_PATH)

# Create temp directory for uploaded images
UPLOAD_DIR = Path("temp_uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Create results directory
RESULTS_DIR = Path("results")
RESULTS_DIR.mkdir(exist_ok=True)

@app.get("/")
async def read_root():
    print("<========= Call Default route ==========>")
    return {"message": "Hello !!!, I am FastAPI Server. U can call my API I am here to respond"}

@app.post("/features")
async def predict_image(file: UploadFile = File(...)):
    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Create unique filename
    file_id = str(uuid.uuid4())
    temp_file_path = UPLOAD_DIR / f"{file_id}_{file.filename}"
    
    try:
        # Save uploaded file
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Run inference on the image
        results = model(temp_file_path)
        
        # Process results
        detection_results = []
        class_counts = {class_name: 0 for class_name in model.names.values()}  # Initialize counts for each class
        
        for result in results:
            # Save the result image
            result_file_path = RESULTS_DIR / f"result_{file_id}.jpg"
            result.save(str(result_file_path))
            
            # Extract detection data
            boxes = result.boxes
            
            for i, box in enumerate(boxes):
                class_id = int(box.cls.cpu().numpy()[0])
                class_name = model.names[class_id]
                class_counts[class_name] += 1  # Increment the count for the detected class
                
        # Return the result
        return {
            "status": "success",
            "message": "Image processed successfully",
            "class_counts": class_counts,  # Add the class counts to the response
            "result_image_url": f"/results/{result_file_path.name}"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
    finally:
        # Clean up uploaded file
        if temp_file_path.exists():
            os.remove(temp_file_path)

@app.get("/results/{filename}")
async def get_result(filename: str):
    file_path = RESULTS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Result image not found")
    return FileResponse(str(file_path))


@app.delete("/clear-results")
async def clear_results():
    try:
        # Delete all files in the results directory
        for file in RESULTS_DIR.iterdir():
            if file.is_file():
                file.unlink()  # Delete the file
        
        return {
            "status": "success",
            "message": "Results folder cleared successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing results folder: {str(e)}")

print("<============== Server started ==============>")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)