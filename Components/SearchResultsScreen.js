import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ArticleCard from './ArticleCard';
import { REACT_APP_NEWS_API_KEY } from '@env';

const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

const SearchResultsScreen = ({ route, navigation, theme }) => {
  const { initialKeyword, filters } = route.params;
  const [keyword, setKeyword] = useState(initialKeyword || '');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);  // Initialize as empty array

  const isDarkMode = theme === 'dark';

  useEffect(() => {
    loadBookmarks()
    searchNews(); 
  }, [initialKeyword, filters]);

  // Fetch news from topheadlines endpoit
  const fetchTopHeadlines = async (category, country, fromDate, toDate) => {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      ...(category && { category }),
      ...(country && { country }), 
      ...(keyword && { q: keyword }),
      ...(fromDate && { from: fromDate }),
      ...(toDate && { to: toDate }),
    });

    console.log('Fetching Top Headlines with params:', params.toString());

    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?${params.toString()}`);
        return response.data.articles;
    } catch (err) {
        console.error('Top Headlines API error:', err);
        throw err;
    }
};

  //Fetch news from everythigendpoint
  const fetchEverything = async (source, language, fromDate, toDate) => {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      ...(keyword && { q: keyword }), 
      ...(source && { sources: source }), 
      ...(language && { language }), 
      ...(fromDate && { from: fromDate }), 
      ...(toDate && { to: toDate }), 
    });
  
    try {
      const response = await axios.get(`https://newsapi.org/v2/everything?${params.toString()}`);
      return response.data.articles;
    } catch (err) {
      console.error('Everything API error:', err);
      throw err;
    }
  };


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

  // Search news articles
  const searchNews = async () => {
    setLoading(true);
    setError('');

    const { filters } = route.params || {};
    const { category, source, country, language, dateRange } = filters || {};
    const fromDate = dateRange?.from ? dateRange.from : null;
    const toDate = dateRange?.to ? dateRange.to : null;

    try {
        let articles = [];

        // Käytä top-headlines, jos kategoria on valittu, vaikka avainsanaa ei olisi
        if (category || country) {
            articles = await fetchTopHeadlines(category, country, fromDate, toDate);
        } else if (source || language || keyword) {
            articles = await fetchEverything(source, language, fromDate, toDate);
        }

        if (articles.length === 0) {
            setNoResults(true);
        } else {
            setArticles(articles);
        }

    } catch (err) {
        setError('Failed to fetch news articles. Try again later.');
        console.error('Error fetching articles:', err);
    }

    setLoading(false);
};
   

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
      <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />

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



