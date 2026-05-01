'use client';

import React, { createContext, useContext, useState, useEffect } from "react";

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
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleSetUser = (newUser: User | null, token?: string) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
      if (token) {
        localStorage.setItem("accessToken", token);
      }
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, logout, loading }}>
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

export const useAuth = useUser;
