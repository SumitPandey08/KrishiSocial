import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { PostProvider } from "./src/context/PostContext";
import { UserProvider } from "./src/context/UserContext";
import "./global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <PostProvider>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 , backgroundColor: 'white'}} edges={['top', 'left', 'right']}>
              <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaView>
          </SafeAreaProvider>
        </PostProvider>
      </UserProvider>
    </AuthProvider>
  )
}
