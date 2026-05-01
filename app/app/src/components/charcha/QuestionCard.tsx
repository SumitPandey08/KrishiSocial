import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface QuestionCardProps {
  item: {
    id: string;
    user: string;
    question: string;
    category: string;
    votes: number;
    answers: number;
    isAnsweredByExpert: boolean;
    time: string;
  };
}

export const QuestionCard = ({ item }: QuestionCardProps) => (
  <TouchableOpacity style={styles.questionCard}>
    <View style={styles.questionHeader}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>{item.user[0]}</Text>
        </View>
        <View>
          <Text style={styles.username}>{item.user}</Text>
          <Text style={styles.timeText}>{item.time} in <Text style={styles.categoryTextInline}>{item.category}</Text></Text>
        </View>
      </View>
      <TouchableOpacity>
        <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
      </TouchableOpacity>
    </View>
    
    <Text style={styles.questionText}>{item.question}</Text>
    
    <View style={styles.questionFooter}>
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statAction}>
          <Ionicons name="arrow-up-circle-outline" size={20} color="#666" />
          <Text style={styles.statNumber}>{item.votes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statAction}>
          <Ionicons name="chatbubble-outline" size={18} color="#666" />
          <Text style={styles.statNumber}>{item.answers}</Text>
        </TouchableOpacity>
      </View>
      
      {item.isAnsweredByExpert && (
        <View style={styles.expertBadge}>
          <MaterialCommunityIcons name="certificate" size={14} color="#D4AF37" />
          <Text style={styles.expertText}>Verified Solution</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  timeText: {
    fontSize: 11,
    color: '#6B7280',
  },
  categoryTextInline: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 15,
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
    paddingTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  statAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statNumber: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  expertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  expertText: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '700',
  },
});
