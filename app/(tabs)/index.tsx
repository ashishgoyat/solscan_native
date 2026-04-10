import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Alert,
    Linking,
} from "react-native";
import { useRouter } from 'expo-router';
import { useWalletStore } from '../../src/stores/wallet-store';



export default function WalletScreen() {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);
    const [tokens, setTokens] = useState<any[]>([]);
    const [txns, setTxns] = useState<any[]>([]);
    const router = useRouter();

    const addToHistory = useWalletStore((s) => s.addToHistory);
    const searchHistory = useWalletStore((s) => s.searchHistory);
    const isDevnet = useWalletStore((s) => s.isDevnet);
    const addFavorite = useWalletStore((s) => s.addFavorite);
    const removeFavorite = useWalletStore((s) => s.removeFavorite);
    const favorites = useWalletStore((s) => s.favorites);
    const favorited = favorites.includes(address);


    const RPC = isDevnet ? "https://api.devnet.solana.com" : "https://api.mainnet-beta.solana.com";

    const rpc = async (method: string, params: any[]) => {
        const res = await axios.post(RPC,
            { jsonrpc: "2.0", id: 1, method, params },
            { headers: { "Content-Type": "application/json" } }
        );
        const json = res.data;
        if (json.error) throw new Error(json.error.message);
        return json.result;
    };

    const getBalance = async (addr: string) => {
        const result = await rpc("getBalance", [addr]);
        return result.value / 1_000_000_000;
    };

    const getTokens = async (addr: string) => {
        const result = await rpc("getTokenAccountsByOwner", [
            addr,
            { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
            { encoding: "jsonParsed" },
        ]);
        return (result.value || [])
            .map((a: any) => ({
                mint: a.account.data.parsed.info.mint,
                amount: a.account.data.parsed.info.tokenAmount.uiAmount,
            }))
            .filter((t: any) => t.amount > 0);
    };

    const getTxns = async (addr: string) => {
        const sigs = await rpc("getSignaturesForAddress", [addr, { limit: 10 }]);
        return sigs.map((s: any) => ({
            sig: s.signature,
            time: s.blockTime,
            ok: !s.error,
        }));
    };

    const short = (s: string, n = 4) => `${s.slice(0, n)}...${s.slice(-n)}`;

    const timeAgo = (ts: number) => {
        const s = Math.floor(Date.now() / 1000 - ts);
        if (s < 60) return `${s}s ago`;
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    };

    const search = async () => {
        const addr = address.trim();
        if (!addr) return Alert.alert("Enter a wallet address");

        addToHistory(addr)
        setLoading(true);
        try {
            const [bal, tok, txn] = await Promise.all([
                getBalance(addr),
                getTokens(addr),
                getTxns(addr),
            ]);
            setBalance(bal);
            setTokens(tok);
            setTxns(txn);
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
        setLoading(false);
    };

    return (<>
        <StatusBar style="light" />
        <ScrollView style={{ backgroundColor: "#050d05" }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Solscan</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Network indicator */}
            {isDevnet && (
                <View style={styles.devnetBanner}>
                    <Text style={styles.devnetText}>DEVNET</Text>
                </View>
            )}

            {/* Search History — show before any search */}
            {searchHistory.length > 0 && (
                <View style={styles.historySection}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    {searchHistory.slice(0, 5).map((addr) => (
                        <TouchableOpacity
                            key={addr}
                            style={styles.historyItem}
                            onPress={() => {
                                setAddress(addr);
                                search()
                            }}
                        >
                            <Text style={styles.historyAddress} numberOfLines={1}>
                                {addr}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Search Input */}
            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>WALLET ADDRESS</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>◎</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Solana address..."
                        placeholderTextColor="#4a7a4a"
                        value={address}
                        onChangeText={setAddress}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={[styles.btn, loading && styles.btnDisabled]}
                onPress={search}
                disabled={loading}
                activeOpacity={0.8}
            >
                {loading ? (
                    <ActivityIndicator color="#000" size="small" />
                ) : (
                    <Text style={styles.btnText}>SCAN WALLET</Text>
                )}
            </TouchableOpacity>

            {/* Balance Card */}
            {balance !== null && (
                <View style={styles.balanceCard}>
                    <View style={styles.balanceTopRow}>
                        <TouchableOpacity
                            onPress={() => {
                                if (favorited) {
                                    removeFavorite(address);
                                } else {
                                    addFavorite(address);
                                }
                            }}
                            style={styles.button}>
                            <Ionicons
                                name={favorited ? "heart" : "heart-outline"}
                                size={24}
                                color={favorited ? "#FF4545" : "#666"}
                            />
                        </TouchableOpacity>
                        <Text style={styles.balanceLabel}>SOL BALANCE</Text>
                        <View style={styles.liveTag}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveText}>LIVE</Text>
                        </View>
                    </View>
                    <Text style={styles.balanceAmount}>{balance.toFixed(4)}</Text>
                    <Text style={styles.balanceCurrency}>SOL</Text>
                    <View style={styles.balanceDivider} />
                    <Text style={styles.balanceAddress}>{short(address.trim(), 8)}</Text>
                </View>
            )}

            {/* Tokens Section */}
            {tokens.length > 0 && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>TOKENS</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{tokens.length}</Text>
                        </View>
                    </View>
                    <FlatList
                        data={tokens}
                        keyExtractor={(t) => t.mint}
                        scrollEnabled={false}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => {
                                router.push(`/token/${item.mint}`)
                            }}>
                                <View style={[styles.row, index === tokens.length - 1 && styles.rowLast]}>
                                    <View style={styles.rowIconWrap}>
                                        <Text style={styles.rowIcon}>⬖</Text>
                                    </View>
                                    <View style={styles.rowLeft}>
                                        <Text style={styles.rowText}>{short(item.mint, 6)}</Text>
                                        <Text style={styles.rowSub}>{item.amount.toFixed(4)} tokens</Text>
                                    </View>
                                    <Text style={styles.rowAmount}>{item.amount.toFixed(4)}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            {tokens.length === 0 && balance !== null && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>✧</Text>
                    <Text style={styles.emptyText}>NO TOKENS FOUND</Text>
                </View>
            )}

            {/* Transactions Section */}
            {txns.length > 0 && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>TRANSACTIONS</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{txns.length}</Text>
                        </View>
                    </View>
                    <FlatList
                        data={txns}
                        keyExtractor={(t) => t.sig}
                        scrollEnabled={false}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={[styles.row, index === txns.length - 1 && styles.rowLast]}
                                activeOpacity={0.7}
                                onPress={() => Linking.openURL(`https://solscan.io/tx/${item.sig}`)}
                            >
                                <View style={[styles.statusPill, item.ok ? styles.statusPillOk : styles.statusPillFail]}>
                                    <Text style={[styles.statusPillText, item.ok ? styles.statusPillTextOk : styles.statusPillTextFail]}>
                                        {item.ok ? "OK" : "FAIL"}
                                    </Text>
                                </View>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.rowText}>{short(item.sig)}</Text>
                                    <Text style={styles.rowSub}>
                                        {item.time ? timeAgo(item.time) : "pending"}
                                    </Text>
                                </View>
                                <Text style={styles.rowArrow}>›</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            {txns.length === 0 && balance !== null && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>✧</Text>
                    <Text style={styles.emptyText}>NO TRANSACTIONS FOUND</Text>
                </View>
            )}

            <Text style={styles.footer}>POWERED BY SOLANA {isDevnet ? "DEVNET" : "MAINNET"}</Text>
        </ScrollView >
    </>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 60,
    },

    /* Header */
    header: {
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: 20,
    },
    headerDot: {},
    headerTitle: {
        color: "#14F195",
        fontSize: 48,
        fontWeight: "900",
        letterSpacing: 1,
        fontFamily: "ui-rounded",
    },
    headerSub: {},

    divider: {
        height: 1,
        backgroundColor: "#0f1f0f",
        marginBottom: 28,
    },

    /* Input */
    inputWrapper: {
        marginBottom: 12,
    },
    inputLabel: {
        color: "#6aaa6a",
        fontSize: 11,
        letterSpacing: 3,
        fontFamily: "monospace",
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#080f08",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#0f2a0f",
        paddingHorizontal: 16,
    },
    inputIcon: {
        color: "#14F195",
        fontSize: 18,
        marginRight: 10,
        opacity: 0.9,
    },
    input: {
        flex: 1,
        color: "#14F195",
        paddingVertical: 16,
        fontSize: 15,
        fontFamily: "monospace",
        letterSpacing: 1,
    },

    /* Button */
    btn: {
        backgroundColor: "#14F195",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 28,
        shadowColor: "#14F195",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
    },
    btnDisabled: {
        opacity: 0.4,
        shadowOpacity: 0,
    },
    btnText: {
        color: "#000",
        fontWeight: "900",
        fontSize: 15,
        letterSpacing: 4,
        fontFamily: "monospace",
    },

    /* Balance Card */
    balanceCard: {
        backgroundColor: "#060e06",
        borderRadius: 12,
        marginBottom: 28,
        padding: 24,
        borderWidth: 1,
        borderColor: "#0f2a0f",
    },
    balanceCardInner: {},
    glowOverlay: {},
    balanceTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    balanceLabel: {
        color: "#2a5a2a",
        fontSize: 13,
        letterSpacing: 4,
        fontFamily: "monospace",
    },
    liveTag: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#3a693a",
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    liveDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#45c059",
        marginRight: 5,
    },
    liveText: {
        color: "#91f114",
        fontSize: 12,
        letterSpacing: 2,
        fontFamily: "monospace",
    },
    balanceAmount: {
        color: "#ffffff",
        fontSize: 42,
        fontWeight: "900",
        fontFamily: "monospace",
        letterSpacing: -1,
        lineHeight: 48,
    },
    balanceCurrency: {
        color: "#14F195",
        fontSize: 17,
        fontFamily: "monospace",
        letterSpacing: 4,
        marginTop: 4,
    },
    balanceDivider: {
        height: 1,
        backgroundColor: "#0f2a0f",
        marginVertical: 16,
    },
    balanceAddress: {
        color: "#1a4a1a",
        fontSize: 13,
        fontFamily: "monospace",
        letterSpacing: 2,
    },

    /* Sections */
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        color: "#2a5a2a",
        fontSize: 13,
        letterSpacing: 4,
        fontFamily: "monospace",
        marginRight: 10,
    },
    badge: {
        backgroundColor: "#0a1f0a",
        borderWidth: 1,
        borderColor: "#0f2a0f",
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    badgeText: {
        color: "#14F195",
        fontSize: 13,
        fontFamily: "monospace",
    },

    /* Rows */
    row: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#060e06",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    rowLast: {
        marginBottom: 0,
    },
    rowIconWrap: {
        width: 28,
        alignItems: "center",
        marginRight: 12,
    },
    rowIcon: {
        color: "#1a4a1a",
        fontSize: 16,
    },
    rowLeft: {
        flex: 1,
    },
    rowText: {
        color: "#c0d0c0",
        fontSize: 15,
        fontFamily: "monospace",
        letterSpacing: 0.5,
    },
    rowSub: {
        color: "#2a4a2a",
        fontSize: 13,
        fontFamily: "monospace",
        marginTop: 3,
        letterSpacing: 0.5,
    },
    rowAmount: {
        color: "#14F195",
        fontSize: 14,
        fontFamily: "monospace",
        opacity: 0.7,
    },
    rowArrow: {
        color: "#1a4a1a",
        fontSize: 22,
        marginLeft: 8,
    },

    /* Status Pills */
    statusPill: {
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 12,
        borderWidth: 1,
    },
    statusPillOk: {
        backgroundColor: "#071207",
        borderColor: "#0f2a0f",
    },
    statusPillFail: {
        backgroundColor: "#120707",
        borderColor: "#2a0f0f",
    },
    statusPillText: {
        fontSize: 12,
        fontFamily: "monospace",
        letterSpacing: 2,
        fontWeight: "700",
    },
    statusPillTextOk: {
        color: "#14F195",
    },
    statusPillTextFail: {
        color: "#ff4d4d",
    },

    /* Empty State */
    emptyState: {
        alignItems: "center",
        paddingVertical: 24,
        marginBottom: 20,
    },
    emptyIcon: {
        color: "#62cb62",
        fontSize: 28,
        marginBottom: 8,
    },
    emptyText: {
        color: "#1a3a1a",
        fontSize: 13,
        letterSpacing: 4,
        fontFamily: "monospace",
    },

    /* Footer */
    footer: {
        textAlign: "center",
        color: "#4a7a4a",
        fontSize: 12,
        letterSpacing: 3,
        fontFamily: "monospace",
        marginTop: 20,
    },

    // Devnet banner
    devnetBanner: {
        backgroundColor: "#1a0f00",
        borderWidth: 1,
        borderColor: "#3a2500",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
        alignSelf: "center",
        marginBottom: 16,
    },
    devnetText: {
        color: "#f5a623",
        fontSize: 12,
        fontFamily: "monospace",
        letterSpacing: 3,
        fontWeight: "700",
    },

    // Search history
    historySection: {
        marginBottom: 20,
    },
    historyItem: {
        backgroundColor: "#060e06",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: "#0f2a0f",
    },
    historyAddress: {
        color: "#6aaa6a",
        fontSize: 13,
        fontFamily: "monospace",
        letterSpacing: 0.5,
    },

    // Favorite heart button
    button: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
});