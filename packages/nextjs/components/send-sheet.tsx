"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Loader2, CheckCircle2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockUsers, CURRENT_USER_ID } from "@/lib/mock-data"
import type { User } from "@/lib/types"

interface SendSheetProps {
  isOpen: boolean
  onClose: () => void
  onSendComplete: () => void
}

export function SendSheet({ isOpen, onClose, onSendComplete }: SendSheetProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [amount, setAmount] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const filteredUsers = mockUsers
    .filter((u) => u.id !== CURRENT_USER_ID)
    .filter(
      (u) =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  const handleSend = async () => {
    if (!selectedUser || !amount || Number.parseFloat(amount) <= 0) return

    setIsSending(true)

    // Simulate transaction processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSending(false)
    setShowSuccess(true)

    // Reset after success animation
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedUser(null)
      setAmount("")
      setSearchQuery("")
      onSendComplete()
      onClose()
    }, 2000)
  }

  const handleClose = () => {
    if (!isSending && !showSuccess) {
      setSelectedUser(null)
      setAmount("")
      setSearchQuery("")
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-card border-t border-border rounded-t-3xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-bold">Send Money</h2>
                <Button variant="ghost" size="icon" onClick={handleClose} disabled={isSending || showSuccess}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {!selectedUser ? (
                  <div className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search username or email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 text-base bg-secondary border-border focus:border-primary transition-colors"
                      />
                    </div>

                    {/* User List */}
                    <div className="space-y-2">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                          <motion.button
                            key={user.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedUser(user)}
                            className="w-full flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left"
                          >
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.displayName} />
                              <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground">{user.displayName}</p>
                              <p className="text-sm text-muted-foreground">@{user.username}</p>
                            </div>
                          </motion.button>
                        ))
                      ) : (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center text-muted-foreground py-8"
                        >
                          {searchQuery ? "No users found" : "Start typing to search"}
                        </motion.p>
                      )}
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="space-y-6"
                  >
                    {/* Selected User */}
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={selectedUser.avatarUrl || "/placeholder.svg"}
                          alt={selectedUser.displayName}
                        />
                        <AvatarFallback>{selectedUser.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{selectedUser.displayName}</p>
                        <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(null)}
                        disabled={isSending || showSuccess}
                      >
                        Change
                      </Button>
                    </div>

                    {/* Amount Input with pulsating focus effect */}
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-primary">
                          $
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          className="pl-12 h-16 text-3xl font-bold bg-secondary border-2 border-border focus:border-primary transition-all"
                          style={{
                            boxShadow: isFocused ? "0 0 0 4px rgba(0, 255, 255, 0.25)" : "none",
                          }}
                          disabled={isSending || showSuccess}
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-muted-foreground flex items-center gap-1"
                      >
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          className="inline-block w-2 h-2 rounded-full bg-primary"
                        />
                        Gas fees sponsored by InviPay
                      </motion.p>
                    </div>

                    {/* Send Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleSend}
                        disabled={!amount || Number.parseFloat(amount) <= 0 || isSending || showSuccess}
                        className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {isSending ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Sending...
                          </span>
                        ) : showSuccess ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Sent!
                          </span>
                        ) : (
                          `Send $${amount || "0.00"}`
                        )}
                      </Button>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xs text-muted-foreground flex items-center justify-center gap-1.5"
                    >
                      <Shield className="h-3 w-3 text-primary" />
                      Your transaction is encrypted and secure
                    </motion.p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Success Overlay with spring animation */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="bg-primary rounded-full p-8 shadow-2xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <CheckCircle2 className="h-24 w-24 text-primary-foreground" />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
