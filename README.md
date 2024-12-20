﻿# WhatsAppClone-AppMobile-ReactNative
 # WhatsApp Clone - Mobile App

**Version :** 1.0  
**Auteur :** [Yasmine Souissi]  

---

## 📌 Description  
WhatsApp Clone est une application mobile interactive permettant une messagerie en temps réel multi-utilisateurs. L'application propose des fonctionnalités similaires à WhatsApp, notamment :  
- Création et gestion de comptes utilisateurs.  
- Envoi et réception de messages en temps réel.  
- Création et gestion de groupes de discussion.  
- Connexion sécurisée via Firebase.  
- Gestion des données avec Firebase Realtime Database et Supabase.  

---

## ✨ Fonctionnalités principales  
1. **Création de compte**  
   - Inscription via Firebase Authentication.  
   - Gestion sécurisée des sessions utilisateur.  

2. **Messagerie en temps réel**  
   - Envoi et réception de messages privés en temps réel.  
   - Historique des conversations stocké dans Firebase.  

3. **Groupes de discussion**  
   - Création de groupes.  
   - Rejoindre des groupes existants.  
   - Messagerie de groupe visible pour tous les membres.  

4. **Navigation intuitive**  
   - Gestion des écrans via React Navigation (onglets et piles).  

---

## 🛠️ Structure du projet  

### 1. **Frontend : Application Mobile**  
- **Framework :** React Native.  
- **Bibliothèques principales :**  
  - `react-navigation` : Gestion de la navigation.  
  - `react-native-vector-icons` : Icônes personnalisées.  
  - `firebase` : Authentification et base de données.  
- **Composants principaux :**  
  - `AuthScreen` : Inscription et connexion utilisateur.  
  - `ChatScreen` : Messagerie privée.  
  - `GroupScreen` : Messagerie de groupe.  
  - `ProfileScreen` : Gestion des profils.  

### 2. **Backend : Firebase et Supabase**  
- **Firebase Realtime Database :** Stockage des messages et des groupes en temps réel.  
- **Firebase Authentication :** Gestion des utilisateurs et des sessions.  
- **Supabase (optionnel) :** Stockage supplémentaire pour la gestion avancée des données.  

---

## ⚙️ Installation et configuration  

### Prérequis  
1. **Node.js** (version 14 ou ultérieure).  
2. **React Native CLI** ou **Expo CLI**.  
3. **Compte Firebase** et projet configuré.  
4. **Supabase** (optionnel).  

### Étapes d'installation  
1. **Cloner le projet GitHub :**  
   ```bash
   git clone https://github.com/votre-repo/whatsapp-clone.git
   cd whatsapp-clone
2. **Installer les dépendances :**
npm install
Configurer Firebase :

- Créez un projet Firebase sur Firebase Console.
- Activez l'authentification (e-mail et mot de passe).
- Activez la Realtime Database et configurez les règles d'accès.
- Remplissez le fichier Config.js avec vos clés Firebase.
2. **Démarrer l'application :**
npm start
## 🚀 Fonctionnement
2. **Inscription et connexion :**

Les utilisateurs créent un compte ou se connectent via Firebase Authentication.
Messagerie :

Les messages sont envoyés et reçus en temps réel.
Les conversations privées et de groupe sont gérées via Firebase Realtime Database.
3. **Gestion des groupes :**

- Créez un nouveau groupe via l'interface dédiée.
- Ajoutez des membres ou rejoignez un groupe existant.
## 🌐 Technologies utilisées
- Frontend : React Native.
- Backend : Firebase Authentication, Firebase Realtime Database, Supabase.
- API : React Navigation, React Native Vector Icons.
## 🤝 Contributeurs
[Yasmine Souissi] - Développeur principal.

Pour plus d'informations, contactez-moi sur souissiy35@gmail.com.


