import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import ArticleCard from './ArticleCard';
import { REACT_APP_NEWS_API_KEY } from '@env'; 

const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

const SearchResultsScreen = ({ route, navigation }) => {
  const { initialKeyword } = route.params; 
  const [keyword, setKeyword] = useState(initialKeyword || '');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    searchNews(); 
  }, []);

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
      setError('Failed to fetch news articles. Try again later.');
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
