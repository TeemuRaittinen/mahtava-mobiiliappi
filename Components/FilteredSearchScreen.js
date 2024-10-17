import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Clean filters, State variables for search filters
const FilteredSearchScreen = ({ route }) => {
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

    navigation.navigate('SearchResults', { initialKeyword: keyword, filters });
  };

   // Update filters when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setCategory(savedFilters?.category || null);
      setSource(savedFilters?.source || null);
      setCountry(savedFilters?.country || null);
      setLanguage(savedFilters?.language || null);
      setDateRange(savedFilters?.dateRange || { from: null, to: null });
    }, [savedFilters])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search with Filters</Text>

      {/* Input for keyword search */}
      <TextInput
        style={styles.input}
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Enter keyword"
      />

      {/* Category Picker */}
      <Text style={styles.filterTitle}>Select Category</Text>
      <Picker selectedValue={category} onValueChange={setCategory}>
        <Picker.Item label="All" value={null} />
        <Picker.Item label="Business" value="business" />
        <Picker.Item label="Entertainment" value="entertainment" />
        <Picker.Item label="Health" value="health" />
        <Picker.Item label="Science" value="science" />
        <Picker.Item label="Sports" value="sports" />
        <Picker.Item label="Technology" value="technology" />
      </Picker>

      {/* Source Picker */}
      <Text style={styles.filterTitle}>Select Source</Text>
      <Picker selectedValue={source} onValueChange={setSource}>
        <Picker.Item label="All Sources" value={null} />
        <Picker.Item label="CNN" value="cnn" />
        <Picker.Item label="BBC" value="bbc-news" />
      </Picker>

      {/* Country Picker */}
      <Text style={styles.filterTitle}>Select Country</Text>
      <Picker selectedValue={country} onValueChange={setCountry}>
        <Picker.Item label="Any" value={null} />
        <Picker.Item label="USA" value="us" />
        <Picker.Item label="UK" value="gb" />
        <Picker.Item label="Finland" value="fi" />
        <Picker.Item label="Germany" value="de" />
      </Picker>

      {/* Language Picker */}
      <Text style={styles.filterTitle}>Select Language</Text>
      <Picker selectedValue={language} onValueChange={setLanguage}>
        <Picker.Item label="Any" value={null} />
        <Picker.Item label="English" value="en" />
        <Picker.Item label="French" value="fr" />
        <Picker.Item label="Spanish" value="es" />
      </Picker>

      {/* Select Date*/}
      <Text style={styles.filterTitle}>Select Date Range:</Text>

      {/*From date*/}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowFromPicker(!showFromPicker)} 
      >
        <Text style={styles.dropdownText}>
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

      {/* To date */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowToPicker(!showToPicker)} 
      >
        <Text style={styles.dropdownText}>
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

      <Button title="Search" onPress={handleSearchWithFilters} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  dropdown: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
});

export default FilteredSearchScreen;





