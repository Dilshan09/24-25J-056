from flask import Flask, request, jsonify
import numpy as np
from service.image_service import  start_predict

from flask_cors import CORS

APP_NAME = 'orchid_species'

app = Flask(APP_NAME)
CORS(app)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    if not all(k in data for k in ('humidity', 'temperature', 'sunlight')):
        return jsonify({"error": "Missing required fields: 'humidity', 'temperature', 'sunlight'"}), 400

    humidity = data['humidity']
    temperature = data['temperature']
    sunlight = data['sunlight']

    new_data = np.array([[humidity, temperature, sunlight]])

    prediction = start_predict(new_data)

    return prediction

if __name__ == '__main__':
    if APP_NAME == 'orchid_species':
        app.run(debug=False, port=5001)

