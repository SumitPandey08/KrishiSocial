import React, { useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, StatusBar, View, RefreshControl, Text, TouchableOpacity } from 'react-native';
import StatusList from '../../components/Status';
import Posts from '../../components/Posts';
import { usePosts } from '../../context/PostContext';

const FILTERS = ['All', 'Posts', 'Questions', 'My Crops', 'Nearby'];

export default function HomeScreen() {
  const { refreshing, refreshPosts } = usePosts();
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F9F0" />
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
          {FILTERS.map((filter) => (
            <TouchableOpacity 
              key={filter} 
              style={[styles.filterButton, activeFilter === filter && styles.activeFilterButton]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshPosts} colors={["#2E7D32"]} />
        }
      >
        <View style={styles.header}>
          <StatusList />
        </View>

        <Posts activeFilter={activeFilter}/>

        <View style={styles.contentPlaceholder} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F9F0', // Light green background
  },
  container: {
    flex: 1,
  },
  filterContainer: {
    backgroundColor: '#F0F9F0',
    paddingVertical: 10,
  },
  filterScrollContent: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0EBE0',
  },
  activeFilterButton: {
    backgroundColor: '#2E7D32',
  },
  filterText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 13,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 10,
    backgroundColor: '#F0F9F0',
  },
  contentPlaceholder: {
    flex: 1,
    height: 100,
  }
});
