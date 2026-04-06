import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SwapScreen() {
    const [fromAmount, setFromAmount] = useState<string>("")
    const [toAmount, setToAmount] = useState<string>("")
    const [fromToken, setFromToken] = useState<string>("SOL")
    const [toToken, setToToken] = useState<string>("USDC")

    const swapTokens = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    const handleSwap = () => {
        if (!fromAmount) return Alert.alert("Enter an amount");
        Alert.alert(
            "Swap",
            `Swapping ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`,
        );
    };

    return (
        <>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Swap Tokens</Text>

                <View style={[styles.card, { marginBottom: 10 }]}>
                    <View style={styles.cardHeader}>
                        <TouchableOpacity style={styles.tokenSelector}>
                            <View style={[styles.tokenIcon, { backgroundColor: "#9945FF" }]}>
                                <Text style={styles.tokenIconText}>S</Text>
                            </View>
                            <Text style={styles.tokenName}>{fromToken}</Text>
                            <Ionicons name="chevron-down" size={18} color="#888" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.amountInput}
                            value={fromAmount}
                            onChangeText={setFromAmount}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#666"
                        />
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={styles.balanceText}>Balance: 0.0661 {fromToken}</Text>
                        <Text style={styles.usdText}>$499.749</Text>
                    </View>
                </View>

                <View style={styles.arrowContainer}>
                    <TouchableOpacity style={styles.swapArrow} onPress={swapTokens}>
                        <Ionicons name="arrow-down" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, { marginBottom: 10 }]}>
                    <View style={styles.cardHeader}>
                        <TouchableOpacity style={styles.tokenSelector}>
                            <View style={[styles.tokenIcon, { backgroundColor: "#335964" }]}>
                                <Text style={styles.tokenIconText}>U</Text>
                            </View>
                            <Text style={styles.tokenName}>{toToken}</Text>
                            <Ionicons name="chevron-down" size={18} color="#888" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.amountInput}
                            value={toAmount}
                            onChangeText={setToAmount}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#666"
                        />
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={styles.balanceText}>Balance: 0.0661 {fromToken}</Text>
                        <Text style={styles.usdText}>$499.749</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
                    <Text style={styles.swapBtnText}>Swap</Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: "#050d05",
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 60,
    },
    title: {
        color: "#14F195",
        fontSize: 48,
        fontWeight: "900",
        letterSpacing: 1,
        fontFamily: "ui-rounded",
        textAlign: "center",
        marginBottom: 28,
    },
    card: {
        backgroundColor: "#060e06",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#0f2a0f",
        marginBottom: 10,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    tokenSelector: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#080f08",
        paddingLeft: 8,
        paddingRight: 12,
        paddingVertical: 8,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#0f2a0f",
        gap: 6,
    },
    tokenIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    tokenIconText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#FFFFFF",
        fontFamily: "monospace",
    },
    tokenName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#c0d0c0",
        fontFamily: "monospace",
        letterSpacing: 1,
    },
    amountInput: {
        fontSize: 36,
        fontWeight: "700",
        color: "#FFFFFF",
        textAlign: "right",
        flex: 1,
        marginLeft: 10,
        fontFamily: "monospace",
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    balanceText: {
        fontSize: 13,
        color: "#2a4a2a",
        fontFamily: "monospace",
        letterSpacing: 0.5,
    },
    usdText: {
        fontSize: 13,
        color: "#2a4a2a",
        fontFamily: "monospace",
    },
    arrowContainer: {
        alignItems: "center",
        marginVertical: -22,
        zIndex: 10,
    },
    swapArrow: {
        backgroundColor: "#050d05",
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#0f2a0f",
    },
    swapBtn: {
        backgroundColor: "#14F195",
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 24,
        shadowColor: "#14F195",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
    },
    swapBtnText: {
        color: "#000000",
        fontSize: 15,
        fontWeight: "900",
        letterSpacing: 4,
        fontFamily: "monospace",
    },
});