export interface User {
  id: string
  username: string
  email: string
  displayName: string
  avatarUrl?: string
  starknetAddress: string // Hidden from UI
  invisibleKeyId: string // Hidden from UI
  createdAt: Date
}

export interface Transaction {
  id: string
  senderId: string
  receiverId: string
  senderUsername: string
  receiverUsername: string
  amount: number
  status: "pending" | "success" | "failed"
  starknetTxHash?: string
  createdAt: Date
  completedAt?: Date
}

export interface SendPaymentRequest {
  recipientUsername: string
  amount: number
}

export interface SendPaymentResponse {
  success: boolean
  transactionId?: string
  error?: string
}

export interface UserSettings {
  notifications: {
    push: boolean
    email: boolean
    transactionAlerts: boolean
    securityAlerts: boolean
  }
  privacy: {
    showProfile: boolean
    showActivity: boolean
    allowSearchByUsername: boolean
  }
  preferences: {
    language: string
    currency: string
    theme: "dark" | "light" | "system"
  }
}

export interface PaymentMethod {
  id: string
  type: "bank" | "card"
  name: string
  last4: string
  isDefault: boolean
}

export interface SocialConnection {
  provider: "google" | "github" | "email"
  connected: boolean
  email?: string
}
