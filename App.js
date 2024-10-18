import React, { useState, useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
// import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import HomeScreen from './Components/HomeScreen';
import SearchResultsScreen from './Components/SearchResultsScreen';
import BookmarksScreen from './Components/BookmarksScreen';
<<<<<<< HEAD
// import NotificationPreferencesScreen from './Components/NotificationPreferencesScreen';
import { requestUserPermission, getToken } from './NotificationService';
=======
import PushNotification from 'react-native-push-notification';
import FilteredSearchScreen from './Components/FilteredSearchScreen';

>>>>>>> main

enableScreens();

const Stack = createStackNavigator();

const App = () => {
  const [theme, setTheme] = useState();

  useEffect(() => {
    // Create a notification channel for Android 8.0+
    PushNotification.createChannel(
      {
        channelId: 'your-channel-id', // (required)
        channelName: 'Your Channel Name', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) 
        sound: 'default', // (optional) Sound for notifications
        importance: PushNotification.Importance.HIGH, // (optional) Importance level
        vibrate: true, // (optional) Vibrate on notification
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) Callback
    );

    // Request notification permission when the app starts
    requestUserPermission().then(() => {
      getToken();
    });

    // Listen for notifications when the app is in the foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);

      // Display the notification using PushNotification
      PushNotification.localNotification({
        channelId: 'your-channel-id', // The channel ID created above
        title: remoteMessage.notification.title, // Title from the FCM message
        message: remoteMessage.notification.body, // Body from the FCM message
        playSound: true,
        soundName: 'default', // Play default sound
      });
    });

    // Unsubscribe from the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {props => <HomeScreen {...props} theme={theme} setTheme={setTheme} />}
        </Stack.Screen>
         <Stack.Screen name="FilteredSearch">
          {props => <FilteredSearchScreen {...props} theme={theme} setTheme={setTheme} />}
        </Stack.Screen>
        <Stack.Screen name="Search Results">
          {props => <SearchResultsScreen {...props} theme={theme} setTheme={setTheme} />}
        </Stack.Screen>
        <Stack.Screen name="Bookmarks">
          {props => <BookmarksScreen {...props} theme={theme} setTheme={setTheme} />}
        </Stack.Screen>
<<<<<<< HEAD
        {/* <Stack.Screen name="Notification Preferences">
          {props => <NotificationPreferencesScreen {...props} theme={theme} setTheme={setTheme} />}
        </Stack.Screen> */}
=======
>>>>>>> main
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
