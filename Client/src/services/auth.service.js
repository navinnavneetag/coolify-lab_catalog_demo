import axios from "axios";
import config from "@/utils/config";

const apiClient = axios.create({
  baseURL: `${config.API_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email, password) => {
  try {
    const res = await apiClient.post(`/login`, {
      email,
      password,
    });
    
    localStorage.setItem("token", res.data.token);
    
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || "Login failed" 
    };
  }
};

export const signup = async (email, password) => {
  try {
    const res = await apiClient.post(`/signup`, {
      email,
      password,
    });
    
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Signup error:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || "Signup failed" 
    };
  }
};
