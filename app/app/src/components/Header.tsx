import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../context/AuthContext";
import { useRouter } from "expo-router";

export default function AppHeader() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* User Greeting and App Name */}
        <View style={styles.leftSection}>
          <Text style={styles.logo}>KrishiSocial</Text>
          {user && (
            <Text style={styles.welcome}>Namaste, {user.name.split(' ')[0]}</Text>
          )}
        </View>

        {/* Action Icons */}
        <View style={styles.rightSection}>
          <TouchableOpacity 
            style={styles.actionItem} 
            onPress={() => router.push('/weather' as any)}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="partly-sunny-outline" size={22} color="#2E7D32" />
            </View>
            <Text style={styles.actionLabel}>Weather</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/notifications' as any)}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="notifications-outline" size={22} color="#2E7D32" />
              <View style={styles.badge} />
            </View>
            <Text style={styles.actionLabel}>Alerts</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      android: {
        paddingTop: 10,
      }
    })
  },
  container: {
    height: 65,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F8F1',
  },
  leftSection: {
    justifyContent: 'center',
  },
  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: '#2E7D32',
    letterSpacing: -0.5,
  },
  welcome: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginTop: -2,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  actionItem: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F8F1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  actionLabel: {
    fontSize: 9,
    color: '#2E7D32',
    fontWeight: '800',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  }
});