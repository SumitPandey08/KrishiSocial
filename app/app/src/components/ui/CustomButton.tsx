import React from "react";
import { Text, Pressable, StyleSheet, View, Platform, ActivityIndicator } from "react-native";

// Shared haptic-style feedback for all buttons
const getButtonStyle = (pressed: boolean, baseStyle: any) => [
  baseStyle,
  { transform: [{ scale: pressed ? 0.96 : 1 }] },
  pressed && { opacity: 0.85 }
];

export const FollowButton = ({ onPress }: { onPress?: () => void }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => getButtonStyle(pressed, styles.followButton)}
  >
    <Text style={styles.followButtonText}>Follow</Text>
  </Pressable>
);

export const UnfollowButton = ({ onPress }: { onPress?: () => void }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => getButtonStyle(pressed, styles.unfollowButton)}
  >
    <Text style={styles.unfollowButtonText}>Following</Text>
  </Pressable>
);

export const EditProfileButton = ({ onPress }: { onPress?: () => void }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => getButtonStyle(pressed, styles.editProfileButton)}
  >
    <Text style={styles.editProfileButtonText}>Edit Profile</Text>
  </Pressable>
);

export const PrimaryButton = ({
  text,
  onPress,
  color = "#2E7D32",
  isLoading = false,
  disabled = false,
}: {
  text: string;
  onPress?: () => void;
  color?: string;
  isLoading?: boolean;
  disabled?: boolean;
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading || disabled}
      style={({ pressed }) => [
        styles.primaryButton,
        { backgroundColor: (isLoading || disabled) ? "#9CA3AF" : color },
        { transform: [{ scale: pressed ? 0.98 : 1 }] },
        pressed && { opacity: 0.9 }
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={styles.primaryButtonText}>{text}</Text>
      )}
    </Pressable>
  );
};

export const CreatePostButton = ({ onPress, isLoading }: { onPress?: () => void, isLoading?: boolean }) => (
  <PrimaryButton text="Create Post" onPress={onPress} isLoading={isLoading} />
);

const styles = StyleSheet.create({
  // 1. Follow: Modern deep blue with semi-bold text
  followButton: {
    backgroundColor: '#1E40AF', 
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 10, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  // 2. Unfollow: Subtle outline style
  unfollowButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unfollowButtonText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 13,
  },

  // 3. Edit Profile: Card-style button
  editProfileButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  editProfileButtonText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 14,
  },

  // 4. Primary: Large action button
  primaryButton: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});