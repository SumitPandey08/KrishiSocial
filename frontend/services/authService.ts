import api from "./api";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (name: string, username: string, email: string, password: string) => {
  try {
    const response = await api.post("/auth/register", { name, username, email, password });
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
