import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const columnWidth = (width - 45) / 2;

const CATEGORIES = ['All', 'Crops', 'Tractors', 'Seeds', 'Tools'];

const PRODUCTS = [
  { id: '1', name: 'Organic Wheat', price: '₹2,400/Quintal', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80', category: 'Crops', distance: '5 km' },
  { id: '2', name: 'John Deere Tractor', price: '₹1,500/Hour', image: 'https://images.unsplash.com/photo-1594411132715-99661580174e?w=500&q=80', category: 'Tractors', distance: '12 km' },
  { id: '3', name: 'Basmati Rice Seeds', price: '₹800/Bag', image: 'https://images.unsplash.com/photo-1536633100230-07e05697660b?w=500&q=80', category: 'Seeds', distance: '2 km' },
  { id: '4', name: 'Manual Seeder', price: '₹3,500', image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&q=80', category: 'Tools', distance: '8 km' },
  { id: '5', name: 'Fresh Potatoes', price: '₹1,200/Quintal', image: 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d31?w=500&q=80', category: 'Crops', distance: '15 km' },
  { id: '6', name: 'Rotavator for Rent', price: '₹800/Hour', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&q=80', category: 'Tools', distance: '20 km' },
];

export default function MandiScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const renderProduct = ({ item }: { item: typeof PRODUCTS[0] }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.distanceBadge}>
        <Text style={styles.distanceText}>{item.distance}</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={18} color="#FFF" />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatButton}>
            <Ionicons name="chatbubble-ellipses" size={18} color="#2E7D32" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search crops, tractors..." 
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterIconButton}>
          <Ionicons name="options-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={{ height: 50, marginBottom: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.categoryButton, activeCategory === cat && styles.activeCategoryButton]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.activeCategoryText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product Grid */}
      <FlatList
        data={PRODUCTS.filter(p => activeCategory === 'All' || p.category === activeCategory)}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FDF7',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterIconButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  categoryList: {
    paddingHorizontal: 15,
    gap: 10,
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  activeCategoryButton: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  categoryText: {
    color: '#666',
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#FFF',
  },
  gridContent: {
    padding: 15,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCard: {
    width: columnWidth,
    backgroundColor: '#FFF',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  distanceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  distanceText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '800',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    height: 35,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  chatButton: {
    width: 35,
    height: 35,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
