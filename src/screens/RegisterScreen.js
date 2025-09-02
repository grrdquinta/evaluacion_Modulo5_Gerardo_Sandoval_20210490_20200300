import React, { useState } from 'react';
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useUser } from '../context/UserContext';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    edad: '',
    especialidad: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useUser();

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { nombre, email, password, confirmPassword, edad, especialidad } = formData;

    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }

    if (!email.trim() || !isValidEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo válido');
      return false;
    }

    if (!password || password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
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

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await register(formData);
      
      if (result.success) {
        Alert.alert(
          'Registro Exitoso',
          'Tu cuenta ha sido creada correctamente',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        Alert.alert('Error', result.error || 'Error al registrar usuario');
      }

    } catch (error) {
      Alert.alert('Error', 'Error al registrar usuario');
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Completa todos los campos</Text>
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
            <Text style={styles.label}>Contraseña *</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Contraseña *</Text>
            <TextInput
              style={styles.input}
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry
              autoCapitalize="none"
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
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta? <Text style={styles.linkBold}>Inicia Sesión</Text>
            </Text>
          </TouchableOpacity>
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
    marginTop: 20,
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
  button: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  linkText: {
    fontSize: 16,
    color: '#666',
  },
  linkBold: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;