import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import  Ionicons  from "@expo/vector-icons/Ionicons";
import  Ionicons  from "@expo/vector-icons/Ionicons"
import { WalletScreen } from "./src/screens/WalletScreen";
import { SwapScreen } from "./src/screens/SwapScreen";


export default function App() {
  const [activeTab, setActiveTab] = useState<"wallet" | "swap">("wallet")

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        {activeTab === "wallet" ? <WalletScreen /> : <SwapScreen />}

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab("wallet")}
          >
            <Ionicons
              name={activeTab === "wallet" ? "wallet" : "wallet-outline"}
              size={24}
              color={activeTab === "wallet" ? "#14F195" : "#6B7280"}
            />
            <Text style={[styles.tabLabel, activeTab === "wallet" && styles.tabActive]}>
              Wallet
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab("swap")}
          >
            <Ionicons
              name={activeTab === "swap" ? "swap-horizontal" : "swap-horizontal-outline"}
              size={24}
              color={activeTab === "swap" ? "#14F195" : "#6B7280"}
            />
            <Text style={[styles.tabLabel, activeTab === "swap" && styles.tabActive]}>
              Swap
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}


const styles = StyleSheet.create({
    safe: {
    flex: 1,
    backgroundColor: "#050d05",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#050d05",
    borderTopWidth: 1,
    borderTopColor: "#0f2a0f",
    paddingBottom: 8,
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  tabLabel: {
    color: "#6B7280",
    fontSize: 12,
  },
  tabActive: {
    color: "#14F195",
  },
});