from flask import Flask, request, jsonify
import cv2
import mediapipe as mp
import numpy as np
import requests
import tempfile
import os

app = Flask(__name__)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True)

@app.route('/vector', methods=['POST'])
def vectorize_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    file = request.files['image']
    # Sauvegarde temporaire
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        file.save(tmp.name)
        img = cv2.imread(tmp.name)
    os.unlink(tmp.name)
    if img is None:
        return jsonify({"error": "Image not readable"}), 400
    img = cv2.resize(img, (400, 400))
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            vecteurs = []
            for lm in hand_landmarks.landmark:
                vecteurs.extend([lm.x, lm.y, lm.z])
            # Envoie la requête à l'API de prédiction
            payload = {"vector": vecteurs}
            response = requests.post("http://127.0.0.1:5000/predict", json=payload)
            return jsonify(response.json())
    else:
        return jsonify({"error": "No hand detected"}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)