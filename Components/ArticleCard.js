import React from "react";
import { View, Text, Image, Linking, StyleSheet, TouchableOpacity } from "react-native";

const ArticleCard = ({ article }) => {
  return (
    <View style={styles.card}>
      {article.urlToImage ? (
        <Image source={{ uri: article.urlToImage }} style={styles.image} />
      ) : null}
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.description}>{article.description}</Text>

      <TouchableOpacity onPress={() => Linking.openURL(article.url)}>
        <Text style={styles.link}>Read Full Article</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  image: {
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  link: {
    fontSize: 16,
    color: "#007BFF",
  },
});

export default ArticleCard;
