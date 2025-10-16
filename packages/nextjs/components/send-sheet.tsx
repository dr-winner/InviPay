"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Loader2, CheckCircle2, Shield, Plus, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockUsers, CURRENT_USER_ID } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import type { User, Transaction } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

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
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserUsername, setNewUserUsername] = useState("")
  const [isCreatingUser, setIsCreatingUser] = useState(false)

  const users = useAppStore((state) => state.users)
  const addUser = useAppStore((state) => state.addUser)
  const balance = useAppStore((state) => state.balance)
  const addWithdrawal = useAppStore((state) => state.addWithdrawal)
  const addTransaction = useAppStore((state) => state.addTransaction)
  const { toast } = useToast()

  // Combine mock users with store users, ensuring uniqueness
  const allUsers = [...mockUsers, ...users]
    .filter((u) => u.id !== CURRENT_USER_ID)
    .reduce((acc, user) => {
      // Only add if not already in accumulator (prevents duplicates)
      if (!acc.find(u => u.id === user.id)) {
        acc.push(user)
      }
      return acc
    }, [] as User[])
  
  const filteredUsers = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateUser = async () => {
    if (!newUserEmail) return

    setIsCreatingUser(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate proper display name from email (remove numbers and special chars)
    const emailName = newUserEmail.split('@')[0]
      .replace(/[^a-zA-Z]/g, ' ')  // Remove all non-letters (numbers, special chars)
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
    
    // Generate web3-style username
    const username = generateUsernameFromEmail(newUserEmail)
    const displayName = newUserUsername || emailName || username
    
    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      email: newUserEmail,
      displayName,
      avatarUrl: "/placeholder.svg",
      starknetAddress: `0x${Math.random().toString(16).substr(2, 8)}...`,
      invisibleKeyId: `chipi_key_${Date.now()}`,
      createdAt: new Date(),
    }

    // Add to store
    addUser(newUser)
    
    // Close the add user modal
    setShowAddUser(false)
    setNewUserEmail("")
    setNewUserUsername("")
    setIsCreatingUser(false)
    
    // Select the new user and proceed to amount input
    setSelectedUser(newUser)
  }

  // Generate web3-style username from email
  function generateUsernameFromEmail(email: string): string {
    const web3Prefixes = [
      'crypto', 'defi', 'nft', 'dao', 'web3', 'blockchain', 'ether', 'stark', 'zero', 'invi'
    ]
    const web3Suffixes = [
      'master', 'lord', 'king', 'queen', 'ninja', 'warrior', 'hunter', 'trader', 'builder', 'creator'
    ]
    
    const hash = email.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const prefixIndex = Math.abs(hash) % web3Prefixes.length
    const suffixIndex = Math.abs(hash >> 8) % web3Suffixes.length
    const number = (Math.abs(hash >> 16) % 999) + 1
    
    return `${web3Prefixes[prefixIndex]}${web3Suffixes[suffixIndex]}${number}`
  }

  const handleSend = async () => {
    if (!selectedUser || !amount || Number.parseFloat(amount) <= 0) return

    const sendAmount = Number.parseFloat(amount)
    
    // Check if user has sufficient balance
    if (sendAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You need $${(sendAmount - balance).toFixed(2)} more to complete this transaction.`,
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    // Simulate transaction processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create transaction record
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      senderId: CURRENT_USER_ID,
      receiverId: selectedUser.id,
      senderUsername: "you",
      receiverUsername: selectedUser.username, // Use crypto username
      amount: sendAmount,
      status: "success",
      starknetTxHash: `0x${Math.random().toString(16).substr(2, 8)}...`,
      createdAt: new Date(),
      completedAt: new Date(),
    }

    // Update store with transaction and balance
    addTransaction(newTransaction)
    addWithdrawal(sendAmount)

    setIsSending(false)
    setShowSuccess(true)

    // Show success toast
    toast({
      title: "Payment Sent Successfully!",
      description: `$${sendAmount.toFixed(2)} sent to ${selectedUser.displayName}`,
    })

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
            className="fixed inset-x-0 bottom-0 z-50 bg-card border-t border-border rounded-t-3xl max-h-[90vh] overflow-hidden max-w-2xl mx-auto"
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

                    {/* Add User Button - Smaller, positioned */}
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddUser(true)}
                        className="border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add User
                      </Button>
                    </div>

                    {/* User List - Scrollable */}
                    <div className="space-y-2 max-h-64 overflow-y-auto overflow-x-hidden pr-2">
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

                    {/* Add User Form - Full Modal Style */}
                    {showAddUser && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={(e) => {
                          if (e.target === e.currentTarget) {
                            setShowAddUser(false)
                            setNewUserEmail("")
                            setNewUserUsername("")
                          }
                        }}
                      >
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                              <UserIcon className="h-6 w-6 text-primary" />
                              Add New User
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setShowAddUser(false)
                                setNewUserEmail("")
                                setNewUserUsername("")
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="space-y-6">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Email Address *
                              </label>
                              <Input
                                type="email"
                                placeholder="user@example.com"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                className="h-12"
                                autoFocus
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Username (optional)
                              </label>
                              <Input
                                type="text"
                                placeholder="Leave empty for auto-generated web3 username"
                                value={newUserUsername}
                                onChange={(e) => setNewUserUsername(e.target.value)}
                                className="h-12"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                We'll generate a cool web3 username if you leave this empty
                              </p>
                            </div>
                            
                            <div className="flex gap-3 pt-2">
                              <Button
                                onClick={handleCreateUser}
                                disabled={!newUserEmail || isCreatingUser}
                                className="flex-1 h-12"
                              >
                                {isCreatingUser ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating User...
                                  </>
                                ) : (
                                  'Add User'
                                )}
                              </Button>
                              
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowAddUser(false)
                                  setNewUserEmail("")
                                  setNewUserUsername("")
                                }}
                                className="h-12"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
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
                  className="bg-primary rounded-2xl p-8 shadow-2xl text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 30 }}
                    className="mb-4"
                  >
                    <CheckCircle2 className="h-16 w-16 text-primary-foreground mx-auto" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-primary-foreground"
                  >
                    <h3 className="text-xl font-bold mb-2">Payment Sent!</h3>
                    <p className="text-sm opacity-90">
                      ${amount} sent to {selectedUser?.displayName}
                    </p>
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
