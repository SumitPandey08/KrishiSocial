import { View, StyleSheet, StatusBar, Text } from 'react-native'
import React, { useEffect } from 'react'
import MainTabNavigator from '../src/navigation/MainTabNavigator'
import Header from '../src/components/Header'
import AuthNavigator from '../src/navigation/AuthNavigator'
import { useUser } from '../src/context/AuthContext'

export default function Tabs() {
  const { user } = useUser();

  useEffect(() => {
    console.log("Tabs Layout - Current User State:", user ? `Logged in as ${user.username}` : "Logged out");
  }, [user]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Only show Header if the user is authenticated */}
      {user && <Header />}
      
      <View style={styles.content}>
       {user ? (
         <MainTabNavigator />
       ) : (
         <AuthNavigator />
       )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  }
});