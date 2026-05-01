import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import { connectSocket } from "../utils/socket";



interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  website?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  helpScore?: number;
  village?: string;
  district?: string;
  state?: string;
  farmSize?: number;
  cropsGrown?: string[];
  farmingType?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null, token?: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const handleSetUser = (newUser: User | null, token?: string) => {
    console.log("AuthProvider: Updating user state to:", newUser ? newUser.username : "null");
    if (newUser && token) {
      Alert.alert("Debug", "AuthProvider received user: " + newUser.username);
      connectSocket(token);
    }
    setUser(newUser);
  };

  const logout = () => {
    console.log("AuthProvider: Logging out");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useUser must be used within an AuthProvider");
    }
    return context;
};

// Also keep useAuth for general purpose
export const useAuth = useUser;
