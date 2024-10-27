import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';

const SettingsScreen = ({ theme, setTheme, navigation }) => {

    const toggleTheme = (isDarkMode) => {
        const selectedTheme = isDarkMode ? 'dark' : 'light';
        setTheme(selectedTheme);
    };


    return (
        <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
            <Text style={[styles.heading, { color: theme === 'dark' ? '#fff' : '#000' }]}>Settings</Text>

            <View style={styles.settingRow}>
                <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
                <Switch
                    value={theme === 'dark'}
                    onValueChange={toggleTheme}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bookmarks')}>
                <Text style={styles.buttonText}>VIEW BOOKMARKED ARTICLES</Text>
            </TouchableOpacity>

            {/* Button to open Saved Articles screen */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Saved Articles')}>
                <Text style={styles.buttonText}>VIEW SAVED ARTICLES</Text>
            </TouchableOpacity>
           
            <Text style={[styles.subHeading, { color: theme === 'dark' ? '#fff' : '#000', marginTop: 20 }]}>
                Account Settings:
            </Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Change Email')}>
                <Text style={styles.buttonText}>CHANGE EMAIL</Text>
            </TouchableOpacity>
            <View style={styles.buttonGap} />

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Change Password')}>
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
        fontWeight: "bold",
        marginBottom: 16,
    },
    subHeading: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
        marginBottom: 14,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    buttonGap: {
        height: 15,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 3,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default SettingsScreen;
