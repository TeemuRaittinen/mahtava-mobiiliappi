import React, { useState } from 'react';
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
  const [theme, setTheme] = useState();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Pass the screen as children instead of inline component (cos that caused problems) */}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
