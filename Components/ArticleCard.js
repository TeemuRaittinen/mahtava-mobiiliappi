import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const ArticleCard = ({ article, bookmarkedArticles, toggleBookmark }) => {
  const [translatedText, setTranslatedText] = useState('');
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const translateArticle = async () => {
    setLoadingTranslation(true);
    try {
      const response = await axios.post(`https://translation.googleapis.com/language/translate/v2`, {
        q: article.title + ' ' + article.description,
        target: 'fi', 
        key: 'AIzaSyB-PyiQuigDxBTizmHpNlOBXffDvgREVBs',  
      });

      const translated = response.data.data.translations[0].translatedText;
      setTranslatedText(translated);
    } catch (err) {
      console.error('Translation failed', err);
    }
    setLoadingTranslation(false);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{article.title || 'No Title Available'}</Text>
      <Text style={styles.description}>{article.description || 'No description available'}</Text>

      {/* Translate button */}
      <TouchableOpacity onPress={translateArticle} style={styles.translateButton}>
        <Text style={styles.translateButtonText}>Translate Article</Text>
      </TouchableOpacity>

      {/* Warning about translations */}
      <Text style={styles.warning}>Warning: Translations may alter the meaning of the article.</Text>

      {/* Display loading or translated text */}
      {loadingTranslation ? (
        <ActivityIndicator />
      ) : translatedText ? (
        <Text style={styles.translatedText}>{translatedText}</Text>
      ) : null}

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
  warning: {
    color: 'red',
    marginVertical: 10,
  },
  translatedText: {
    color: '#555',
    marginVertical: 10,
  },
  translateButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  translateButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ArticleCard;
