import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ArticleCard from './Components/ArticleCard'; 
import BookmarksScreen from './Components/BookmarksScreen';
import { REACT_APP_NEWS_API_KEY } from '@env';

enableScreens();

const Stack = createStackNavigator();
const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

const HomeScreen = ({ navigation }) => {
  const [keyword, setKeyword] = useState('');
  const [articles, setArticles] = useState([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const storedBookmarks = await AsyncStorage.getItem('bookmarkedArticles');
      if (storedBookmarks) {
        setBookmarkedArticles(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const saveBookmarks = async (newBookmarks) => {
    try {
      await AsyncStorage.setItem('bookmarkedArticles', JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  const toggleBookmark = (article) => {
    let updatedBookmarks = [...bookmarkedArticles];
    if (bookmarkedArticles.some(a => a.url === article.url)) {
      updatedBookmarks = updatedBookmarks.filter(a => a.url !== article.url);
    } else {
      updatedBookmarks.push(article);
    }
    setBookmarkedArticles(updatedBookmarks);
    saveBookmarks(updatedBookmarks);
  };

  const searchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${API_KEY}`
      );
      setArticles(response.data.articles);
    } catch (err) {
      setError('Failed to fetch news articles. Try again later.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Newsapi-appi</Text>
      
      <TextInput
        style={styles.input}
        value={keyword}
        onChangeText={text => setKeyword(text)}
        placeholder="Search for news..."
      />
      <Button title="Search" onPress={searchNews} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={articles}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <ArticleCard article={item} />
            <Button
              title={bookmarkedArticles.some(a => a.url === item.url) ? 'Unbookmark' : 'Bookmark'}
              onPress={() => toggleBookmark(item)}
            />
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('Bookmarks')}
        style={styles.bookmarkButton}>
        <Text style={styles.bookmarkButtonText}>View Bookmarked Articles</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
  },
  bookmarkButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
  },
  bookmarkButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default App;
