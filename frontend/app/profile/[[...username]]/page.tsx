'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/AuthContext';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileFeed from '@/components/ProfileFeed';
import AppLayout from '@/components/AppLayout';
import { API_URL } from '@/services/api';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function ProfilePage() {
  const params = useParams();
  const usernameParam = params?.username;
  // usernameParam will be an array for catch-all routes [[...username]]
  const username = Array.isArray(usernameParam) ? usernameParam[0] : usernameParam;
  
  const { user: currentUser, logout, loading: authLoading } = useUser();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'questions'>('posts');

  const isOwnProfile = !username || username === currentUser?.username;
  const targetUsername = username || currentUser?.username;

  useEffect(() => {
    const fetchProfile = async () => {
      // Don't fetch until auth state is determined
      if (authLoading) return;

      // If no targetUsername and not logged in, we can't show a profile
      if (!targetUsername) {
        setLoading(false);
        return;
      }
      
      try {
        const headers: any = {};
        const token = localStorage.getItem('accessToken');
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get(`${API_URL}/users/${targetUsername}`, { headers });
        setProfileData(response.data);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 404) {
          setProfileData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUsername, authLoading]);

  if (loading || authLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E7D32]"></div>
        </div>
      </AppLayout>
    );
  }

  if (!profileData) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 font-bold">User not found</p>
        </div>
      </AppLayout>
    );
  }

  const posts = (profileData.posts || []).filter((post: any) => {
    if (activeTab === 'posts') return post.postType === 'update' || !post.postType;
    if (activeTab === 'questions') return post.postType === 'question';
    return true;
  });

  const formattedPosts = posts.map((post: any) => ({
    id: post._id,
    image: post.media?.[0]?.url || null,
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0,
    postType: post.postType,
    caption: post.caption,
    username: profileData.username,
  }));

  const displayData = isOwnProfile && currentUser ? { ...profileData, ...currentUser } : profileData;

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-white">
        <ProfileHeader 
          data={{
            _id: displayData._id || displayData.id,
            name: displayData.name,
            username: displayData.username,
            bio: displayData.bio || 'Passionate about farming and sustainable practices.',
            profilePicture: displayData.profilePicture || 'https://via.placeholder.com/150',
            postsCount: displayData.postsCount,
            followersCount: displayData.followersCount,
            followingCount: displayData.followingCount,
            isFollowing: displayData.isFollowing,
            farmSize: displayData.farmSize,
            farmingType: displayData.farmingType,
            location: displayData.village ? `${displayData.village}, ${displayData.district}` : 'Location not set'
          }}
          isOwnProfile={isOwnProfile}
          onLogout={isOwnProfile ? logout : undefined}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <ProfileFeed data={formattedPosts} activeTab={activeTab} />
      </div>
    </AppLayout>
  );
}
