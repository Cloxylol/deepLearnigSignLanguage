from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model
import pickle

app = Flask(__name__)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)
with open("label_encoder.pkl", "rb") as f:
    le = pickle.load(f)

model = load_model("mediapipe_vector_model.h5")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or "vector" not in data:
        return jsonify({'error': 'Envoyez un JSON {"vector": [...]}' }), 400

    vector = np.array(data["vector"]).reshape(1, -1)
    vector_scaled = scaler.transform(vector)
    pred = model.predict(vector_scaled)
    pred_class = np.argmax(pred, axis=1)[0]
    label_pred = le.inverse_transform([pred_class])[0]
    return jsonify({'label': label_pred})

if __name__ == '__main__':
    app.run(debug=True)