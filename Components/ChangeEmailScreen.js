import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';

const ChangeEmailScreen = ({ theme }) => {
    const [oldEmail, setOldEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const handleChangeEmail = async () => {
        const user = auth().currentUser;

        try {
            // Re-authenticate the user using the old email
            const credential = auth.EmailAuthProvider.credential(user.email, oldEmail);
            await user.reauthenticateWithCredential(credential); // Re-authenticate

            // Update the email
            await user.updateEmail(newEmail);
            Alert.alert('Email changed successfully');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
            <Text style={[styles.heading, { color: theme === 'dark' ? '#fff' : '#000' }]}>Change Email</Text>

            {/* Input for old email */}
            <TextInput
                style={[
                    styles.input,
                    {
                        borderColor: theme === 'dark' ? '#555' : '#ccc',
                        color: theme === 'dark' ? '#fff' : '#000',
                    },
                ]}
                value={oldEmail}
                onChangeText={setOldEmail}
                placeholder="Old Email"
                placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Input for new email */}
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
                <Text style={styles.buttonText}>CHANGE EMAIL</Text>
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
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
