import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useWalletStore } from "../../src/stores/wallet-store";

function short(address: string, size = 5) {
  return `${address.slice(0, size)}...${address.slice(-size)}`;
}

export default function SettingsScreen() {
  const router = useRouter();
  const favorites = useWalletStore((state) => state.favorites);
  const searchHistory = useWalletStore((state) => state.searchHistory);
  const clearHistory = useWalletStore((state) => state.clearHistory);
  const removeFavorite = useWalletStore((state) => state.removeFavorite);
  const [openPanel, setOpenPanel] = useState<"favorites" | "history" | null>(null);

  const openWallet = (wallet: string) => {
    router.push({ pathname: "/(tabs)", params: { wallet } });
  };

  const togglePanel = (panel: "favorites" | "history") => {
    setOpenPanel((current) => (current === panel ? null : panel));
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>SOLTRACK</Text>
        <Text style={styles.title}>Wallet Library</Text>
        <Text style={styles.subtitle}>
          Open saved wallets fast, revisit recent searches, and keep your explorer flow tidy.
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{favorites.length}</Text>
          <Text style={styles.summaryLabel}>Saved</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{searchHistory.length}</Text>
          <Text style={styles.summaryLabel}>Recent</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.panelToggle}
        activeOpacity={0.85}
        onPress={() => togglePanel("favorites")}
      >
        <View>
          <Text style={styles.panelTitle}>Saved Wallets</Text>
          <Text style={styles.panelSubtitle}>
            Tap to {openPanel === "favorites" ? "hide" : "show"} your bookmarked addresses
          </Text>
        </View>
        <View style={styles.panelRight}>
          <Text style={styles.panelCount}>{favorites.length}</Text>
          <Ionicons
            name={openPanel === "favorites" ? "chevron-up" : "chevron-down"}
            size={18}
            color="#d1fae5"
          />
        </View>
      </TouchableOpacity>

      {openPanel === "favorites" && (
        <View style={styles.listCard}>
          {favorites.length === 0 ? (
            <Text style={styles.emptyText}>No saved wallets yet. Heart a wallet from the home screen to keep it here.</Text>
          ) : (
            favorites.map((wallet) => (
              <View key={wallet} style={styles.walletRow}>
                <TouchableOpacity
                  style={styles.walletInfo}
                  activeOpacity={0.8}
                  onPress={() => openWallet(wallet)}
                >
                  <View style={styles.walletIcon}>
                    <Ionicons name="bookmark" size={16} color="#08130c" />
                  </View>
                  <View style={styles.walletTextWrap}>
                    <Text style={styles.walletLabel}>{short(wallet)}</Text>
                    <Text style={styles.walletFull} numberOfLines={1}>
                      {wallet}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.inlineAction}
                  onPress={() => removeFavorite(wallet)}
                >
                  <Ionicons name="trash-outline" size={18} color="#fca5a5" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.panelToggle}
        activeOpacity={0.85}
        onPress={() => togglePanel("history")}
      >
        <View>
          <Text style={styles.panelTitle}>Search History</Text>
          <Text style={styles.panelSubtitle}>
            Tap to {openPanel === "history" ? "hide" : "show"} your recent wallet lookups
          </Text>
        </View>
        <View style={styles.panelRight}>
          <Text style={styles.panelCount}>{searchHistory.length}</Text>
          <Ionicons
            name={openPanel === "history" ? "chevron-up" : "chevron-down"}
            size={18}
            color="#d1fae5"
          />
        </View>
      </TouchableOpacity>

      {openPanel === "history" && (
        <View style={styles.listCard}>
          {searchHistory.length === 0 ? (
            <Text style={styles.emptyText}>No searches yet. Wallets you scan will appear here automatically.</Text>
          ) : (
            searchHistory.map((wallet) => (
              <TouchableOpacity
                key={wallet}
                style={styles.historyRow}
                activeOpacity={0.8}
                onPress={() => openWallet(wallet)}
              >
                <View style={styles.walletIcon}>
                  <Ionicons name="time-outline" size={16} color="#08130c" />
                </View>
                <View style={styles.walletTextWrap}>
                  <Text style={styles.walletLabel}>{short(wallet)}</Text>
                  <Text style={styles.walletFull} numberOfLines={1}>
                    {wallet}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={18} color="#6ee7b7" />
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => {
          Alert.alert(
            "Clear Search History",
            "This removes only recent searches. Saved wallets stay intact.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Clear", style: "destructive", onPress: clearHistory },
            ]
          );
        }}
      >
        <Ionicons name="trash-outline" size={18} color="#fecaca" />
        <Text style={styles.clearButtonText}>Clear History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#03110b",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 48,
  },
  hero: {
    backgroundColor: "#072018",
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#123b2c",
  },
  eyebrow: {
    color: "#6ee7b7",
    fontSize: 12,
    letterSpacing: 3,
    fontFamily: "monospace",
    marginBottom: 10,
  },
  title: {
    color: "#f0fdf4",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 10,
  },
  subtitle: {
    color: "#9ac7b2",
    fontSize: 14,
    lineHeight: 22,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#081711",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#123222",
  },
  summaryValue: {
    color: "#6ee7b7",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 4,
  },
  summaryLabel: {
    color: "#8cb9a0",
    fontSize: 13,
    letterSpacing: 1,
  },
  panelToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#081711",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#123222",
    marginBottom: 12,
  },
  panelTitle: {
    color: "#f0fdf4",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  panelSubtitle: {
    color: "#7ea993",
    fontSize: 13,
    maxWidth: 250,
  },
  panelRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  panelCount: {
    color: "#6ee7b7",
    fontSize: 18,
    fontWeight: "900",
  },
  listCard: {
    backgroundColor: "#06150f",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#102b1f",
    marginBottom: 16,
  },
  emptyText: {
    color: "#7ea993",
    fontSize: 14,
    lineHeight: 22,
    padding: 8,
  },
  walletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  walletInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  walletIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#6ee7b7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  walletTextWrap: {
    flex: 1,
  },
  walletLabel: {
    color: "#eafff4",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  walletFull: {
    color: "#6f9b87",
    fontSize: 12,
    fontFamily: "monospace",
  },
  inlineAction: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a0d10",
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: "#2a1116",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#4a1d27",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  clearButtonText: {
    color: "#fecaca",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
