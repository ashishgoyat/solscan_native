import {
    View,
    Text,
    TouchableOpacity,
    Switch,
    Alert,
    StyleSheet,
} from "react-native";
import { useWalletStore } from "../../src/stores/wallet-store";

export default function SettingsScreen() {
  const isDevnet = useWalletStore((s) => s.isDevnet);
  const toggleNetwork = useWalletStore((s) => s.toggleNetwork);
  const favorites = useWalletStore((s) => s.favorites);
  const searchHistory = useWalletStore((s) => s.searchHistory);
  const clearHistory = useWalletStore((s) => s.clearHistory);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Network Toggle */}
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Use Devnet</Text>
          <Text style={styles.sublabel}>
            {isDevnet ? "Testing network (free SOL)" : "Real network"}
          </Text>
        </View>
        <Switch
          value={isDevnet}
          onValueChange={toggleNetwork}
          trackColor={{ true: "#14F195", false: "#333" }}
        />
      </View>

      {/* Stats */}
      <View style={styles.row}>
        <Text style={styles.label}>Saved Wallets</Text>
        <Text style={styles.value}>{favorites.length}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Search History</Text>
        <Text style={styles.value}>{searchHistory.length}</Text>
      </View>

      {/* Clear History */}
      <TouchableOpacity
        style={styles.dangerButton}
        onPress={() => {
          Alert.alert(
            "Clear History",
            "This will remove all your search history. Favorites won't be affected.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Clear", style: "destructive", onPress: clearHistory },
            ]
          );
        }}
      >
        <Text style={styles.dangerText}>Clear Search History</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050d05",
        padding: 20,
        paddingTop: 40,
    },
    title: {
        color: "#14F195",
        fontSize: 48,
        fontWeight: "900",
        letterSpacing: 1,
        fontFamily: "ui-rounded",
        textAlign: "center",
        marginBottom: 32,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#060e06",
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#0f2a0f",
    },
    label: {
        color: "#c0d0c0",
        fontSize: 15,
        fontFamily: "monospace",
    },
    sublabel: {
        color: "#2a4a2a",
        fontSize: 12,
        fontFamily: "monospace",
        marginTop: 3,
    },
    value: {
        color: "#14F195",
        fontSize: 15,
        fontFamily: "monospace",
    },
    dangerButton: {
        backgroundColor: "#1a0707",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#2a0f0f",
    },
    dangerText: {
        color: "#ff4d4d",
        fontSize: 14,
        fontFamily: "monospace",
        letterSpacing: 2,
        fontWeight: "700",
    },
});