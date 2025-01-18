import * as SecureStore from "expo-secure-store";

export const useAuth = () => {
  const storeToken = async (token) => {
    try {
      await SecureStore.setItemAsync("userToken", token);
    } catch (error) {
      console.error("Error storing token:", error);
    }
  };

  const getToken = async () => {
    try {
      return await SecureStore.getItemAsync("userToken");
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  const removeToken = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };

  return { storeToken, getToken, removeToken };
};
