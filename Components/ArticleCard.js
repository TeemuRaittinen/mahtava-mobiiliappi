import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { saveArticle, addComment } from './SQLiteService';
import auth from '@react-native-firebase/auth';

const ArticleCard = ({ article, bookmarkedArticles, toggleBookmark }) => {
  const [translatedText, setTranslatedText] = useState('');
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const [comment, setComment] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setIsLoggedIn(!!user); 
    });

   
    return () => unsubscribe();
  }, []); 

  const translateArticle = async () => {
    setLoadingTranslation(true);
    try {
      const response = await axios.post(
        'https://translation.googleapis.com/language/translate/v2?key=AIzaSyDJhhnRcr0YazP2xc-14ke0xJ9KBHnZtDY', 
        {
          q: article.title + ' ' + article.description,
          target: 'fi',
        }
      );
      const translated = response.data.data.translations[0].translatedText;
      setTranslatedText(translated);
    } catch (err) {
      console.error('Translation failed', err);
    }
    setLoadingTranslation(false);
  };

  const handleSaveArticle = () => {
    if (!isLoggedIn) {
      Alert.alert('You must be logged in to save articles.'); 
      return;
    }
    setModalVisible(true);
  };

  const handleModalSave = () => {
    //save to db
    saveArticle(article.title, article.description, article.content, (newArticleId) => {
      console.log('Article saved with ID:', newArticleId);

      // Add comment
      if (comment.trim() !== "") {
        addComment(newArticleId, comment, () => {
          console.log('Comment added:', comment);
          setComment('');
        });
      }

      setModalVisible(false);  
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{article.title || 'No Title Available'}</Text>
      <Text style={styles.description}>{article.description || 'No description available'}</Text>

      <TouchableOpacity onPress={translateArticle} style={styles.translateButton}>
        <Text style={styles.translateButtonText}>TRANSLATE ARTICLE</Text>
      </TouchableOpacity>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>Warning: Translations may alter the meaning of the article.</Text>
      </View>

      {loadingTranslation ? (
        <ActivityIndicator />
      ) : translatedText ? (
        <Text style={styles.translatedText}>{translatedText}</Text>
      ) : null}

      <Button title="Save Article" onPress={handleSaveArticle} color="#007BFF" />
      
      {/* Bookmark */}
      <Button
        title={bookmarkedArticles.some(a => a.url === article.url) ? 'UnBookmark' : 'Bookmark'}
        onPress={() => toggleBookmark(article)}
        color="#007BFF"
      />

      {/* Modal kommenttia varten */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a Comment (Optional)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment here"
              value={comment}
              onChangeText={setComment}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Save" onPress={handleModalSave} color="#007BFF" />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#007BFF" />
            </View>
          </View>
        </View>
      </Modal>
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
  warningBox: {
    borderColor: '#FFA500',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#FFF8E1',
    borderRadius: 5,
    marginVertical: 10,
  },
  warningText: {
    color: '#ba4a00',
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
  commentInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginTop: 10,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default ArticleCard;
