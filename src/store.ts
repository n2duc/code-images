import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

// Define the interface for the store state
interface StoreState {
  code: string;
  title: string;
  theme: string;
  darkMode: boolean;
  showBackground: boolean;
  language: string;
  autoDetectLanguage: boolean;
  fontSize: number;
  fontStyle: string;
  padding: number;
}

// Initial state values for the store
const initialState: StoreState = {
  code: "",
  title: "Untitled",
  theme: "hyper",
  darkMode: true,
  showBackground: true,
  language: "plaintext",
  autoDetectLanguage: false,
  fontSize: 18,
  fontStyle: "jetBrainsMono",
  padding: 64,
};

// Define persist configuration options
const persistOptions: PersistOptions<StoreState> = {
  name: "user-preferences", // Key for localStorage
};

// Create the store with persist middleware
const useStore = create<StoreState>()(
  persist(
    () => ({ ...initialState }),
    persistOptions
  )
);

export default useStore;
