import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';

const ChangePasswordScreen = ({ theme }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleChangePassword = async () => {
        const user = auth().currentUser;

        try {
            // Re-authenticate the user using the old password
            const credential = auth.EmailAuthProvider.credential(user.email, oldPassword);
            await user.reauthenticateWithCredential(credential); // Re-authenticate

            // Update the password
            await user.updatePassword(newPassword);
            Alert.alert('Password changed successfully');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
            <Text style={[styles.heading, { color: theme === 'dark' ? '#fff' : '#000' }]}>Change Password</Text>

            {/* Input for old password */}
            <TextInput
                style={[
                    styles.input,
                    {
                        borderColor: theme === 'dark' ? '#555' : '#ccc',
                        color: theme === 'dark' ? '#fff' : '#000',
                    },
                ]}
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Old Password"
                placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
                secureTextEntry
            />

            {/* Input for new password */}
            <TextInput
                style={[
                    styles.input,
                    {
                        borderColor: theme === 'dark' ? '#555' : '#ccc',
                        color: theme === 'dark' ? '#fff' : '#000',
                    },
                ]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>CHANGE PASSWORD</Text>
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

export default ChangePasswordScreen;
