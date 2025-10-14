"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TransactionCard } from "@/components/transaction-card"
import { getTransactionsForUser, CURRENT_USER_ID } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import type { Transaction } from "@/lib/types"

export function ActivityFeed() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Get transactions from store
  const storeTransactions = useAppStore((state) => state.transactions)
  const totalSent = useAppStore((state) => state.totalSent)
  const totalReceived = useAppStore((state) => state.totalReceived)
  
  // Combine store transactions with mock transactions
  const mockTransactions = getTransactionsForUser(CURRENT_USER_ID)
  const allTransactions = [...storeTransactions, ...mockTransactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const loadTransactions = () => {
    // Transactions are now managed by the store
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    loadTransactions()
    setIsRefreshing(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity</h2>
          <p className="text-sm text-muted-foreground">Your recent transactions</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="hover:bg-primary/10"
        >
          <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {allTransactions.length > 0 ? (
            allTransactions.map((transaction, index) => (
              <TransactionCard key={transaction.id} transaction={transaction} index={index} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-2">Send your first payment to get started</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Summary */}
      {allTransactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 pt-4"
        >
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-xs text-muted-foreground mb-1">Total Sent</p>
            <p className="text-xl font-bold text-destructive">
              ${totalSent.toFixed(2)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-xs text-muted-foreground mb-1">Total Received</p>
            <p className="text-xl font-bold text-primary">
              ${totalReceived.toFixed(2)}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
