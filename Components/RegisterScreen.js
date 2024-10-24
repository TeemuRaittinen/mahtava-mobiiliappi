import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const RegisterScreen = ({ navigation, route, theme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
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
      <Button title="Register" onPress={handleRegister} />
      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

// Add styles here
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
});

export default RegisterScreen;


