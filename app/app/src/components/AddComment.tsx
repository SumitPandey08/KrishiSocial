import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { commentOnPost } from '../services/postService'
import { useUser } from '../context/AuthContext'

interface AddCommentProps {
  postId: string;
  onCommentAdded?: (newComment: any) => void;
  placeholder?: string;
}

export default function AddComment({ postId, onCommentAdded, placeholder = "Add a comment..." }: AddCommentProps) {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    const handleComment = async () => {
        if (!comment.trim()) return;

        setLoading(true);
        try {
            const newComment = await commentOnPost(postId, comment);
            setComment("");
            if (onCommentAdded) onCommentAdded(newComment);
        } catch (error) {
            console.error("Error commenting on post:", error);
        } finally {
            setLoading(false);
        }
    };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: user?.profilePicture || 'https://via.placeholder.com/150' }} 
        style={styles.avatar} 
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity 
            onPress={handleComment} 
            disabled={loading || !comment.trim()}
            style={{ opacity: comment.trim() ? 1 : 0.5 }}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#2E7D32" />
            ) : (
                <Text style={styles.postButton}>Post</Text>
            )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    maxHeight: 100,
    paddingVertical: 0,
  },
  postButton: {
    color: "#2E7D32",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 12,
  },
});