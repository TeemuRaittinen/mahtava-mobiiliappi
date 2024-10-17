import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, Linking, Switch } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_NEWS_API_KEY } from '@env';

const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

const HomeScreen = ({ navigation, theme, setTheme }) => {
  const [keyword, setKeyword] = useState('');
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchTrendingNews();
    loadRecentSearches();

    // Fetch trending news every 2 minutes
    const newsFetchInterval = setInterval(fetchTrendingNews, 120000);
    // Clean up interval (stop fetching news) when the component unmounts
    return () => {
      console.log("Clearing interval...");
      clearInterval(newsFetchInterval);
    };
  }, []); // Empty array = this effect runs only on mount and unmount

  const toggleTheme = async (isDarkMode) => {
    const selectedTheme = isDarkMode ? 'dark' : 'light';
    setTheme(selectedTheme);
  };

  // User's choice for theme
  const isDarkMode = theme === 'dark';

  const fetchTrendingNews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
      );
      setTrendingArticles(response.data.articles);
    } catch (err) {
      setError('Failed to fetch trending news. Try again later.');

    }
    setLoading(false);
  };

  const searchNews = () => {
    if (!keyword) return;
    saveSearch(keyword);
    navigation.navigate('Search Results', { initialKeyword: keyword});
    setKeyword('');  // Clearing input field after search
  };

  const saveSearch = async (searchTerm) => {
    try {
      let searches = await AsyncStorage.getItem('recentSearches');
      searches = searches ? JSON.parse(searches) : [];

      // If search term already exists, it will be removed...
      searches = searches.filter(search => search !== searchTerm);

      searches.unshift(searchTerm); // ...and added to the top
      if (searches.length > 10) searches.pop(); // Storing the 10 latest searches

      await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
      setRecentSearches(searches);
    } catch (error) {
      console.log('Error saving search', error);
    }
  };

  // Load previous searches from AsyncStorage
  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem('recentSearches');
      if (searches !== null) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error("Failed to load recent searches");
    }
  };

  const handleRecentSearchClick = (search) => {
    setKeyword(search);
    setShowDropdown(false); // Hiding the dropdown when sth is selected
    searchNews();
  };

  const handleInputChange = (text) => {
    setKeyword(text);
    if (text === '' && recentSearches.length > 0) {
      setShowDropdown(true); // Showing dropdown if search field is empty
    } else {
      setShowDropdown(false); // Hiding dropdown if search field is not empty
    }
  };


  return (
    <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
        <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>Newsapi-appi</Text>

        {/* Switch for dark / light theme */}
        <View style={styles.themeSwitchContainer}>
          <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
          />
        </View>

        {/* Search Bar */}
        <View>
          <TextInput
            style={[styles.input,
            {
              color: isDarkMode ? '#FFFFFF' : '#000000',
              placeholderTextColor: isDarkMode ? '#CCCCCC' : '#808080'
            }
            ]}
            value={keyword}
            onFocus={() => setShowDropdown(true)}
            onChangeText={handleInputChange}
            placeholder="Search for news..."
            placeholderTextColor={isDarkMode ? '#CCCCCC' : '#808080'}
            onSubmitEditing={searchNews}
          />
          <Button title="Search" onPress={searchNews} />

          {/* Dropdown for recent searches */}
          {showDropdown && recentSearches.length > 0 && (
            <View style={[styles.dropdown, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleRecentSearchClick(search)}>
                  <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Button to navigate to filters */}
        <TouchableOpacity
          onPress={() => navigation.navigate('FilteredSearch')}
          style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Search with Filters</Text>
        </TouchableOpacity>

        {/* Button to navigate to bookmarks */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Bookmarks')}
          style={styles.bookmarkButton}>
          <Text style={styles.bookmarkButtonText}>View Bookmarked Articles</Text>
        </TouchableOpacity>

        {/* Trending News Section */}
        <Text style={[styles.subheading, { color: isDarkMode ? '#fff' : '#000' }]}>Trending News</Text>
        {loading && <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#0000ff'} />}
        {error ? <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text> : null}
        <FlatList
          data={trendingArticles.slice(0, 5).filter(item => item.title !== '[Removed]')}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
              <Text style={[styles.headlineText, { color: isDarkMode ? '#bbb' : 'blue' }]}>{item.title || 'No Title Available'}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
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
  themeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingTop: 15,
  },
  headlineText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
    position: 'absolute',
    top: 40,
    width: '100%',
    zIndex: 1,
  },
  dropdownItem: {
    padding: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  errorText: {
    color: 'red',
  },
  filterButton:{
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
    borderRadius: 5,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 16,
  },
  bookmarkButton: {
    marginTop: 16,
    padding: 8,
    backgroundColor: 'blue',
    alignItems: 'center',
  },
  bookmarkButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default HomeScreen;