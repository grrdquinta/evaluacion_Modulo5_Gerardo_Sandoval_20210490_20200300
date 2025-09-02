import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../context/UserContext';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateProfile, uploadProfileImage } = useUser();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    edad: '',
    especialidad: '',
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const especialidades = [
    { label: 'Selecciona una especialidad', value: '' },
    { label: 'Desarrollo de Software', value: 'software' },
    { label: 'Electromecanica', value: 'emca' },
    { label: 'Electronica', value: 'eca' },
    { label: 'Energia Renovables', value: 'energia' },
    { label: 'Contabilidad', value: 'conta' },
    { label: 'Mecanica Automotriz', value: 'auto' },
    { label: 'Arquitectura', value: 'arqui' },
    { label: 'Diseño Grafico', value: 'disenio' },
    { label: 'Otra', value: 'otra' },
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        edad: user.edad?.toString() || '',
        especialidad: user.especialidad || '',
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const validateForm = () => {
    const { nombre, email, edad, especialidad } = formData;

    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }

    if (!email.trim() || !isValidEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo válido');
      return false;
    }

    if (!edad || isNaN(edad) || parseInt(edad) < 1 || parseInt(edad) > 120) {
      Alert.alert('Error', 'Por favor ingresa una edad válida');
      return false;
    }

    if (!especialidad) {
      Alert.alert('Error', 'Por favor selecciona una especialidad');
      return false;
    }

    return true;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (!hasChanges) {
      Alert.alert('Sin cambios', 'No hay cambios para guardar');
      return;
    }

    setLoading(true);

    try {
      const updatedData = {
        nombre: formData.nombre,
        email: formData.email,
        edad: parseInt(formData.edad),
        especialidad: formData.especialidad,
      };

      const result = await updateProfile(updatedData);
      
      if (result.success) {
        setHasChanges(false);
        Alert.alert(
          'Perfil Actualizado',
          'Tus datos han sido actualizados correctamente'
        );
      } else {
        Alert.alert('Error', result.error || 'Error al actualizar el perfil');
      }

    } catch (error) {
      Alert.alert('Error', 'Error al actualizar el perfil');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Descartar Cambios',
        '¿Estás seguro que deseas descartar los cambios?',
        [
          { text: 'Continuar Editando', style: 'cancel' },
          { 
            text: 'Descartar', 
            style: 'destructive',
            onPress: () => {
              // Restaurar datos originales
              if (user) {
                setFormData({
                  nombre: user.nombre || '',
                  email: user.email || '',
                  edad: user.edad?.toString() || '',
                  especialidad: user.especialidad || '',
                });
                setHasChanges(false);
              }
            }
          },
        ]
      );
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Cambiar Contraseña',
      'Te enviaremos un correo para restablecer tu contraseña',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar Correo',
          onPress: () => {
            // Aquí implementarías el reset de contraseña
            // sendPasswordResetEmail(auth, formData.email);
            Alert.alert('Correo Enviado', 'Revisa tu bandeja de entrada');
          }
        }
      ]
    );
  };

  // Función para seleccionar imagen de perfil
  const selectProfileImage = async () => {
    try {
      // Pedir permisos
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permisos requeridos', 'Necesitas dar permisos para acceder a la galería');
        return;
      }

      // Abrir la galería
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Imagen cuadrada
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setUploadingImage(true);
        
        const uploadResult = await uploadProfileImage(result.assets[0].uri);
        
        if (uploadResult.success) {
          Alert.alert('¡Listo!', 'Tu foto de perfil se ha actualizado correctamente');
        } else {
          Alert.alert('Error', uploadResult.error || 'Error al subir la imagen');
        }
        
        setUploadingImage(false);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Error al seleccionar la imagen');
      setUploadingImage(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Mi Perfil</Text>
          <Text style={styles.subtitle}>Modifica tu información personal</Text>
          
          {/* Sección de imagen de perfil */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              {user?.profileImage ? (
                <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={60} color="#ccc" />
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={selectProfileImage}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <Ionicons name="hourglass" size={16} color="#fff" />
                ) : (
                  <Ionicons name="camera" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
            
            {uploadingImage && (
              <Text style={styles.uploadingText}>Subiendo imagen...</Text>
            )}
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre Completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre completo"
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo Electrónico *</Text>
            <TextInput
              style={styles.input}
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Edad *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu edad en años"
              value={formData.edad}
              onChangeText={(value) => handleInputChange('edad', value)}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Especialidad *</Text>
            {Platform.OS === 'ios' ? (
              <View style={styles.iosPickerContainer}>
                <Picker
                  selectedValue={formData.especialidad}
                  onValueChange={(value) => handleInputChange('especialidad', value)}
                  style={styles.iosPicker}
                  itemStyle={styles.iosPickerItem}
                >
                  {especialidades.map((item, index) => (
                    <Picker.Item 
                      key={index} 
                      label={item.label} 
                      value={item.value} 
                    />
                  ))}
                </Picker>
              </View>
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.especialidad}
                  onValueChange={(value) => handleInputChange('especialidad', value)}
                  style={styles.picker}
                >
                  {especialidades.map((item, index) => (
                    <Picker.Item 
                      key={index} 
                      label={item.label} 
                      value={item.value} 
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.passwordButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.passwordButtonText}>Cambiar Contraseña</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button, 
                styles.saveButton,
                loading && styles.buttonDisabled,
                !hasChanges && styles.buttonDisabled
              ]}
              onPress={handleSave}
              disabled={loading || !hasChanges}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#6200EE',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    borderWidth: 3,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6200EE',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  uploadingText: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  // Estilos específicos para iOS
  iosPickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    height: 120, // Altura fija para iOS
    justifyContent: 'center',
  },
  iosPicker: {
    height: 120,
    width: '100%',
  },
  iosPickerItem: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  passwordButton: {
    alignItems: 'center',
    paddingVertical: 15,
    marginVertical: 10,
  },
  passwordButtonText: {
    fontSize: 16,
    color: '#6200EE',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 15,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#6200EE',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default EditProfileScreen;