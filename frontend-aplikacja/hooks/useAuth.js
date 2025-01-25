import * as SecureStore from "expo-secure-store";
import jwtDecode from "jwt-decode";

interface DecodedToken {
  _id: string;
  email: string;
}

export const useAuth = () => {
  const storeAuthData = async (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      await SecureStore.setItemAsync("userToken", token);
      await SecureStore.setItemAsync("userId", decoded._id);
    } catch (error) {
      console.error("Error storing auth data:", error);
    }
  };

  const getAuthData = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const userId = await SecureStore.getItemAsync("userId");
      return { token, userId };
    } catch (error) {
      console.error("Error getting auth data:", error);
      return { token: null, userId: null };
    }
  };

  const removeAuthData = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userId");
    } catch (error) {
      console.error("Error removing auth data:", error);
    }
  };

  return { storeAuthData, getAuthData, removeAuthData };
};