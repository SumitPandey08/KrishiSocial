import { View, FlatList, StyleSheet, Text } from "react-native";
import React from "react";
import ProfilePost, { ProfilePostProps } from "./ProfilePost";
import { QuestionCard } from "./charcha/QuestionCard";

interface ProfileFeedProps {
  data: any[];
  headerComponent?: React.ReactElement;
  activeTab?: 'posts' | 'questions';
}

export default function ProfileFeed({ data, headerComponent, activeTab = 'posts' } : ProfileFeedProps) {
  const isQuestions = activeTab === 'questions';

  const renderItem = ({ item }: { item: any }) => {
    if (isQuestions) {
      return (
        <View style={styles.questionWrapper}>
          <QuestionCard 
            item={{
              id: item.id,
              user: item.username || 'User',
              question: item.caption,
              category: 'General',
              votes: item.likes || 0,
              answers: item.comments || 0,
              isAnsweredByExpert: false,
              time: 'Just now' // Simplified for profile
            }} 
          />
        </View>
      );
    }

    return <ProfilePost {...item} />;
  };

  return (
    <View style={styles.container}>
        <FlatList
        key={activeTab} // Force re-render when switching tabs
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={isQuestions ? 1 : 3}
        renderItem={renderItem}
        ListHeaderComponent={headerComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          isQuestions && styles.questionsListContainer
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {activeTab} yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingBottom: 20,
    },
    questionsListContainer: {
        paddingHorizontal: 16,
    },
    questionWrapper: {
        marginTop: 10,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    }
});
