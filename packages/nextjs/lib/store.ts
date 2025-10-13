import { create } from "zustand"
import type { Transaction, User, UserSettings, PaymentMethod, SocialConnection } from "./types"

interface AppState {
  // Transaction state
  pendingTransaction: Transaction | null
  setPendingTransaction: (tx: Transaction | null) => void

  // UI state
  isTransactionModalOpen: boolean
  setTransactionModalOpen: (open: boolean) => void

  // Loading states
  isSending: boolean
  setIsSending: (sending: boolean) => void

  userSettings: UserSettings
  updateSettings: (settings: Partial<UserSettings>) => void

  paymentMethods: PaymentMethod[]
  addPaymentMethod: (method: PaymentMethod) => void
  removePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void

  socialConnections: SocialConnection[]
  updateSocialConnection: (provider: "google" | "github" | "email", connected: boolean, email?: string) => void

  users: User[]
  addUser: (user: User) => void
}

export const useAppStore = create<AppState>((set) => ({
  pendingTransaction: null,
  setPendingTransaction: (tx) => set({ pendingTransaction: tx }),

  isTransactionModalOpen: false,
  setTransactionModalOpen: (open) => set({ isTransactionModalOpen: open }),

  isSending: false,
  setIsSending: (sending) => set({ isSending: sending }),

  userSettings: {
    notifications: {
      push: true,
      email: true,
      transactionAlerts: true,
      securityAlerts: true,
    },
    privacy: {
      showProfile: true,
      showActivity: false,
      allowSearchByUsername: true,
    },
    preferences: {
      language: "en",
      currency: "USD",
      theme: "dark",
    },
  },
  updateSettings: (settings) =>
    set((state) => ({
      userSettings: {
        ...state.userSettings,
        ...settings,
        notifications: { ...state.userSettings.notifications, ...settings.notifications },
        privacy: { ...state.userSettings.privacy, ...settings.privacy },
        preferences: { ...state.userSettings.preferences, ...settings.preferences },
      },
    })),

  paymentMethods: [
    {
      id: "pm_1",
      type: "bank",
      name: "Chase Checking",
      last4: "4242",
      isDefault: true,
    },
    {
      id: "pm_2",
      type: "card",
      name: "Visa",
      last4: "1234",
      isDefault: false,
    },
  ],
  addPaymentMethod: (method) => set((state) => ({ paymentMethods: [...state.paymentMethods, method] })),
  removePaymentMethod: (id) => set((state) => ({ paymentMethods: state.paymentMethods.filter((pm) => pm.id !== id) })),
  setDefaultPaymentMethod: (id) =>
    set((state) => ({
      paymentMethods: state.paymentMethods.map((pm) => ({ ...pm, isDefault: pm.id === id })),
    })),

  socialConnections: [
    { provider: "email", connected: true, email: "you@example.com" },
    { provider: "google", connected: false },
    { provider: "github", connected: false },
  ],
  updateSocialConnection: (provider, connected, email) =>
    set((state) => ({
      socialConnections: state.socialConnections.map((sc) =>
        sc.provider === provider ? { ...sc, connected, email } : sc,
      ),
    })),

  users: [],
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
}))
