import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {jwtDecode} from "jwt-decode";
import { useAuth } from "../hooks/useAuth";

interface DecodedToken {
  exp: number; // Data wygaśnięcia tokenu w formacie UNIX
}

export default function Index() {
  const router = useRouter();
  const { getAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const isTokenValid = (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Math.floor(Date.now() / 1000); // Aktualny czas w sekundach
      return decoded.exp > currentTime; // Token jest ważny, jeśli exp > currentTime
    } catch (error) {
      console.error("Error decoding token:", error);
      return false; // Jeśli token jest błędny, uznajemy go za nieważny
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { token } = await getAuthData();
      if (token && isTokenValid(token)) {
        // Token istnieje i jest ważny
        router.push("/notes");
      } else {
        // Token jest nieważny lub go brak
        router.push("/login");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // Ekran ładowania
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Ładowanie...</Text>
      </View>
    );
  }

  return null; // Nie wyświetla nic, bo użytkownik jest przekierowany
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