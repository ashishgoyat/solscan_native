import { create } from "zustand";

interface WalletState {
  favorites: string[];
  searchHistory: string[];
  addFavorite: (address: string) => void;
  removeFavorite: (address: string) => void;
  isFavorite: (address: string) => boolean;
  addToHistory: (address: string) => void;
  clearHistory: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  favorites: [],
  searchHistory: [],
  addFavorite: (address) =>
    set((state) => ({
      favorites: state.favorites.includes(address)
        ? state.favorites
        : [address, ...state.favorites],
    })),
  removeFavorite: (address) =>
    set((state) => ({
      favorites: state.favorites.filter((item) => item !== address),
    })),
  isFavorite: (address) => get().favorites.includes(address),
  addToHistory: (address) =>
    set((state) => ({
      searchHistory: [
        address,
        ...state.searchHistory.filter((item) => item !== address),
      ].slice(0, 20),
    })),
  clearHistory: () => set({ searchHistory: [] }),
}));
