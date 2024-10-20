import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const FilteredSearchScreen = ({ route, theme }) => {
  const { savedFilters } = route.params || {};
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState(savedFilters?.category || null);
  const [source, setSource] = useState(savedFilters?.source || null);
  const [country, setCountry] = useState(savedFilters?.country || null);
  const [language, setLanguage] = useState(savedFilters?.language || null);
  const [dateRange, setDateRange] = useState(savedFilters?.dateRange || { from: null, to: null });
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const navigation = useNavigation();
  const isDarkMode = theme === 'dark';

  // Clear search field and reset filters when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setKeyword(''); // Clear search keyword
      setCategory(savedFilters?.category || null);
      setSource(savedFilters?.source || null);
      setCountry(savedFilters?.country || null);
      setLanguage(savedFilters?.language || null);
      setDateRange(savedFilters?.dateRange || { from: null, to: null });
      console.log("Filters reset:", { category: savedFilters?.category, source: savedFilters?.source, country: savedFilters?.country, language: savedFilters?.language }); // Debugging line
    }, [savedFilters])
  );

  // Handle search with applied filters
  const handleSearchWithFilters = () => {
    const filters = {
      category,
      source,
      country,
      language,
      dateRange: {
        from: dateRange.from ? dateRange.from.toISOString() : null,
        to: dateRange.to ? dateRange.to.toISOString() : null,
      },
    };

    navigation.navigate('Search Results', { initialKeyword: keyword, filters });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>Search with Filters</Text>

      {/* Input for keyword search */}
      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000', backgroundColor: isDarkMode ? '#555' : '#fff' }]}
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Enter keyword"
        placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
      />

      {/* Category Picker */}
      <Text style={[styles.filterTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Select Category</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => {
          setCategory(itemValue === 'any' ? null : itemValue);
        }}
        style={{ color: isDarkMode ? '#fff' : '#000' }}
      >
        <Picker.Item label="All" value="any" />
        <Picker.Item label="Business" value="business" />
        <Picker.Item label="Entertainment" value="entertainment" />
        <Picker.Item label="Health" value="health" />
        <Picker.Item label="Science" value="science" />
        <Picker.Item label="Sports" value="sports" />
        <Picker.Item label="Technology" value="technology" />
      </Picker>

      {/* Source Picker */}
      <Text style={[styles.filterTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Select Source</Text>
      <Picker
        selectedValue={source}
        onValueChange={(itemValue) => {
          setSource(itemValue === 'any' ? null : itemValue);
        }}
        style={{ color: isDarkMode ? '#fff' : '#000' }}
      >
        <Picker.Item label="All Sources" value="any" />
        <Picker.Item label="CNN" value="cnn" />
        <Picker.Item label="BBC" value="bbc-news" />
      </Picker>

      {/* Country Picker */}
      <Text style={[styles.filterTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Select Country</Text>
      <Picker
        selectedValue={country}
        onValueChange={(itemValue) => {
          setCountry(itemValue === 'any' ? null : itemValue);
        }}
        style={{ color: isDarkMode ? '#fff' : '#000' }}
      >
        <Picker.Item label="Any" value="any" />
        <Picker.Item label="USA" value="us" />
        <Picker.Item label="UK" value="gb" />
        <Picker.Item label="Finland" value="fi" />
        <Picker.Item label="Germany" value="de" />
      </Picker>

      {/* Language Picker */}
      <Text style={[styles.filterTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Select Language</Text>
      <Picker
        selectedValue={language}
        onValueChange={(itemValue) => {
          setLanguage(itemValue === 'any' ? null : itemValue);
        }}
        style={{ color: isDarkMode ? '#fff' : '#000' }}
      >
        <Picker.Item label="Any" value="any" />
        <Picker.Item label="English" value="en" />
        <Picker.Item label="French" value="fr" />
        <Picker.Item label="Spanish" value="es" />
      </Picker>

      {/* Select Date */}
      <Text style={[styles.filterTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Select Date Range:</Text>

      {/* From Date */}
      <TouchableOpacity
        style={[styles.dropdown, { backgroundColor: isDarkMode ? '#555' : '#f0f0f0' }]}
        onPress={() => setShowFromPicker(!showFromPicker)}
      >
        <Text style={[styles.dropdownText, { color: isDarkMode ? '#fff' : '#000' }]}>
          From: {dateRange.from ? dateRange.from.toDateString() : "Select Date"}
        </Text>
      </TouchableOpacity>
      {showFromPicker && (
        <DateTimePicker
          value={dateRange.from || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (event.type === 'set' && selectedDate) {
              setDateRange({ ...dateRange, from: selectedDate });
            }
            setShowFromPicker(false);
          }}
        />
      )}

      {/* To Date */}
      <TouchableOpacity
        style={[styles.dropdown, { backgroundColor: isDarkMode ? '#555' : '#f0f0f0' }]}
        onPress={() => setShowToPicker(!showToPicker)}
      >
        <Text style={[styles.dropdownText, { color: isDarkMode ? '#fff' : '#000' }]}>
          To: {dateRange.to ? dateRange.to.toDateString() : "Select Date"}
        </Text>
      </TouchableOpacity>
      {showToPicker && (
        <DateTimePicker
          value={dateRange.to || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (event.type === 'set' && selectedDate) {
              setDateRange({ ...dateRange, to: selectedDate });
            }
            setShowToPicker(false);
          }}
        />
      )}

      {/* Search Button */}
      <Button title="Search" onPress={handleSearchWithFilters} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  dropdown: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 12,
    color: '#333',
  },
});

export default FilteredSearchScreen;






