import { create } from "zustand"
import type { Transaction, User, UserSettings, PaymentMethod, SocialConnection } from "./types"

// Format name from email (remove numbers and special chars, capitalize properly)
function formatNameFromEmail(email: string): string {
  const emailName = email.split('@')[0]
    .replace(/[^a-zA-Z]/g, ' ')  // Remove all non-letters (numbers, special chars)
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  
  return emailName || 'User'
}

// Generate consistent web3-style username from email
function generateUsernameFromEmail(email: string): string {
  const web3Prefixes = [
    'crypto', 'defi', 'nft', 'dao', 'web3', 'blockchain', 'ether', 'stark', 'zero', 'invi',
    'pay', 'crypto', 'defi', 'nft', 'dao', 'web3', 'blockchain', 'ether', 'stark', 'zero', 'invi'
  ]
  const web3Suffixes = [
    'master', 'lord', 'king', 'queen', 'ninja', 'warrior', 'hunter', 'trader', 'builder', 'creator',
    'genius', 'pro', 'expert', 'legend', 'hero', 'champion', 'wizard', 'sage', 'oracle', 'node'
  ]
  
  // Use email hash for consistent username generation
  const hash = email.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const prefixIndex = Math.abs(hash) % web3Prefixes.length
  const suffixIndex = Math.abs(hash >> 8) % web3Suffixes.length
  const number = (Math.abs(hash >> 16) % 999) + 1
  
  return `${web3Prefixes[prefixIndex]}${web3Suffixes[suffixIndex]}${number}`
}

interface AppState {
  // Authentication state
  isAuthenticated: boolean
  userEmail: string | null
  currentUser: { email: string; username: string } | null
  login: (email: string) => void
  logout: () => void

  // Balance and stats
  balance: number
  monthlyDeposits: number
  monthlyWithdrawals: number
  totalReceived: number
  totalSent: number
  updateBalance: (amount: number) => void
  addDeposit: (amount: number) => void
  addWithdrawal: (amount: number) => void

  // Transaction state
  pendingTransaction: Transaction | null
  setPendingTransaction: (tx: Transaction | null) => void
  transactions: Transaction[]
  addTransaction: (tx: Transaction) => void

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

export const useAppStore = create<AppState>((set, get) => ({
  // Authentication state
  isAuthenticated: false,
  userEmail: null,
  currentUser: (() => {
    if (typeof window !== 'undefined') {
      const userSession = localStorage.getItem('inviPay_user')
      if (userSession) {
        const userData = JSON.parse(userSession)
        return { email: userData.email, username: userData.username }
      }
    }
    return null
  })(),
  login: (email) => {
    // Generate unique username from email
    const username = generateUsernameFromEmail(email)
    const userData = {
      email,
      username,
      loginTime: new Date().toISOString()
    }
    localStorage.setItem('inviPay_user', JSON.stringify(userData))
    set({ isAuthenticated: true, userEmail: email, currentUser: { email, username } })
  },
  logout: () => {
    localStorage.removeItem('inviPay_user')
    set({ isAuthenticated: false, userEmail: null, currentUser: null })
  },

  // Balance and stats
  balance: 1234.56,
  monthlyDeposits: 456.78,
  monthlyWithdrawals: 123.45,
  totalReceived: 2500.00,
  totalSent: 1500.00,
  updateBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
  addDeposit: (amount) => set((state) => ({ 
    monthlyDeposits: state.monthlyDeposits + amount,
    totalReceived: state.totalReceived + amount,
    balance: state.balance + amount
  })),
  addWithdrawal: (amount) => set((state) => ({ 
    monthlyWithdrawals: state.monthlyWithdrawals + amount,
    totalSent: state.totalSent + amount,
    balance: state.balance - amount
  })),

  // Transaction state
  transactions: [],
  addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),

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
