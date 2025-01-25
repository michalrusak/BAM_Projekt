import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { EXPO_PUBLIC_BACKEND_URL } from '@env'

export default function Login() {
  const { storeAuthData } = useAuth();
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = EXPO_PUBLIC_BACKEND_URL + "/auth/login";
  const handleLogin = async () => {
    if (!login || !password) {
      Alert.alert("Błąd", "Proszę wypełnić wszystkie pola");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: login,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await storeAuthData(data.token);
        Alert.alert("Sukces", "Zalogowano pomyślnie");
        router.push("/notes");
      } else {
        Alert.alert("Błąd", data.message || "Wystąpił błąd podczas logowania");
      }
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Nie można połączyć się z serwerem. Sprawdź połączenie internetowe."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Text style={styles.title}>Zaloguj się:</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Login:</Text>
          <TextInput
            style={styles.input}
            placeholder="Wpisz login"
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hasło:</Text>
          <TextInput
            style={styles.input}
            placeholder="Wpisz hasło"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.buttonGroup}>
          <Button
            title={isLoading ? "Logowanie..." : "Zaloguj się"}
            onPress={handleLogin}
            disabled={isLoading}
          />
        </View>

        <Text style={styles.registerText}>Nie masz jeszcze u nas konta?</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.registerButton}>Zarejestruj się</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push("/")}
        >
          <FontAwesome
            name="home"
            size={20}
            color="#007bff"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginBottom: 30,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  frame: {
    height: "60%",
    width: "65%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  buttonGroup: {
    marginVertical: 10,
  },
  registerText: {
    textAlign: "center",
    marginTop: 10,
    color: "#777",
  },
  registerButton: {
    textAlign: "center",
    color: "#007bff",
    fontWeight: "bold",
    marginTop: 10,
  },
  homeButton: {
    marginTop: 12,
    flexDirection: "row", // Ikona i tekst w jednej linii
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  homeText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
