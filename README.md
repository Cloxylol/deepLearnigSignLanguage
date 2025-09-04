# 📱 SignLensAI — Reconnaissance de la langue des signes (ASL)

Projet étudiant (introduction au Machine Learning / Deep Learning).  
Application mobile **Expo React Native** permettant de reconnaître les signes de l’alphabet américain (ASL) à partir de la caméra du téléphone.

---

## 🚀 Fonctionnalités

- **Mode Photo** : importer une image ou prendre une photo pour obtenir la prédiction (Top-3).
- **Mode Live** : lecture continue de la caméra → affichage en temps réel des lettres reconnues, avec lissage anti-bruit.
- **Lecture vocale** : prononce la lettre reconnue (via `expo-speech`).
  
---

## 🏗️ Architecture

- **Frontend mobile** : Expo React Native
  - Navigation : `@react-navigation/native`
  - Caméra : `expo-camera`
  - Reconnaissance : **API Flask**
  - UI : composants React Native custom

- **Backend** : API Flask
  - Expose `/predict_image` et `/predict_landmarks`
  - Charge le modèle **mediapipe_vector_model.h5**
  - Retourne la prédiction 


---

## ⚙️ Installation & Lancement

### Prérequis
- Node.js + npm
- Expo CLI (`npx expo`)
- Expo Go installé sur smartphone

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/Cloxylol/deepLearnigSignLanguage.git
cd signlensai

# 2. Installer les dépendances
npm install

# 3. Lancer Expo
npx expo start

```

Scanner le QR code avec Expo Go sur ton téléphone.



##  👥 Auteurs

+ Cloé Petetin — frontend mobile (Expo)

+ Rémy Legras — backend Flask (API / modèle)





