import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import HomeScreen from './Components/HomeScreen';
import SearchResultsScreen from './Components/SearchResultsScreen';
import BookmarksScreen from './Components/BookmarksScreen';
import PushNotification from 'react-native-push-notification';
import FilteredSearchScreen from './Components/FilteredSearchScreen';

enableScreens();

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FilteredSearch" component={FilteredSearchScreen} />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
        <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

