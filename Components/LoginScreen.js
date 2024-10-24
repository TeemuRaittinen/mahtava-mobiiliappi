import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ navigation, route, theme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      Alert.alert('Login Successful');
      if (route.params?.onLogin) {
        route.params.onLogin(); // Update isLoggedIn state in HomeScreen
      }
      navigation.navigate('Home'); // Navigate to Home screen
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
      <Text style={[styles.heading, { color: theme === 'dark' ? '#fff' : '#000' }]}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Don't have an account? Register"
        onPress={() => navigation.navigate('Register')}
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

export default LoginScreen;
