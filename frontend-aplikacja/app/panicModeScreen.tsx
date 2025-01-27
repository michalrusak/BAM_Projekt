import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import { usePanicMode } from "../hooks/usePanicMode";

export default function PanicModeScreen() {
  const [email, setEmail] = useState("");
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const { activatePanicMode, deactivatePanicMode, isLoading, error } =
    usePanicMode();
  const [isActivating, setIsActivating] = useState(true);

  const handleSubmit = async () => {
    if (!email || !recoveryPhrase) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const result = isActivating
        ? await activatePanicMode({ email, recoveryPhrase })
        : await deactivatePanicMode({ email, recoveryPhrase });

      Alert.alert(
        "Success",
        isActivating ? "Panic mode activated" : "Panic mode deactivated"
      );
    } catch (err) {
      Alert.alert("Error", error || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsActivating(!isActivating)}
      >
        <Text style={styles.toggleText}>
          Mode: {isActivating ? "Activate" : "Deactivate"}
        </Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Recovery Phrase"
        value={recoveryPhrase}
        onChangeText={setRecoveryPhrase}
        secureTextEntry
      />
      <TouchableOpacity
        style={[
          styles.button,
          isActivating ? styles.activateButton : styles.deactivateButton,
        ]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading
            ? "Loading..."
            : isActivating
            ? "Activate Panic Mode"
            : "Deactivate Panic Mode"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#ff0000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toggleButton: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#444",
    borderRadius: 5,
  },
  toggleText: {
    color: "#fff",
    textAlign: "center",
  },
  activateButton: {
    backgroundColor: "#ff0000",
  },
  deactivateButton: {
    backgroundColor: "#008000",
  },
});
