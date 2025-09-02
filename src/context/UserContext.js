import React, { useState, createContext, useContext } from 'react';
import { collection, addDoc, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../config/firebase';

// Crear contexto para el estado del usuario
const UserContext = createContext({});

// Hook para usar el contexto de usuario
export const useUser = () => useContext(UserContext);

// Componente proveedor de usuario
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  // useEffect para controlar el splash screen
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setIsLoading(false);
    }, 3000); // 3 segundos de splash obligatorio

    return () => clearTimeout(timer);
  }, []);

  // Función para login simple (buscar usuario por email)
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      console.log('Buscando usuario con email:', email);
      
      // Buscar usuario en Firestore por email
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Usuario encontrado
        const userDoc = querySnapshot.docs[0];
        const userData = { id: userDoc.id, ...userDoc.data() };
        
        // Verificar contraseña (comparación simple)
        if (userData.password === password) {
          setUser(userData);
          setIsLoading(false);
          console.log('Login exitoso:', userData.nombre);
          return { success: true, user: userData };
        } else {
          setIsLoading(false);
          return { success: false, error: 'Contraseña incorrecta' };
        }
      } else {
        setIsLoading(false);
        return { success: false, error: 'Usuario no encontrado' };
      }

    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    }
  };

  // Función para registro (guardar usuario en Firestore)
  const register = async (userData) => {
    try {
      setIsLoading(true);
      console.log('Registrando usuario:', userData.email);
      
      // Verificar si el email ya existe
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where("email", "==", userData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setIsLoading(false);
        return { success: false, error: 'Ya existe una cuenta con este correo electrónico' };
      }

      // Crear nuevo documento de usuario
      const userDocData = {
        nombre: userData.nombre,
        email: userData.email,
        password: userData.password, // En producción deberías encriptar esto
        edad: parseInt(userData.edad),
        especialidad: userData.especialidad,
        profileImage: '',
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(firestore, 'users'), userDocData);
      console.log('Usuario registrado con ID:', docRef.id);

      setIsLoading(false);
      return { success: true };

    } catch (error) {
      setIsLoading(false);
      console.error('Register error:', error);
      return { success: false, error: 'Error al registrar usuario' };
    }
  };

  // Función para logout (limpiar estado)
  const logout = async () => {
    setUser(null);
    console.log('Sesión cerrada');
    return { success: true };
  };

  // Función para actualizar perfil
  const updateProfile = async (updatedData) => {
    try {
      if (!user?.id) {
        return { success: false, error: 'No hay usuario activo' };
      }

      console.log('Actualizando perfil del usuario:', user.id);
      
      await updateDoc(doc(firestore, 'users', user.id), {
        ...updatedData,
        updatedAt: new Date()
      });

      // Actualizar el estado local
      setUser(prevUser => ({ ...prevUser, ...updatedData }));
      console.log('Perfil actualizado exitosamente');
      
      return { success: true };

    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Error al actualizar el perfil' };
    }
  };

  // Función para subir imagen de perfil
  const uploadProfileImage = async (imageUri) => {
    try {
      if (!user?.id || !imageUri) {
        return { success: false, error: 'No hay usuario o imagen' };
      }

      console.log('Subiendo imagen de perfil...');
      const imageRef = ref(storage, `profile_images/${user.id}_${Date.now()}`);

      const response = await fetch(imageUri);
      const blob = await response.blob();

      const snapshot = await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Actualizar el documento del usuario con la nueva imagen
      await updateDoc(doc(firestore, 'users', user.id), {
        profileImage: imageUrl,
        updatedAt: new Date()
      });

      // Actualizar el estado local
      setUser(prevUser => ({ ...prevUser, profileImage: imageUrl }));
      
      console.log('Imagen de perfil actualizada:', imageUrl);
      return { success: true, imageUrl };

    } catch (error) {
      console.error('Error uploading profile image:', error);
      return { success: false, error: 'Error al subir la imagen' };
    }
  };

  const value = {
    user,
    isLoading,
    showSplash,
    login,
    register,
    logout,
    updateProfile,
    uploadProfileImage,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};