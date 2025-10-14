"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UserPlus, Search, Mail, QrCode, Link2, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockUsers, CURRENT_USER_ID } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import type { User } from "@/lib/types"

interface AddContactDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddContactDialog({ isOpen, onClose }: AddContactDialogProps) {
  const [method, setMethod] = useState<"search" | "email" | "qr" | "link">("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [emailInput, setEmailInput] = useState("")
  const [inviteSent, setInviteSent] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const addUser = useAppStore((state) => state.addUser)

  const availableUsers = mockUsers.filter((u) => u.id !== CURRENT_USER_ID)
  const filteredUsers = availableUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddContact = (user: User) => {
    addUser(user)
    // Show success animation
    setTimeout(() => {
      onClose()
      setSearchQuery("")
    }, 500)
  }

  const handleSendInvite = () => {
    if (emailInput) {
      setInviteSent(true)
      setTimeout(() => {
        setInviteSent(false)
        setEmailInput("")
      }, 2000)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://invipay.app/invite/you")
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const methods = [
    { id: "search" as const, label: "Search", icon: Search },
    { id: "email" as const, label: "Email", icon: Mail },
    { id: "qr" as const, label: "QR Code", icon: QrCode },
    { id: "link" as const, label: "Link", icon: Link2 },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Add Contact
          </DialogTitle>
          <DialogDescription>Choose how you want to add a new contact to InviPay</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Method Selector */}
          <div className="flex gap-2 p-1 bg-secondary rounded-lg">
            {methods.map((m) => {
              const Icon = m.icon
              return (
                <motion.button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-md transition-colors relative ${
                    method === m.id ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{m.label}</span>
                  {method === m.id && (
                    <motion.div
                      layoutId="activeMethod"
                      className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Content based on selected method */}
          <AnimatePresence mode="wait">
            <motion.div
              key={method}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {method === "search" && (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by username or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, index) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.displayName} />
                              <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm">{user.displayName}</p>
                              <p className="text-xs text-muted-foreground">@{user.username}</p>
                            </div>
                          </div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button size="sm" onClick={() => handleAddContact(user)}>
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No users found</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {method === "email" && (
                <>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="friend@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Send an invitation email to join InviPay</p>
                  </div>
                  <Button onClick={handleSendInvite} className="w-full" disabled={!emailInput || inviteSent}>
                    {inviteSent ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Invite Sent!
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invite
                      </>
                    )}
                  </Button>
                </>
              )}

              {method === "qr" && (
                <div className="flex flex-col items-center py-6 space-y-4">
                  <div className="w-48 h-48 bg-white rounded-lg p-4 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 rounded flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">Scan this QR code to add me on InviPay</p>
                </div>
              )}

              {method === "link" && (
                <>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input value="https://invipay.app/invite/you" readOnly className="flex-1" />
                      <Button onClick={handleCopyLink} size="icon" variant="outline">
                        {linkCopied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Share this link with anyone to add them to your contacts
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
