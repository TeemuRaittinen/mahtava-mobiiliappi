import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ArticleCard from './ArticleCard';


const BookmarksScreen = () => {
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bookmarked Articles</Text>
      {bookmarkedArticles.length === 0 ? (
        <Text>No articles bookmarked yet.</Text>
      ) : (
        <FlatList
          data={bookmarkedArticles}
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default BookmarksScreen;
