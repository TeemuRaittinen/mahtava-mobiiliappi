import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const RegisterScreen = ({ navigation, route, theme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password

  const handleRegister = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match!"); // Show alert if passwords don't match
      return; // Exit the function if they don't match
    }

    try {
      // Käytä auth() rekisteröimiseen
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log('User registered:', user);
      // Voit siirtää käyttäjän toiseen näyttöön rekisteröinnin jälkeen
      navigation.navigate('Home'); // Muuta 'Home' sen näytön nimeksi, johon haluat siirtyä
    } catch (error) {
      console.error('Registration error:', error.message);
      alert(error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
      <Text style={[styles.heading, { color: theme === 'dark' ? '#fff' : '#000' }]}>Register</Text>
      <TextInput
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000', borderColor: theme === 'dark' ? '#555' : '#ccc' }]}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
      />
      <TextInput
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000', borderColor: theme === 'dark' ? '#555' : '#ccc' }]}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
      />

      <TextInput
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000', borderColor: theme === 'dark' ? '#555' : '#ccc' }]}
        value={confirmPassword}
        onChangeText={setConfirmPassword} // Update confirm password state correctly
        placeholder="Confirm Password"
        secureTextEntry
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
      />

      {/* Add a little gap between buttons */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.buttonGap} />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  buttonGap: {
    height: 10,
  },
});

export default RegisterScreen;
