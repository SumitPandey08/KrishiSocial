import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";

import HomeScreen from "../screens/feed/HomeScreen";
import MandiScreen from "../screens/mandi/MandiScreen";
import CreatePost from "../screens/create/CreatePost";
import CharchaScreen from "../screens/charcha/CharchaScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    activeOpacity={0.9}
    style={styles.customButtonContainer}
    onPress={onPress}
  >
    <View style={styles.diamondWrapper}>
      <View style={styles.diamondButton}>
        <View style={styles.iconRotate}>
          <Ionicons name="add" size={32} color="#fff" />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          paddingBottom: Platform.OS === 'ios' ? 0 : 10,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#2E7D32",
        tabBarInactiveTintColor: "#94A3B8",
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="Mandi" 
        component={MandiScreen} 
        options={{ 
          tabBarLabel: 'Mandi',
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons name={focused ? "storefront" : "storefront-outline"} size={22} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="Create" 
        component={CreatePost} 
        options={{ 
          tabBarLabel: '',
          tabBarStyle: { display: 'none' },
          tabBarButton: (props) => <CustomTabBarButton {...props} />
        }} 
      />
      <Tab.Screen 
        name="Charcha" 
        component={CharchaScreen} 
        options={{ 
          tabBarLabel: 'Charcha',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={22} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
          )
        }} 
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 10,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    height: 70,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderTopWidth: 0,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonContainer: {
    top: -15, 
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  diamondWrapper: {
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  diamondButton: {
    width: 52,
    height: 54,
    backgroundColor: '#2E7D32',
    borderRadius: 18,
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRotate: {
    transform: [{ rotate: '-45deg' }],
  }
});