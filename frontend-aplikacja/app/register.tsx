import React from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';

export default function Register() {
  const router = useRouter(); // Obsługa nawigacji

  return (
    <View style={styles.container}>
   
      <Text style={styles.header}>Zarejestruj się:</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Podaj email:</Text>
        <TextInput style={styles.input} placeholder="Wpisz email" />

        <Text style={styles.label}>Podaj imię:</Text>
        <TextInput style={styles.input} placeholder="Wpisz imię" />

        <Text style={styles.label}>Podaj nazwisko:</Text>
        <TextInput style={styles.input} placeholder="Wpisz nazwisko" />

        <Text style={styles.label}>Podaj hasło:</Text>
        <TextInput style={styles.input} placeholder="Wpisz hasło" secureTextEntry />

        <Text style={styles.label}>Powtórz hasło:</Text>
        <TextInput style={styles.input} placeholder="Wpisz hasło" secureTextEntry />

       
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert("Zarejestrowano!")}
        >
          <Text style={styles.buttonText}>Zarejestruj się</Text>
        </TouchableOpacity>

       
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push('/')}>
               <FontAwesome name="home" size={20} color="#007bff" style={styles.icon} />
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
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
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
});