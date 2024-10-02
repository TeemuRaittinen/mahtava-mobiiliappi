import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import ArticleCard from "./Components/ArticleCard";
import { REACT_APP_NEWS_API_KEY } from '@env';

const App = () => {
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

  const searchNews = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${API_KEY}`
      );
      setArticles(response.data.articles);
    } catch (err) {
      setError("Failed to fetch news articles. Try again later.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Newsapi-appi
      
      </Text>
      
      <TextInput
        style={styles.input}
        value={keyword}
        onChangeText={(text) => setKeyword(text)}
        placeholder="Search for news..."
      />

      <Button title="Search" onPress={searchNews} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={articles}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <ArticleCard article={item} />} 
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
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
  },
});
const searchNews = async () => {
  setLoading(true);
  setError("");

  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${API_KEY}`
    );
    setArticles(response.data.articles);
  } catch (err) {
    console.error("Error fetching articles:", err.response);
    setError("Failed to fetch news articles. Try again later.");
  }
  setLoading(false);
};

export default App;