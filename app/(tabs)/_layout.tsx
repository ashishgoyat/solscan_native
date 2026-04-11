import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                animation: "fade",
                tabBarStyle: {
                    backgroundColor: "#06150f",
                    borderTopColor: "#123222",
                    height: 66,
                    paddingTop: 8,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: "#6ee7b7",
                tabBarInactiveTintColor: "#5f866f",
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "700",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Wallet",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: "Library",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
