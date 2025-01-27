import { Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen
        name="notes"
        options={{
          headerTitle: "Secure Notes",
          headerBackTitle: "Back",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="panicModeScreen"
        options={{
          headerTitle: "Panic Mode",
          headerBackTitle: "Back",
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
