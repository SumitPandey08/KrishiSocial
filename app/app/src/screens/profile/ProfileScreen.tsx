import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useUser } from '../../context/AuthContext';
import { useRoute, RouteProp } from '@react-navigation/native';
import { getUserProfile } from '../../services/userService';
import { useRouter } from 'expo-router';
import ProfileFeed from '../../components/ProfileFeed';
import Profile from '../../components/Profile';

type ProfileScreenRouteProp = RouteProp<{ Profile: { username?: string } }, 'Profile'>;

export default function ProfileScreen() {
  const { user: currentUser, logout } = useUser();
  const route = useRoute<ProfileScreenRouteProp>();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'questions'>('posts');

  const username = route.params?.username;
  const isOwnProfile = !username || username === currentUser?.username;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const targetUsername = isOwnProfile ? currentUser!.username : username!;
        const data = await getUserProfile(targetUsername);
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Could not load profile');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [username, currentUser, isOwnProfile]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.centerContainer}>
        <Text>User not found</Text>
      </View>
    );
  }

  const locationText = profileData.village 
    ? `${profileData.village}${profileData.district ? `, ${profileData.district}` : ''}`
    : (profileData.district ? `${profileData.district}, ${profileData.state}` : 'Location not set');

  const filteredPosts = (profileData.posts || []).filter((post: any) => {
    if (activeTab === 'posts') return post.postType === 'update' || !post.postType;
    if (activeTab === 'questions') return post.postType === 'question';
    return true;
  });

  const formattedPosts = filteredPosts.map((post: any) => ({
    id: post._id,
    image: post.media?.[0]?.url || null,
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0,
    postType: post.postType,
    caption: post.caption,
    username: profileData.username,
  }));

  const HeaderComponent = () => (
    <Profile
        data={{
            _id: profileData._id,
            name: profileData.name,
            username: profileData.username,
            bio: profileData.bio || 'Passionate about farming and sustainable practices.',
            profilePicture: profileData.profilePicture || 'https://via.placeholder.com/150',
            postsCount: profileData.postsCount,
            followersCount: profileData.followersCount,
            followingCount: profileData.followingCount,
            isFollowing: profileData.isFollowing,
            farmSize: profileData.farmSize,
            farmingType: profileData.farmingType,
            location: locationText
        }}
        onLogout={isOwnProfile ? logout : undefined}
        isOwnProfile={isOwnProfile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
    />
  );

  return (
    <View style={styles.container}>
      <ProfileFeed
        data={formattedPosts}
        activeTab={activeTab}
        headerComponent={<HeaderComponent />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  }
});
