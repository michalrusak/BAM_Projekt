import { Text, View, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter(); // Hook do obsługi nawigacji

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        title="Przejdź do logowania"
        onPress={() => router.push("/login")} // Używamy router.push do nawigacji
      />
    </View>
  );
}