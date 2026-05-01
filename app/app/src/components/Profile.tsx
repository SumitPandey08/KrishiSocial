import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUsers } from '../context/UserContext';
import { useRouter } from 'expo-router';

interface ProfileProps {
    data: {
        _id: string;
        name: string;
        username: string;
        bio: string;
        profilePicture: string;
        postsCount?: number;
        followersCount?: number;
        followingCount?: number;
        isFollowing?: boolean;
        farmSize?: number;
        farmingType?: string;
        location?: string;
    },
    onLogout?: () => void;
    isOwnProfile?: boolean;
    activeTab?: 'posts' | 'questions';
    onTabChange?: (tab: 'posts' | 'questions') => void;
}


export default function Profile({data, onLogout, isOwnProfile, activeTab = 'posts', onTabChange}: ProfileProps) {
  const { isFollowing: checkIsFollowing, toggleFollow } = useUsers();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Local follow status for UI responsiveness, initialized from global state
  const isFollowing = checkIsFollowing(data._id);
  const [followersCount, setFollowersCount] = useState(data.followersCount || 0);

  // Sync followersCount when data prop changes
  useEffect(() => {
    setFollowersCount(data.followersCount || 0);
  }, [data.followersCount]);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
        const newIsFollowing = await toggleFollow(data._id);
        setFollowersCount(prev => newIsFollowing ? prev + 1 : Math.max(0, prev - 1));
    } catch (error) {
        console.error('Follow toggle error:', error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
        {/* Header: Avatar + Stats */}
        <View style={styles.headerTop}>
            <Image source={{ uri: data.profilePicture }} style={styles.avatar} />
            
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{data.postsCount || 0}</Text>
                    <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{followersCount}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{data.followingCount || 0}</Text>
                    <Text style={styles.statLabel}>Following</Text>
                </View>
            </View>
        </View>

        {/* Bio Section */}
        <View style={styles.bioSection}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.bio}>{data.bio}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
            {isOwnProfile ? (
                <>
                    <TouchableOpacity 
                      style={styles.primaryBtn}
                      onPress={() => router.push('/edit-profile')}
                    >
                        <Text style={styles.primaryBtnText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryBtn}>
                        <Text style={styles.secondaryBtnText}>Share Profile</Text>
                    </TouchableOpacity>
                    {onLogout && (
                        <TouchableOpacity style={styles.iconBtn} onPress={onLogout}>
                            <Ionicons name="log-out-outline" size={20} color="#000" />
                        </TouchableOpacity>
                    )}
                </>
            ) : (
                <>
                    <TouchableOpacity 
                        style={[
                            styles.primaryBtn, 
                            isFollowing ? styles.followingBtn : styles.followBtn
                        ]} 
                        onPress={handleFollowToggle}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={isFollowing ? "#000" : "#fff"} />
                        ) : (
                            <Text style={[
                                styles.primaryBtnText,
                                !isFollowing && styles.followBtnText
                            ]}>
                                {isFollowing ? 'Following' : 'Follow'}
                            </Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryBtn}>
                        <Text style={styles.secondaryBtnText}>Message</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>

        {/* Farm Details */}
        <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
                <MaterialCommunityIcons name="land-plots" size={20} color="#2E7D32" />
                <View>
                    <Text style={styles.detailLabel}>Farm Size</Text>
                    <Text style={styles.detailValue}>{data.farmSize || 0} Acres</Text>
                </View>
            </View>
            <View style={styles.detailItem}>
                <MaterialCommunityIcons name="sprout" size={20} color="#2E7D32" />
                <View>
                    <Text style={styles.detailLabel}>Farming Type</Text>
                    <Text style={styles.detailValue}>{data.farmingType || 'Traditional'}</Text>
                </View>
            </View>
            <View style={styles.detailItem}>
                <Ionicons name="location" size={20} color="#2E7D32" />
                <View>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue} numberOfLines={1}>{data.location || 'N/A'}</Text>
                </View>
            </View>
        </View>

        {/* Tabs Section */}
        <View style={styles.tabs}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'posts' && styles.activeTab]} 
              onPress={() => onTabChange?.('posts')}
            >
                <Ionicons 
                  name="grid-outline" 
                  size={24} 
                  color={activeTab === 'posts' ? '#000' : '#8E8E8E'} 
                />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'questions' && styles.activeTab]} 
              onPress={() => onTabChange?.('questions')}
            >
                <Ionicons 
                  name="help-circle-outline" 
                  size={26} 
                  color={activeTab === 'questions' ? '#000' : '#8E8E8E'} 
                />
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 86,
        height: 86,
        borderRadius: 43,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    statsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginLeft: 24,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    statLabel: {
        fontSize: 13,
        color: '#262626',
        marginTop: 2,
    },
    bioSection: {
        marginBottom: 16,
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    bio: {
        fontSize: 14,
        color: '#262626',
        lineHeight: 20,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
    },
    primaryBtn: {
        flex: 1,
        backgroundColor: '#EFEFEF',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    followBtn: {
        backgroundColor: '#3B82F6',
    },
    followBtnText: {
        color: '#fff',
    },
    followingBtn: {
        backgroundColor: '#EFEFEF',
    },
    secondaryBtn: {
        flex: 1,
        backgroundColor: '#EFEFEF',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    iconBtn: {
        backgroundColor: '#EFEFEF',
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailsContainer: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginBottom: 10,
        gap: 12,
    },
    detailItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailLabel: {
        fontSize: 10,
        color: '#666',
        fontWeight: '600',
    },
    detailValue: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    tabs: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        marginHorizontal: -16,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#000',
    }
});
