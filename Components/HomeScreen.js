import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, Linking } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

const HomeScreen = ({ navigation, theme = 'light', setTheme }) => {  // Added default theme fallback
  const [keyword, setKeyword] = useState(''); // State for search input
  const [trendingArticles, setTrendingArticles] = useState([]); // State for trending articles
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(''); // State for error messages
  const [recentSearches, setRecentSearches] = useState([]); // State for recent searches
  const [showDropdown, setShowDropdown] = useState(false); // State for showing dropdown
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for user authentication status

  useEffect(() => {
    fetchTrendingNews();
    loadRecentSearches();
    checkUserAuthentication();

    // Fetch trending news every 2 minutes
    const newsFetchInterval = setInterval(fetchTrendingNews, 120000);
    // Clean up interval (stop fetching news) when the component unmounts
    return () => {
      console.log("Clearing interval...");
      clearInterval(newsFetchInterval);
    };
  }, []); // Empty array = this effect runs only on mount and unmount

  // Check if user is authenticated
  const checkUserAuthentication = () => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setIsLoggedIn(!!user); // Update login status
    });
    return () => unsubscribe(); // Clean up subscription on unmount
  };


  const toggleTheme = async (isDarkMode) => {
    const selectedTheme = isDarkMode ? 'dark' : 'light';
    setTheme(selectedTheme);
  };

  const isDarkMode = theme === 'dark';


  // Fetch trending news from API
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

  // Search for news based on user input
  const searchNews = () => {
    if (!keyword) return;
    saveSearch(keyword);
    navigation.navigate('Search Results', { initialKeyword: keyword });
    setKeyword('');  // Clearing input field after search
  };

  // Save recent search terms to AsyncStorage
  const saveSearch = async (searchTerm) => {
    try {
      let searches = await AsyncStorage.getItem('recentSearches');
      searches = searches ? JSON.parse(searches) : [];

      // If search term already exists, it will be removed...
      searches = searches.filter(search => search !== searchTerm);

      searches.unshift(searchTerm); // ...and added to the top
      if (searches.length > 10) searches.pop(); // Store only the 10 latest searches

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

  // Handle click on recent search
  const handleRecentSearchClick = (search) => {
    setKeyword(search);
    setShowDropdown(false); // Hide the dropdown when an item is selected
    searchNews();
  };

  // Handle input change in search bar
  const handleInputChange = (text) => {
    setKeyword(text);
    if (text === '' && recentSearches.length > 0) {
      setShowDropdown(true); // Show dropdown if search field is empty
    } else {
      setShowDropdown(false); // Hide dropdown if search field is not empty
    }
  };

  // Navigate to Login screen
  const login = () => {
    navigation.navigate('Login');
  };

  // Navigate to Register screen
  const register = () => {
    navigation.navigate('Register');
  };

  // Log out function
  const handleLogout = async () => {
    try {
      await auth().signOut(); // Sign out the user
      setIsLoggedIn(false); // Update login status
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
      <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
        {/* Title and Gear Icon Row */}
        <View style={styles.titleContainer}>
          <Text style={[styles.heading, { color: theme === 'dark' ? '#fff' : '#000' }]}>Newsapi-appi</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <MaterialIcons name="settings" size={44} color={theme === 'dark' ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>

        {/* Authentication Links at the top of the screen */}
        <View style={styles.authLinks}>
          {!isLoggedIn ? ( // Show login/register links if not logged in
            <>
              <TouchableOpacity onPress={login}>
                <Text style={[styles.authLinkText, { color: theme === 'dark' ? '#fff' : '#0000ff' }]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={register}>
                <Text style={[styles.authLinkText, { color: theme === 'dark' ? '#fff' : '#0000ff' }]}>Register</Text>
              </TouchableOpacity>
            </>
          ) : ( // Show logout button if logged in
            <TouchableOpacity onPress={handleLogout}>
              <Text style={[styles.authLinkText, { color: theme === 'dark' ? '#fff' : '#0000ff' }]}>Log Out</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <View>
          <TextInput
            style={[styles.input, {
              color: theme === 'dark' ? '#FFFFFF' : '#000000',
              placeholderTextColor: theme === 'dark' ? '#CCCCCC' : '#808080',
            }]}
            value={keyword}
            onFocus={() => setShowDropdown(true)}
            onChangeText={handleInputChange}
            placeholder="Search for news..."
            placeholderTextColor={theme === 'dark' ? '#CCCCCC' : '#808080'}
            onSubmitEditing={searchNews}
          />
          {/* Updated Search Button */}
          <TouchableOpacity style={styles.searchButton} onPress={searchNews}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>

          {/* Dropdown for recent searches */}
          {showDropdown && recentSearches.length > 0 && (
            <View style={[styles.dropdown, { backgroundColor: theme === 'dark' ? '#444' : '#fff' }]}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleRecentSearchClick(search)}>
                  <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Button to navigate to filters with added margin */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Filtered Search')}
          style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Search with Filters</Text>
        </TouchableOpacity>

        {/* Add margin to create gap between buttons */}
        <View style={styles.buttonGap} />

        {/* Trending News Section */}
        <Text style={[styles.subheading, { color: theme === 'dark' ? '#fff' : '#000' }]}>Trending News</Text>
        {loading && <ActivityIndicator size="large" color={theme === 'dark' ? '#fff' : '#0000ff'} />}
        {error ? <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text> : null}
        <FlatList
          data={trendingArticles.slice(0, 5).filter((item) => item.title !== '[Removed]')}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
              <Text style={[styles.articleTitle, { color: theme === 'dark' ? '#fff' : '#0000ff' }]}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  authLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  authLinkText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  articleContainer: {
    paddingVertical: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
  },
  dropdownItem: {
    padding: 7,
  },
  filterButton: {
    backgroundColor: '#007bff',
    padding: 8,
    marginBottom: 8,
  },
  filterButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 8,
    marginBottom: 10,
  },
  searchButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  buttonGap: {
    height: 2,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 10,
  },
  articleTitle: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default HomeScreen;
