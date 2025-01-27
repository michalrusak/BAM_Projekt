import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL + "/auth/register";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      Alert.alert("Błąd", "Wszystkie pola są wymagane");
      return false;
    }

    if (!formData.email.includes("@")) {
      Alert.alert("Błąd", "Podaj prawidłowy adres email");
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert("Błąd", "Hasło musi mieć minimum 6 znaków");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Błąd", "Hasła nie są identyczne");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      Alert.alert(
        "Success",
        `Registration successful! Please save these recovery words:\n\n${data.recoveryPhrase}`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Zarejestruj się:</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Podaj email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Wpisz email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Podaj imię:</Text>
        <TextInput
          style={styles.input}
          placeholder="Wpisz imię"
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
        />

        <Text style={styles.label}>Podaj nazwisko:</Text>
        <TextInput
          style={styles.input}
          placeholder="Wpisz nazwisko"
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
        />

        <Text style={styles.label}>Podaj hasło:</Text>
        <TextInput
          style={styles.input}
          placeholder="Wpisz hasło"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />

        <Text style={styles.label}>Powtórz hasło:</Text>
        <TextInput
          style={styles.input}
          placeholder="Wpisz hasło"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) =>
            setFormData({ ...formData, confirmPassword: text })
          }
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Rejestracja..." : "Zarejestruj się"}
          </Text>
        </TouchableOpacity>

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
    height: "60%",
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    marginBottom: 30,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  form: {
    width: "100%",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  homeButton: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  link: {
    color: "#007bff",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
