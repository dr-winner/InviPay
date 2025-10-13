"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Transaction } from "@/lib/types"
import { CURRENT_USER_ID, mockUsers } from "@/lib/mock-data"

interface TransactionCardProps {
  transaction: Transaction
  index: number
}

export function TransactionCard({ transaction, index }: TransactionCardProps) {
  const isSent = transaction.senderId === CURRENT_USER_ID
  const otherUserId = isSent ? transaction.receiverId : transaction.senderId
  const otherUser = mockUsers.find((u) => u.id === otherUserId)
  const isPending = transaction.status === "pending"

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.02, x: 4 }}
      className="relative group"
    >
      {/* Animated border highlight for new transactions */}
      {index === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 rounded-lg border-2 border-primary pointer-events-none"
        />
      )}

      <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-200">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Avatar className="h-12 w-12">
              <AvatarImage src={otherUser?.avatarUrl || "/placeholder.svg"} alt={otherUser?.displayName} />
              <AvatarFallback>{otherUser?.displayName?.[0] || "?"}</AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Transaction Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground truncate">
                {isSent ? `Sent to ${otherUser?.displayName}` : `Received from ${otherUser?.displayName}`}
              </p>
              {isPending && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              @{isSent ? transaction.receiverUsername : transaction.senderUsername}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(transaction.createdAt)}</p>
          </div>

          {/* Amount & Icon */}
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.1 }}
              className="text-right"
            >
              <p className={`text-lg font-bold ${isSent ? "text-destructive" : "text-primary"}`}>
                {isSent ? "-" : "+"}${transaction.amount.toFixed(2)}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={`p-2 rounded-full ${isSent ? "bg-destructive/10" : "bg-primary/10"}`}
            >
              {isSent ? (
                <ArrowUpRight className="h-4 w-4 text-destructive" />
              ) : (
                <ArrowDownLeft className="h-4 w-4 text-primary" />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
