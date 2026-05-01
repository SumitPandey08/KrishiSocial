import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native';

// Calculate item width for a 3-column grid
const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns;

export interface ProfilePostProps {
  id: string;
  image: string | null;
  caption?: string;
  likes?: number;
  comments?: number;
  uploadedAt?: string;
  postType?: 'update' | 'question' | 'community';
  onPress?: (id: string) => void;
}

export default function ProfilePost({ id, image, caption, postType, onPress }: ProfilePostProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={styles.container}
      onPress={() => onPress?.(id)}
    >
      {image ? (
        <Image 
          source={{ uri: image }} 
          style={styles.image} 
          resizeMode="cover"
        />
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.captionText} numberOfLines={4}>
            {caption || 'Question'}
          </Text>
        </View>
      )}
      
      {/* Visual Overlay: subtle border to separate white images from background */}
      <View style={styles.overlayBorder} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: itemSize,
    height: itemSize, // Perfect square
    padding: 1, // This creates the "grid gap" effect
    backgroundColor: '#F9FAFB',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0', // Placeholder while loading
  },
  textContainer: {
    width: '100%',
    height: '100%',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9', // Light green for questions
  },
  captionText: {
    fontSize: 10,
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '600',
  },
  overlayBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
  }
});