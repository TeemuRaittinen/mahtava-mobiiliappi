import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_NEWS_API_KEY } from '@env';

const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

const HomeScreen = ({ navigation }) => {
  const [keyword, setKeyword] = useState('');
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrendingNews();

    // Fetch trending news every 2 minutes
    const newsFetchInterval = setInterval(fetchTrendingNews, 120000);

    // Clean up interval (stop fetching news) when the component unmounts
    return () => {
      console.log("Clearing interval...");
      clearInterval(newsFetchInterval);
    };
  }, []);

  const fetchTrendingNews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
      );
      setTrendingArticles(response.data.articles);
    } catch (err) {
      setError('Failed to fetch trending news. Try again later.');
    }
    setLoading(false);
  };

  const searchNews = () => {
    if (!keyword) return;
    navigation.navigate('SearchResults', { initialKeyword: keyword, filters: {}});
  };


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Newsapi-appi</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.input}
        value={keyword}
        onChangeText={text => setKeyword(text)}
        placeholder="Search for news..."
        onSubmitEditing={searchNews}
      />
      <Button title="Search" onPress={searchNews} />

      {/* Button to navigate to filters */}
      <TouchableOpacity
        onPress={() => navigation.navigate('FilteredSearch')}
        style={styles.filterButton}>
        <Text style={styles.filterButtonText}>Search with Filters</Text>
      </TouchableOpacity>

      {/* Button to navigate to bookmarks */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Bookmarks')}
        style={styles.bookmarkButton}>
        <Text style={styles.bookmarkButtonText}>View Bookmarked Articles</Text>
      </TouchableOpacity>

      {/* Trending News Section */}
      <Text style={styles.subheading}>Trending News</Text>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={trendingArticles.slice(0, 5).filter(item => item.title !== '[Removed]')}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
            <Text style={styles.headlineText}>{item.title || 'No Title Available'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
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
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingTop: 15,
  },
  headlineText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    color: 'blue',
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
  filterButton:{
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
    borderRadius: 5,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 16,
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

export default HomeScreen;