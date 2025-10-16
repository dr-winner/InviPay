"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Activity, User, Plus, Lock, LogOut, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SendSheet } from "@/components/send-sheet"
import { ActivityFeed } from "@/components/activity-feed"
import { ProfileSection } from "@/components/profile-section"
import { getCurrentUser, mockUsers, CURRENT_USER_ID } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// Generate web3-style avatar colors
function getWeb3AvatarStyle(username: string) {
  const colors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500', 
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-teal-500 to-blue-500',
    'from-yellow-500 to-orange-500'
  ]
  
  const hash = username.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  return colors[Math.abs(hash) % colors.length]
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"send" | "activity" | "profile">("send")
  const [isSendSheetOpen, setIsSendSheetOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const users = useAppStore((state) => state.users)
  const addUser = useAppStore((state) => state.addUser)
  const logout = useAppStore((state) => state.logout)
  const currentUser = useAppStore((state) => state.currentUser)
  const balance = useAppStore((state) => state.balance)
  const monthlyDeposits = useAppStore((state) => state.monthlyDeposits)
  const monthlyWithdrawals = useAppStore((state) => state.monthlyWithdrawals)
  const { toast } = useToast()

  // Format name from email properly (remove numbers and special chars)
  const formatNameFromEmail = (email: string) => {
    const emailName = email.split('@')[0]
      .replace(/[^a-zA-Z]/g, ' ')  // Remove all non-letters (numbers, special chars)
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
    
    return emailName || 'User'
  }

  // Enhanced currentUser with displayName
  const enhancedCurrentUser = currentUser ? {
    ...currentUser,
    displayName: formatNameFromEmail(currentUser.email)
  } : null

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const userSession = localStorage.getItem('inviPay_user')
      if (userSession) {
        const userData = JSON.parse(userSession)
        setIsAuthenticated(true)
        setIsLoading(false)
        
        // Show welcome message
        toast({
          title: "Welcome to InviPay!",
          description: `Hello ${userData.username}, you're all set to send money instantly.`,
        })
      } else {
        router.push('/')
      }
    }

    checkAuth()
  }, [router, toast])

  useEffect(() => {
    if (isAuthenticated && users.length === 0) {
      mockUsers.forEach((user) => {
        if (user.id !== CURRENT_USER_ID) {
          addUser(user)
        }
      })
    }
  }, [isAuthenticated, users.length, addUser])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // Redirect to landing if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const mockCurrentUser = getCurrentUser()

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
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-auto rounded-full flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`bg-gradient-to-br ${getWeb3AvatarStyle(enhancedCurrentUser?.username || 'user')} text-white font-bold shadow-lg`}>
                      {enhancedCurrentUser?.displayName?.split(' ')[0]?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground hidden sm:block">
                    {enhancedCurrentUser?.username || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{enhancedCurrentUser?.displayName || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {enhancedCurrentUser?.email ? `${enhancedCurrentUser.email.slice(0, 3)}***@${enhancedCurrentUser.email.split('@')[1]}` : ''}
                  </p>
                </div>
                <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    logout()
                    router.push('/')
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                      <Send className="h-5 w-5 mr-2" />
                      Send Money
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Quick Stats with staggered animation */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Balance Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-muted-foreground">Balance</p>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Lock className="h-3 w-3 text-primary" />
                      </motion.div>
                    </div>
                    <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
                  </motion.div>

                  {/* This Month Card - Partitioned */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-muted-foreground">This Month</p>
                    </div>
                    
                    {/* Deposits and Withdrawals Side by Side */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Deposits */}
                      <div className="flex flex-col items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-muted-foreground">Deposits</span>
                        </div>
                        <span className="text-lg font-bold text-green-500">${monthlyDeposits.toFixed(2)}</span>
                      </div>
                      
                      {/* Withdrawals */}
                      <div className="flex flex-col items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowDown className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-muted-foreground">Withdrawals</span>
                        </div>
                        <span className="text-lg font-bold text-red-500">${monthlyWithdrawals.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {activeTab === "activity" && <ActivityFeed />}

            {activeTab === "profile" && <ProfileSection />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation with smooth transitions - Sticky */}
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="sticky bottom-0 z-50 border-t border-border bg-card backdrop-blur-sm"
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
