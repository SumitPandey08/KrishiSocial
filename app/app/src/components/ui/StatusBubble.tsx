import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 1. Define a clean interface for props
interface StatusBubbleProps {
  profilePhoto: any;
  name: string;
  onPress?: () => void;
  isOwnStory?: boolean;
  isViewed?: boolean;
}

const StatusBubble = ({ profilePhoto, isViewed, name, onPress, isOwnStory }: StatusBubbleProps) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress} 
      style={styles.container}
    >
      <View style={[
        styles.ringContainer, 
        !isViewed && styles.unseenRing,
        isViewed && !isOwnStory && styles.viewedRing
      ]}>
        <Image 
          source={typeof profilePhoto === 'string' ? { uri: profilePhoto } : profilePhoto} 
          style={styles.image} 
        />
        
        {isOwnStory && (
          <View style={styles.addStoryBadge}>
            <Ionicons name="add" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>

      <Text numberOfLines={1} style={styles.nameText}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 72, // Fixed width for consistent horizontal scrolling
  },
  ringContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'transparent', // Default no border
  },
  unseenRing: {
    borderColor: '#F35369', // Instagram-like pink/red color
  },
  viewedRing: {
    borderColor: '#E5E5E5', // Light grey for seen stories
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E1E1E1', // Placeholder color while loading
    borderWidth: 3,
    borderColor: '#FFFFFF', // Creates the gap between image and ring
  },
  addStoryBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6', // Blue color for "Add"
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default StatusBubble;