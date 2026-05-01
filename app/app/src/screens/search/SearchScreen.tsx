import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import SearchResult from "./SearchResult";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" style={styles.safeArea}>
      {/* HEADER */}
      <View 
        className="px-4 pt-2 pb-4 border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900"
        style={styles.header}
      >
        <Text 
            className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
            style={styles.title}
        >
          Search
        </Text>

        {/* SEARCH INPUT */}
        <View
          className={`flex-row items-center rounded-xl px-3 py-2.5 ${
            isFocused
              ? "bg-white dark:bg-slate-800 border border-indigo-500"
              : "bg-gray-100 dark:bg-slate-800"
          }`}
          style={[
              styles.searchInputContainer,
              isFocused ? styles.searchInputFocused : styles.searchInputUnfocused
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={isFocused ? "#6366F1" : "#6B7280"}
          />

          <TextInput
            className="flex-1 ml-2 text-base text-gray-900 dark:text-white"
            style={styles.textInput}
            placeholder="Search users..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                Keyboard.dismiss();
              }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {query.length > 0 ? (
          <SearchResult query={query} />
        ) : (
          <View 
            className="flex-1 items-center justify-center px-8 opacity-50"
            style={styles.emptyContainer}
          >
            <Ionicons
              name="search-outline"
              size={64}
              color="#D1D5DB"
            />
            <Text 
                className="text-gray-600 dark:text-gray-400 mt-4 text-base font-medium text-center"
                style={styles.emptyText}
            >
              Search for friends, creators, or usernames
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    searchInputFocused: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#6366F1',
    },
    searchInputUnfocused: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    textInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#111827',
    },
    content: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        opacity: 0.5,
    },
    emptyText: {
        color: '#4B5563',
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    }
});
