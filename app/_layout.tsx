import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: "fade_from_bottom",
                    animationDuration: 240,
                    contentStyle: { backgroundColor: "#03110b" },
                }}
            >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="token/[mint]" options={{ animation: "slide_from_right" }} />
            </Stack>
        </SafeAreaProvider>
    );
}
