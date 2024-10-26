import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';

const ChangeEmailScreen = ({ theme }) => {
    const [newEmail, setNewEmail] = useState('');

    const handleChangeEmail = async () => {
        const user = auth().currentUser;

        try {
            await user.updateEmail(newEmail);
            Alert.alert('Email changed successfully');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
            <Text style={[styles.heading, { color: theme === 'dark' ? '#fff' : '#000' }]}>Change Email</Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        borderColor: theme === 'dark' ? '#555' : '#ccc',
                        color: theme === 'dark' ? '#fff' : '#000',
                    },
                ]}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="New Email"
                placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
                <Text style={styles.buttonText}>Change Email</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
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
});

export default ChangeEmailScreen;
