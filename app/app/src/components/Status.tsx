import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import StatusBubble from './ui/StatusBubble';

export default function StatusList() {
  const data = [
    { id: '0', name: 'Mandi Prices', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80', isViewed: false },
    { id: '1', name: 'Expert Tips', image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=500&q=80', isViewed: false },
    { id: '2', name: 'Weather Alert', image: 'https://images.unsplash.com/photo-1504370805625-d32c54b16100?w=500&q=80', isViewed: true },
    { id: '3', name: 'Organic Farming', image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=500&q=80', isViewed: false },
    { id: '4', name: 'New Seeds', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500&q=80', isViewed: false },
  ];

  return (
    <View style={styles.sectionContainer}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        // Use contentContainerStyle for padding so items don't clip when scrolling
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StatusBubble 
            name={item.name} 
            profilePhoto={item.image} // Changed from 'image' to 'profilePhoto' to match our UI component
            isViewed={item.isViewed} 
            isOwnStory={item.isOwnStory}
            onPress={() => console.log(`Selected ${item.name}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF', // Ensures a clean background
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 20, // Align with the start of the list padding
    marginBottom: 12,
    color: '#1A1A1A',
  },
  listContent: {
    paddingHorizontal: 15, // Gives the first and last item breathing room
  },
});