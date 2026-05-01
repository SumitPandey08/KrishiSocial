import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  label?: string;
  type?: 'text' | 'email' | 'password';
}

export const AuthInput = ({ label, type = 'text', editable = true, ...props }: AuthInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputWrapper,
        isFocused ? styles.inputWrapperFocused : styles.inputWrapperUnfocused,
        !editable && styles.inputWrapperDisabled
      ]}>
        <TextInput
          style={[styles.input, !editable && styles.textDisabled]}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          editable={editable}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            disabled={!editable}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={editable ? "#6B7280" : "#9CA3AF"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export const CreatePostInput = (props: TextInputProps) => {
  return (
    <View style={styles.createPostContainer}>
      <TextInput
        style={styles.createPostInput}
        multiline
        placeholder="What's on your mind?"
        placeholderTextColor="#9CA3AF"
        textAlignVertical="top"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#374151', // text-gray-700
    fontWeight: '600', // font-semibold
    marginBottom: 8, // mb-2
    marginLeft: 4, // ml-1
    fontSize: 14, // text-sm
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56, // h-14
    paddingHorizontal: 16, // px-4
    borderRadius: 16, // rounded-2xl
    borderWidth: 2, // border-2
  },
  inputWrapperFocused: {
    borderColor: '#3B82F6', // border-blue-500
    backgroundColor: '#FFFFFF', // bg-white
  },
  inputWrapperUnfocused: {
    borderColor: '#F3F4F6', // border-gray-100
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  inputWrapperDisabled: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    opacity: 0.7,
  },
  input: {
    flex: 1,
    color: '#111827', // text-gray-900
    fontSize: 16, // text-base
    height: '100%',
  },
  textDisabled: {
    color: '#6B7280',
  },
  createPostContainer: {
    flex: 1,
    paddingVertical: 8, // py-2
  },
  createPostInput: {
    fontSize: 18, // text-lg
    color: '#111827', // text-gray-900
    lineHeight: 24, // leading-6
  },
});
