# 📱 Práctica Firebase - React Native

Este proyecto es una aplicación móvil desarrollada con **React Native** y **Firebase**, utilizando **Expo** para la ejecución y desarrollo.  
Incluye autenticación de usuarios, navegación entre pantallas y configuración con Firebase.

---

## 👨‍💻 Integrante
- **Nelson Alexander Sandoval Aguilar** - *20200300*
- **Gerardo Steven Quintanilla López** - *20210490*  

---

## 🎥 Video demostrativo


--- https://drive.google.com/file/d/1T_nOYfdefyokw9DhHD0qm07-RtJwQUYY/view?usp=drivesdk 

## 📂 Estructura del proyecto
src/
├── components/ # Componentes reutilizables
├── config/
│ └── firebase.js # Configuración de Firebase
├── context/
│ └── UserContext.js # Contexto global para usuario
├── navigation/
│ └── Navigation.js # Lógica de navegación
├── screens/ # Vistas principales
│ ├── EditProfileScreen.js
│ ├── HomeScreen.js
│ ├── LoginScreen.js
│ ├── RegisterScreen.js
│ └── SplashScreen.js
├── App.js # Punto de entrada principal
└── index.js # Registro de la app


---

## 📦 Dependencias utilizadas

Estas son las librerías principales que se usaron en el proyecto:

- **Expo**  
  - `expo`  
  - `expo-constants`  
  - `expo-image-picker`  
  - `expo-status-bar`  

- **React Navigation**  
  - `@react-navigation/native`  
  - `@react-navigation/native-stack`  
  - `@react-navigation/bottom-tabs`  

- **React Native**  
  - `react-native-gesture-handler`  
  - `react-native-safe-area-context`  
  - `react-native-screens`  
  - `@react-native-picker/picker`  
  - `@react-native-async-storage/async-storage`  

- **Firebase**  
  - `firebase`  

- **Dotenv**  
  - `react-native-dotenv` (manejo de variables de entorno)  

- **Vector Icons**  
  - `@expo/vector-icons`  

---

## 🚀 Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/usuario/practica-firebase.git
   cd practica-firebase

2. Instalar dependencias
    ```bash
    npm install

3. Configurar el archivo .env con tus credenciales
   ```bash
   API_KEY=tu_api_key
   AUTH_DOMAIN=tu_auth_domain
   PROJECT_ID=tu_project_id
   STORAGE_BUCKET=tu_storage_bucket
   MESSAGING_SENDER_ID=tu_sender_id
   APP_ID=tu_app_id

4. Ejecuta el proyecto:
   ```bash
   npm start
  
## 🛠️ Funcionalidades principales

Registro e inicio de sesión de usuarios con Firebase

Navegación entre pantallas (Login, Registro, Home, Perfil, Splash)

Edición de perfil de usuario

Manejo de variables de entorno con .env


## 📌 Notas

Asegúrate de configurar correctamente Firebase antes de ejecutar la app.

El archivo .env no debe subirse al repositorio (ya está en .gitignore).
