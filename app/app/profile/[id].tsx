import { View, Text, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Profile from '../src/components/Profile' 
import ProfileFeed from '../src/components/ProfileFeed'
import { useUser } from '../src/context/AuthContext'
import { useLocalSearchParams } from 'expo-router'
import { getUserProfile } from '../src/services/userService'

export default function ProfileScreen() {
  const { user: currentUser, logout } = useUser();
  const { id: username } = useLocalSearchParams<{ id: string }>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'questions'>('posts');

  const isOwnProfile = !username || username === currentUser?.username;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (isOwnProfile) {
          const data = await getUserProfile(currentUser!.username);
          setProfileData(data);
          setPosts(data.posts || []);
        } else {
          const data = await getUserProfile(username!);
          setProfileData(data);
          setPosts(data.posts || []);
        }
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

  if (!currentUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 10 }}>Please login to view profile</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>User not found</Text>
      </View>
    );
  }

  const formattedProfileData = {
    _id: profileData._id,
    name: profileData.name,
    username: profileData.username,
    bio: profileData.bio || 'No bio yet.',
    profilePicture: profileData.profilePicture || 'https://via.placeholder.com/150',
    postsCount: profileData.postsCount || 0,
    followersCount: profileData.followersCount || 0,
    followingCount: profileData.followingCount || 0,
    isFollowing: profileData.isFollowing,
  };

  const filteredPosts = posts.filter((post: any) => {
    if (activeTab === 'posts') return post.postType === 'update' || !post.postType;
    if (activeTab === 'questions') return post.postType === 'question';
    return true;
  });

  const formattedPosts = filteredPosts.map((post: any) => ({
    id: post._id,
    image: post.media[0]?.url || null,
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0,
    postType: post.postType,
    caption: post.caption,
    username: profileData.username, // Added for QuestionCard
  }));

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ProfileFeed
        data={formattedPosts}
        activeTab={activeTab}
        headerComponent={
            <Profile
                data={formattedProfileData}
                onLogout={isOwnProfile ? logout : undefined}
                isOwnProfile={isOwnProfile}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        }
      />
    </View>
  )
}