"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Activity, User, Plus, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SendSheet } from "@/components/send-sheet"
import { ActivityFeed } from "@/components/activity-feed"
import { ProfileSection } from "@/components/profile-section"
import { getCurrentUser, mockUsers, CURRENT_USER_ID } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"send" | "activity" | "profile">("send")
  const [isSendSheetOpen, setIsSendSheetOpen] = useState(false)
  const currentUser = getCurrentUser()

  const users = useAppStore((state) => state.users)
  const addUser = useAppStore((state) => state.addUser)

  useEffect(() => {
    if (users.length === 0) {
      mockUsers.forEach((user) => {
        if (user.id !== CURRENT_USER_ID) {
          addUser(user)
        }
      })
    }
  }, [users.length, addUser])

  const tabs = [
    { id: "send" as const, label: "Send", icon: Send },
    { id: "activity" as const, label: "Activity", icon: Activity },
    { id: "profile" as const, label: "Profile", icon: User },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with subtle entrance animation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="border-b border-border bg-card"
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
            >
              <span className="text-primary-foreground font-bold text-lg">I</span>
            </motion.div>
            <h1 className="text-xl font-bold">InviPay</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">@{currentUser.username}</span>
          </div>
        </div>
      </motion.header>

      {/* Main Content with page transitions */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "linear" }}
          >
            {activeTab === "send" && (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center space-y-4 py-12"
                >
                  <h2 className="text-3xl font-bold">Send Money Instantly</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Send payments to anyone with zero gas fees. Powered by invisible crypto technology.
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setIsSendSheetOpen(true)}
                      size="lg"
                      className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      New Payment
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Quick Stats with staggered animation */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Balance", value: "$1,234.56" },
                    { label: "This Month", value: "$456.78" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        {stat.label === "Balance" && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <Lock className="h-3 w-3 text-primary" />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "activity" && <ActivityFeed />}

            {activeTab === "profile" && <ProfileSection />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation with smooth transitions */}
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="border-t border-border bg-card"
      >
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex flex-col items-center gap-1 py-2 px-6 rounded-lg transition-colors"
              >
                <Icon className={`h-6 w-6 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.nav>

      {/* Send Sheet */}
      <SendSheet
        isOpen={isSendSheetOpen}
        onClose={() => setIsSendSheetOpen(false)}
        onSendComplete={() => {
          // Refresh activity feed when implemented
        }}
      />
    </div>
  )
}
