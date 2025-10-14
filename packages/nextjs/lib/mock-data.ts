import type { User, Transaction } from "./types"

export const CURRENT_USER_ID = "user_current"

export const mockUsers: User[] = [
  {
    id: "user_1",
    username: "alex_crypto",
    email: "alex@example.com",
    displayName: "Alex Chen",
    avatarUrl: "/diverse-group.png",
    starknetAddress: "0x1234...5678",
    invisibleKeyId: "chipi_key_1",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "user_2",
    username: "sarah_dev",
    email: "sarah@example.com",
    displayName: "Sarah Johnson",
    avatarUrl: "/diverse-woman-portrait.png",
    starknetAddress: "0x2345...6789",
    invisibleKeyId: "chipi_key_2",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "user_3",
    username: "mike_trader",
    email: "mike@example.com",
    displayName: "Mike Rodriguez",
    avatarUrl: "/man.jpg",
    starknetAddress: "0x3456...7890",
    invisibleKeyId: "chipi_key_3",
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "user_4",
    username: "emma_tech",
    email: "emma@example.com",
    displayName: "Emma Wilson",
    avatarUrl: "/professional-teamwork.png",
    starknetAddress: "0x4567...8901",
    invisibleKeyId: "chipi_key_4",
    createdAt: new Date("2024-04-05"),
  },
  {
    id: CURRENT_USER_ID,
    username: "you",
    email: "you@example.com",
    displayName: "You",
    avatarUrl: "/diverse-avatars.png",
    starknetAddress: "0x5678...9012",
    invisibleKeyId: "chipi_key_current",
    createdAt: new Date("2024-05-01"),
  },
]

export const mockTransactions: Transaction[] = [
  {
    id: "tx_1",
    senderId: "user_2",
    receiverId: CURRENT_USER_ID,
    senderUsername: "sarah_dev",
    receiverUsername: "you",
    amount: 45.0,
    status: "success",
    starknetTxHash: "0xabc123...",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "tx_2",
    senderId: CURRENT_USER_ID,
    receiverId: "user_1",
    senderUsername: "you",
    receiverUsername: "alex_crypto",
    amount: 120.5,
    status: "success",
    starknetTxHash: "0xdef456...",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "tx_3",
    senderId: "user_3",
    receiverId: CURRENT_USER_ID,
    senderUsername: "mike_trader",
    receiverUsername: "you",
    amount: 89.99,
    status: "success",
    starknetTxHash: "0xghi789...",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "tx_4",
    senderId: CURRENT_USER_ID,
    receiverId: "user_4",
    senderUsername: "you",
    receiverUsername: "emma_tech",
    amount: 25.0,
    status: "success",
    starknetTxHash: "0xjkl012...",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "tx_5",
    senderId: "user_1",
    receiverId: CURRENT_USER_ID,
    senderUsername: "alex_crypto",
    receiverUsername: "you",
    amount: 200.0,
    status: "success",
    starknetTxHash: "0xmno345...",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
]

export function getCurrentUser(): User {
  return mockUsers.find((u) => u.id === CURRENT_USER_ID)!
}

export function getUserByUsername(username: string): User | undefined {
  return mockUsers.find((u) => u.username.toLowerCase() === username.toLowerCase())
}

export function getTransactionsForUser(userId: string): Transaction[] {
  return mockTransactions
    .filter((t) => t.senderId === userId || t.receiverId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
