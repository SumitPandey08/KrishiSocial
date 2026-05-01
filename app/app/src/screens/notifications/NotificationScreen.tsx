import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'like',
    user: 'Ramesh Kumar',
    content: 'liked your post about Organic Fertilizers',
    time: '5m ago',
    unread: true,
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '2',
    type: 'comment',
    user: 'Suresh Patil',
    content: 'commented on your question: "Great advice, thank you!"',
    time: '1h ago',
    unread: true,
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '3',
    type: 'follow',
    user: 'Anil Deshmukh',
    content: 'started following you',
    time: '2h ago',
    unread: false,
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '4',
    type: 'alert',
    user: 'Krishi-Social',
    content: 'Extreme weather alert for your region. Check Mausam section.',
    time: '5h ago',
    unread: false,
    icon: 'warning',
  },
  {
    id: '5',
    type: 'expert',
    user: 'Dr. Verma (Expert)',
    content: 'answered your question about Wheat rust',
    time: '1d ago',
    unread: false,
    avatar: 'https://via.placeholder.com/50',
  },
];

export default function NotificationScreen() {
  const router = useRouter();

  const renderIcon = (type: string, icon?: string) => {
    switch (type) {
      case 'like': return <Ionicons name="heart" size={14} color="#FF3040" />;
      case 'comment': return <Ionicons name="chatbubble" size={14} color="#3B82F6" />;
      case 'follow': return <Ionicons name="person-add" size={14} color="#10B981" />;
      case 'alert': return <Ionicons name="warning" size={14} color="#F59E0B" />;
      case 'expert': return <MaterialCommunityIcons name="certificate" size={14} color="#D4AF37" />;
      default: return null;
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={[styles.notificationItem, item.unread && styles.unreadItem]}>
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.iconContainer, { backgroundColor: '#FFF7ED' }]}>
            <Ionicons name="notifications" size={24} color="#F59E0B" />
          </View>
        )}
        <View style={styles.typeBadge}>
          {renderIcon(item.type)}
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.notificationText}>
          <Text style={styles.userName}>{item.user} </Text>
          {item.content}
        </Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>

      {item.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={NOTIFICATIONS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  markRead: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  unreadItem: {
    backgroundColor: '#F7FDF7',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFF',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contentContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  userName: {
    fontWeight: '700',
    color: '#111827',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
});
