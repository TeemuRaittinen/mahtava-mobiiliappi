import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ArticleCard from './ArticleCard';

const BookmarksScreen = ({ theme }) => {
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]); // Initialize as empty array

  // Determine if dark mode is active
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    loadBookmarks();
  }, []);

  // Load bookmarks from AsyncStorage
  const loadBookmarks = async () => {
    try {
      const storedBookmarks = await AsyncStorage.getItem('bookmarkedArticles');
      if (storedBookmarks) {
        setBookmarkedArticles(JSON.parse(storedBookmarks));
      } else {
        setBookmarkedArticles([]); // Handle no bookmarks
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setBookmarkedArticles([]); // Ensure it's an empty array on error
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

  // Toggle bookmark status (unbookmark an article)
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

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>Bookmarked Articles</Text>
      {bookmarkedArticles.length === 0 ? (
        <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>No articles bookmarked yet.</Text>
      ) : (
        <FlatList
          data={bookmarkedArticles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              {/* Pass bookmarkedArticles and toggleBookmark to ArticleCard */}
              <ArticleCard
                article={item}
                bookmarkedArticles={bookmarkedArticles} // Pass current bookmarked articles
                toggleBookmark={toggleBookmark} // Pass function to unbookmark
              />
            </View>
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default BookmarksScreen;
