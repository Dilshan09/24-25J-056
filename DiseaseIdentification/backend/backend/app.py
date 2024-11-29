from flask import Flask, request, jsonify

import torch
from PIL import Image
import pathlib
import os

from service.imageService import make_predictions

app = Flask(__name__)

pathlib.PosixPath = pathlib.WindowsPath
print("Current Working Directory:", os.getcwd())
model = torch.hub.load('ultralytics/yolov5', 'custom', path='best.pt', force_reload=False)
print("Available Classes : " , model.names)

@app.route('/second', methods=['POST'])
def detect_objects():
    if 'file1' not in request.files:
        return jsonify({'error': 'No image provided'})

    image_file1 = request.files['file1']
    image_pil1 = Image.open(image_file1)

    try:
        prediction = make_predictions(image_pil1, confidence_threshold=0.1 , model=model)
    except:
        prediction = {
            "class" : "error",
            "confidence" : "0.0"
        }

    return jsonify(prediction)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)
