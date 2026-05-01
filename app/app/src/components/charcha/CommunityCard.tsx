import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CommunityCardProps {
  item: {
    id: string;
    name: string;
    members: string;
    icon: any;
  };
}

export const CommunityCard = ({ item }: CommunityCardProps) => (
  <TouchableOpacity style={styles.communityCard}>
    <View style={styles.communityIcon}>
      <MaterialCommunityIcons name={item.icon} size={24} color="#2E7D32" />
    </View>
    <Text style={styles.communityName} numberOfLines={1}>{item.name}</Text>
    <Text style={styles.communityMembers}>{item.members} members</Text>
    <TouchableOpacity style={styles.joinButton}>
      <Text style={styles.joinButtonText}>Join</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  communityCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 15,
    marginRight: 15,
    width: 140,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  communityIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F1F8F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  communityName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  communityMembers: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 12,
  },
  joinButton: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
});
