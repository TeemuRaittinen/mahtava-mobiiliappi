import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ArticleCard from './ArticleCard';
import { REACT_APP_NEWS_API_KEY } from '@env';

const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

const SearchResultsScreen = ({ route, navigation, theme }) => {
  const { initialKeyword } = route.params;
  const [keyword, setKeyword] = useState(initialKeyword || '');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);  // Initialize as empty array

  useEffect(() => {
    searchNews();
    loadBookmarks();
  }, []);

  // Load bookmarks from AsyncStorage
  const loadBookmarks = async () => {
    try {
      const storedBookmarks = await AsyncStorage.getItem('bookmarkedArticles');
      if (storedBookmarks) {
        setBookmarkedArticles(JSON.parse(storedBookmarks));
      } else {
        // If no bookmarks are stored, initialize to empty array
        setBookmarkedArticles([]);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setBookmarkedArticles([]);  // Ensure it's initialized to an empty array on error
    }
  };

  // Save bookmarks to AsyncStorage
  const saveBookmarks = async (newBookmarks) => {
    try {
      await AsyncStorage.setItem('bookmarkedArticles', JSON.stringify(newBookmarks));
      setBookmarkedArticles(newBookmarks);
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  // Toggle bookmark status for an article
  const toggleBookmark = (article) => {
    let updatedBookmarks = [...bookmarkedArticles];
    if (bookmarkedArticles.some(a => a.url === article.url)) {
      // Remove bookmark if already exists
      updatedBookmarks = updatedBookmarks.filter(a => a.url !== article.url);
    } else {
      // Add bookmark if not already bookmarked
      updatedBookmarks.push(article);
    }
    saveBookmarks(updatedBookmarks);  // Persist bookmarks
  };

  const searchNews = async () => {
    if (!keyword) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${API_KEY}`
      );
      setArticles(response.data.articles);
    } catch (err) {
      console.log(err); // THIS IS WEIRD!! Jos poistan tän logituksen, appi ei toimi. WTF?!
      setError('Failed to fetch news articles. Try again later.');
    }
    setLoading(false);
  };

  // User's choice for theme
  const isDarkMode = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
        value={keyword}
        onChangeText={text => setKeyword(text)}
        placeholder="Search for news..."
        onSubmitEditing={searchNews}
      />
      <Button title="Search" onPress={searchNews} />

      {/* Back Button */}
      <Button title="Back to Home" onPress={() => navigation.goBack()} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ArticleCard
              article={item}
              bookmarkedArticles={bookmarkedArticles} // Pass bookmarked articles
              toggleBookmark={toggleBookmark} // Pass toggle bookmark function
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
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
    marginTop: 10,
  },
});

export default SearchResultsScreen;
