import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommunityCard } from '../../components/charcha/CommunityCard';
import { QuestionCard } from '../../components/charcha/QuestionCard';
import { usePosts } from '../../context/PostContext';
import { useUser } from '../../context/AuthContext';
import { formatDistanceToNow } from '../../utils/formatDate';

const COMMUNITIES = [
  { id: '1', name: 'Organic Farming', members: '12K', icon: 'sprout' },
  { id: '2', name: 'Wheat Experts', members: '8.5K', icon: 'corn' },
  { id: '3', name: 'Smart Irrigation', members: '5.2K', icon: 'water' },
  { id: '4', name: 'Pest Control', members: '10K', icon: 'bug' },
];

export default function CharchaScreen() {
  const [activeTab, setActiveTab] = useState('Latest');
  const { posts, loading, fetchPosts } = usePosts();
  const { user: currentUser } = useUser();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredQuestions = posts.filter(post => {
    if (post.postType !== 'question') return false;
    if (activeTab === 'My Questions') return post.user._id === currentUser?._id;
    return true;
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput 
              placeholder="Search discussions, experts..." 
              style={styles.searchInput}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Communities Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Communities for You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Explore All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={COMMUNITIES}
          renderItem={({ item }) => <CommunityCard item={item} />}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.communityList}
        />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['Trending', 'Latest', 'My Questions'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Questions List */}
        <View style={styles.questionsContainer}>
          {loading && posts.length === 0 ? (
            <ActivityIndicator size="large" color="#2E7D32" />
          ) : filteredQuestions.length === 0 ? (
            <Text style={styles.noQuestionsText}>No questions found.</Text>
          ) : (
            filteredQuestions.map((item) => (
              <View key={item._id}>
                <QuestionCard 
                  item={{
                    id: item._id,
                    user: item.user.name || item.user.username,
                    question: item.caption,
                    category: 'General',
                    votes: item.likesCount,
                    answers: item.commentsCount,
                    isAnsweredByExpert: false,
                    time: formatDistanceToNow(item.createdAt)
                  }} 
                />
              </View>
            ))
          )}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="create-outline" size={24} color="#FFF" />
        <Text style={styles.fabText}>Ask Community</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#1A1A1A',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '700',
  },
  communityList: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#2E7D32',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFF',
  },
  questionsContainer: {
    paddingHorizontal: 20,
  },
  noQuestionsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
    marginLeft: 8,
  },
});
