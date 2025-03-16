import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fertilizer.main import routeFertilizer
from irigation_b.app import routeIrrigation
# from specise.main import routeFertilizer
# from desices.app import routeIrrigation
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

app = FastAPI()


# CORS Setup
origins = ["http://localhost", "http://localhost:3000", "https://*.railway.app"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    print("<========= Call Default route ==========>")
    return {"message": "Hello !!!, I am FastAPI Server. U can call my API I am here to respond"}

app.include_router(routeIrrigation)
app.include_router(routeFertilizer)

print("<============== Server started ==============>")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
