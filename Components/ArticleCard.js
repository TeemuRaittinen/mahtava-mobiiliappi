import React from 'react';
import { View, Text, Image, Linking, StyleSheet, TouchableOpacity, Button } from 'react-native';

const ArticleCard = ({ article, bookmarkedArticles, toggleBookmark }) => {
  const handlePress = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  return (
    <View style={styles.card}>
      {article.urlToImage ? (
        <Image source={{ uri: article.urlToImage }} style={styles.image} />
      ) : null}
      <Text style={styles.title}>{article.title || 'No Title Available'}</Text>
      <Text style={styles.description}>{article.description || 'No description available'}</Text>

      <TouchableOpacity onPress={() => handlePress(article.url)}>
        <Text style={styles.link}>Read Full Article</Text>
      </TouchableOpacity>

      {/* Bookmark Button */}
      <Button
        title={bookmarkedArticles.some(a => a.url === article.url) ? 'Unbookmark' : 'Bookmark'}
        onPress={() => toggleBookmark(article)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  link: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 8,
  },
});

export default ArticleCard;
