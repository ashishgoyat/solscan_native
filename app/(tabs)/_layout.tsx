import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: "#050d05",
                borderTopColor: "#0f2a0f"
            },
            tabBarActiveTintColor: "#14F195",
            tabBarInactiveTintColor: "#6B7280",
        }}
        >
            <Tabs.Screen name="index" options={{
                title: "Wallet", tabBarIcon: ({ color, size }) => (
                    <Ionicons name="wallet" size={size} color={color} />
                ),
            }}
            />

            <Tabs.Screen name="swap" options={{
                title: "Swap", tabBarIcon: ({ color, size }) => (
                    <Ionicons name="swap-horizontal" size={size} color={color} />
                ),
            }}
            />

            <Tabs.Screen name="settings" options={{
                title: "Settings", tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings" size={size} color={color} />
                ),
            }}
            />
        </Tabs>
    )
}