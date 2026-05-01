import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CreatePostInput } from '../../components/ui/CustomInput';
import { createPost } from '../../services/postService';
import { usePosts } from '../../context/PostContext';
import { useUser } from '../../context/AuthContext';

export default function CreatePost({ navigation }: any) {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [privacy, setPrivacy] = useState<"public" | "private" | "followers" | "close_friends">("public");
  const [postType, setPostType] = useState<"update" | "question" | "community">("update");
  const [community, setCommunity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addPost } = usePosts();
  const { user } = useUser();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  };

  const handleCreatePost = async () => {
    if (!content && images.length === 0) {
      Alert.alert('Error', 'Please add some content or an image');
      return;
    }

    setIsLoading(true);
    try {
      const newPost = await createPost(content, location, images, privacy, postType, community || undefined);
      addPost(newPost);
      Alert.alert('Success', 'Post created successfully');
      setContent('');
      setImages([]);
      setLocation('');
      navigation.navigate('Home');
    } catch (error: any) {
      console.error('Failed to create post:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header with Post Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity 
          onPress={handleCreatePost} 
          disabled={isLoading}
          style={[styles.postButton, (!content && images.length === 0) && styles.postButtonDisabled]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* User Info & Options */}
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: user?.profilePicture || 'https://via.placeholder.com/150' }} 
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <View style={styles.badgeRow}>
                <TouchableOpacity 
                  style={styles.optionBadge}
                  onPress={() => setPrivacy(privacy === 'public' ? 'private' : 'public')}
                >
                  <Ionicons name={privacy === 'public' ? 'earth-outline' : 'lock-closed-outline'} size={12} color="#6B7280" />
                  <Text style={styles.badgeText}>{privacy}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.optionBadge}
                  onPress={() => setPostType(postType === 'update' ? 'question' : (postType === 'question' ? 'community' : 'update'))}
                >
                  <MaterialCommunityIcons name={postType === 'update' ? 'bullhorn-outline' : (postType === 'question' ? 'help-circle-outline' : 'account-group-outline')} size={12} color="#6B7280" />
                  <Text style={styles.badgeText}>{postType}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <CreatePostInput 
              value={content} 
              onChangeText={setContent} 
              placeholder={postType === 'question' ? "What is your question for the community?" : "What's on your mind?"}
              autoFocus={true}
            />
          </View>

          {postType === 'community' && (
            <View style={styles.communitySelector}>
              <Text style={styles.selectorLabel}>Post to Community:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.communityList}>
                {['Organic Farming', 'Wheat Experts', 'Smart Irrigation'].map((name) => (
                  <TouchableOpacity 
                    key={name} 
                    style={[styles.communityOption, community === name && styles.communityOptionActive]}
                    onPress={() => setCommunity(name)}
                  >
                    <Text style={[styles.communityOptionText, community === name && styles.communityOptionTextActive]}>{name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Image Previews */}
          {images.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
              {images.map((img, index) => (
                <View key={index} style={styles.imageItem}>
                  <Image source={{ uri: img.uri }} style={styles.previewImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity onPress={pickImage} style={styles.addImageButton}>
                <Ionicons name="add" size={32} color="#D1D5DB" />
              </TouchableOpacity>
            </ScrollView>
          )}
        </ScrollView>

        {/* Media Toolbar (Sticky above keyboard) */}
        <View style={styles.toolbar}>
          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionItem} onPress={pickImage}>
              <Ionicons name="image-outline" size={26} color="#2E7D32" />
              <Text style={styles.actionText}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="videocam-outline" size={26} color="#2E7D32" />
              <Text style={styles.actionText}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="location-outline" size={26} color="#2E7D32" />
              <Text style={styles.actionText}>Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="happy-outline" size={26} color="#2E7D32" />
              <Text style={styles.actionText}>Feeling</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    postButton: {
        backgroundColor: '#2E7D32',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 70,
        alignItems: 'center',
    },
    postButtonDisabled: {
        backgroundColor: '#A5D6A7',
    },
    postButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    avatar: {
        width: 44,
        height: 48,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
    },
    userDetails: {
        marginLeft: 12,
    },
    userName: {
        fontWeight: '700',
        fontSize: 15,
        color: '#111827',
    },
    badgeRow: {
        flexDirection: 'row',
        marginTop: 4,
        gap: 8,
    },
    optionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '700',
        marginLeft: 4,
        textTransform: 'capitalize',
    },
    inputContainer: {
        minHeight: 150,
    },
    communitySelector: {
        marginVertical: 15,
    },
    selectorLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 8,
    },
    communityList: {
        flexDirection: 'row',
    },
    communityOption: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    communityOptionActive: {
        backgroundColor: '#E8F5E9',
        borderColor: '#2E7D32',
    },
    communityOptionText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    communityOptionTextActive: {
        color: '#2E7D32',
    },
    imageScroll: {
        marginTop: 16,
    },
    imageItem: {
        marginRight: 10,
        position: 'relative',
    },
    previewImage: {
        width: 120,
        height: 120,
        borderRadius: 12,
    },
    removeImageButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        padding: 4,
    },
    addImageButton: {
        width: 120,
        height: 120,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    toolbar: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#fff',
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
    },
    actionItem: {
        alignItems: 'center',
        gap: 4,
    },
    actionText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#6B7280',
    }
});
