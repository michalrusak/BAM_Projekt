import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";  

export default function Index() {
  const router = useRouter();
  const { getAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { token } = await getAuthData();
      if (token) {
        // Jeśli token istnieje
        router.push("/notes");
      } else {
        // Jeśli tokenu nie ma
        router.push("/login");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // Możesz dodać jakąś animację lub ekran ładowania
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Ładowanie...</Text>
      </View>
    );
  }

  return null; // Strona nie będzie wyświetlana, gdy już przekieruje do loginu lub notes
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
});