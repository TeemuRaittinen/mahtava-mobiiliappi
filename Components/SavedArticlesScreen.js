import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { getSavedArticles, deleteArticle, updateComment, deleteComment } from './SQLiteService';
import auth from '@react-native-firebase/auth';

const SavedArticlesScreen = ({ theme }) => {
    const [articles, setArticles] = useState([]);
    const [editCommentId, setEditCommentId] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            setIsLoggedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        fetchSavedArticles();
    }, [isLoggedIn]);

    const fetchSavedArticles = async () => {
        if (isLoggedIn) {
            try {
                const fetchedArticles = await getSavedArticles();
                setArticles(fetchedArticles);
            } catch (error) {
                console.error("Error fetching saved articles:", error);
            }
        } else {
            setArticles([]);
        }
    };

    const handleDeleteArticle = async (articleId) => {
        await deleteArticle(articleId);
        fetchSavedArticles();
    };

    const handleUpdateComment = async () => {
        if (editCommentId && newCommentText) {
            await updateComment(editCommentId, newCommentText);
            setEditCommentId(null);
            setNewCommentText('');
            fetchSavedArticles();
        }
    };

    const handleDeleteComment = async (commentId) => {
        await deleteComment(commentId);
        fetchSavedArticles();
    };

    const startEditingComment = (commentId, commentText) => {
        setEditCommentId(commentId);
        setNewCommentText(commentText);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
            {isLoggedIn ? (
                <FlatList
                    data={articles}
                    keyExtractor={(item) => item.articleId.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.articleContainer, { backgroundColor: theme === 'dark' ? '#444' : '#fff' }]}>
                            <Text style={[styles.articleTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>{item.title}</Text>
                            <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>{item.description}</Text>
                            <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>{item.content}</Text>

                            <TouchableOpacity style={styles.button} onPress={() => handleDeleteArticle(item.articleId)}>
                                <Text style={styles.buttonText}>Delete Article</Text>
                            </TouchableOpacity>

                            {item.commentId ? (
                                <View key={item.commentId} style={styles.commentContainer}>
                                    <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>{item.commentText}</Text>

                                    {editCommentId === item.commentId ? (
                                        <View>
                                            <TextInput
                                                style={styles.input}
                                                value={newCommentText}
                                                onChangeText={setNewCommentText}
                                                placeholder="Update your comment"
                                            />
                                            <TouchableOpacity style={styles.button} onPress={handleUpdateComment}>
                                                <Text style={styles.buttonText}>Update Comment</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <TouchableOpacity 
                                            style={styles.button} 
                                            onPress={() => startEditingComment(item.commentId, item.commentText)}
                                        >
                                            <Text style={styles.buttonText}>Edit Comment</Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity style={styles.button} onPress={() => handleDeleteComment(item.commentId)}>
                                        <Text style={styles.buttonText}>Delete Comment</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>No comments for this article.</Text>
                            )}
                        </View>
                    )}
                />
            ) : (
                <Text style={[styles.loginPrompt, { color: theme === 'dark' ? '#fff' : '#000' }]}>Please log in to view your saved articles and comments.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    articleContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    articleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    commentContainer: {
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        marginBottom: 10,
    },
    loginPrompt: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
});

export default SavedArticlesScreen;
