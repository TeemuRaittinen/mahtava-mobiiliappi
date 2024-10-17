import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import ArticleCard from './ArticleCard';
import { REACT_APP_NEWS_API_KEY } from '@env';

const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

const SearchResultsScreen = ({ route, navigation }) => {
  const { initialKeyword, filters } = route.params; 
  const [keyword, setKeyword] = useState(initialKeyword || '');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    searchNews(); 
  }, [initialKeyword, filters]);

  // Search news from topheadlines endpoit
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

  //Search news from everythigendpoint
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

  const searchNews = async () => {
    setLoading(true);
    setError('');

    const { filters } = route.params || {};
    const { category, source, country, language, dateRange } = filters || {};
    const fromDate = dateRange?.from ? dateRange.from : null;
    const toDate = dateRange?.to ? dateRange.to : null;

    try {
        let articles = [];

        // Fetch articles based on selected filters
        if (source || language || keyword) {
            articles = await fetchEverything(source, language, fromDate, toDate);
        } else {
            articles = await fetchTopHeadlines(category, country, fromDate, toDate);
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
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
          renderItem={({ item }) => <ArticleCard article={item} />}
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



