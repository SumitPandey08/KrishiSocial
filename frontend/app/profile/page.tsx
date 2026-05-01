'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/AuthContext';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileFeed from '@/components/ProfileFeed';
import { API_URL } from '@/services/api';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function ProfileDetailPage() {
  const { id: username } = useParams();
  const { user: currentUser, logout } = useUser();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'questions'>('posts');

  const isOwnProfile = username === currentUser?.username;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      try {
        const response = await axios.get(`${API_URL}/users/${username}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E7D32]"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 font-bold">User not found</p>
      </div>
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

  return (
    <div className="w-full min-h-screen bg-white">
      <ProfileHeader 
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
          location: profileData.village ? `${profileData.village}, ${profileData.district}` : 'Location not set'
        }}
        isOwnProfile={isOwnProfile}
        onLogout={isOwnProfile ? logout : undefined}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <ProfileFeed data={formattedPosts} activeTab={activeTab} />
    </div>
  );
}
