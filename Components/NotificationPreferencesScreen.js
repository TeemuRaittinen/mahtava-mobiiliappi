// NOT RELEVANT AT THE MOMENT

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Button } from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import messaging from '@react-native-firebase/messaging'

// const topics = [
// { id: 'business', label: 'Business' },
// { id: 'entertainment', label: 'Entertainment' },
// { id: 'health', label: 'Health' },
// { id: 'science', label: 'Science' },
// { id: 'sports', label: 'Sports' },
// { id: 'technology', label: 'Technology' },
// ];

// const NotificationPreferencesScreen = ({ navigation }) => {
//     const [selectedTopics, setSelectedTopics] = useState({});

//     // Load saved preferences from AsyncStorage
//     const loadPreferences = async () => {
//         const preferences = await AsyncStorage.getItem('notificationPreferences');
//         if (preferences) {
//             setSelectedTopics(JSON.parse(preferences));
//         }
//     };

//     // Save preferences to AsyncStorage
//     const savePreferences = async () => {
//         await AsyncStorage.setItem('notificationPreferences', JSON.stringify(selectedTopics));

//         // Subscribe/unsubscribe from topics based on preferences
//         topics.forEach(async (topic) => {
//             if (selectedTopics[topic.id]) {
//                 // Subscribe to the selected topic
//                 await messaging().subscribeToTopic(topic.id);
//                 console.log(`Subscribed to ${topic.id}`);
//             } else {
//                 // Unsubscribe if the topic is not selected
//                 await messaging().unsubscribeFromTopic(topic.id);
//                 console.log(`Unsubscribed from ${topic.id}`);
//             }
//         });

//         navigation.navigate('Home'); // Navigate back to home or other screen
//     };

//     // Toggle topic selection
//     const toggleTopic = (id) => {
//         setSelectedTopics((prev) => ({
//             ...prev,
//             [id]: !prev[id],
//         }));
//     };

//     // Load preferences when the component mounts
//     React.useEffect(() => {
//         loadPreferences();
//     }, []);

//     return (
//         <View style={styles.container}>
//             <Text style={styles.heading}>Notification Preferences</Text>
//             {topics.map((topic) => (
//                 <View key={topic.id} style={styles.checkboxContainer}>
//                     <CheckBox
//                         value={selectedTopics[topic.id]}
//                         onValueChange={() => toggleTopic(topic.id)}
//                     />
//                     <Text style={styles.label}>{topic.label}</Text>
//                 </View>
//             ))}
//             <Button title="Save Preferences" onPress={savePreferences} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//         flex: 1,
//     },
//     heading: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     checkboxContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 10,
//     },
//     label: {
//         marginLeft: 10,
//         fontSize: 18,
//     },
// });

// export default NotificationPreferencesScreen;
