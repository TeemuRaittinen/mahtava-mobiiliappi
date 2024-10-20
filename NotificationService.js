import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Alert } from 'react-native';

// Handle foreground messages
messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', remoteMessage);
    // Display the notification or show an alert
    Alert.alert('New Notification', remoteMessage.notification?.title, remoteMessage.notification?.body);
});

// Handle background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

const getToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM Token:', token); // This is your device token
};

export async function requestUserPermission() {

    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
                title: 'Notification Permission',
                message: 'This app needs access to send notifications.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission granted');
        } else {
            console.log('Notification permission denied');
        }
    } catch (err) {
        console.warn(err);
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
        console.log('Notification permission was granted.');
        await getToken();
    } else {
        console.log('Notification permission was denied.');
    }
}

