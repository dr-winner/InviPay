"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Key,
  Mail,
  Link2,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  Bell,
  CreditCard,
  Lock,
  Globe,
  HelpCircle,
  UserPlus,
  Settings,
  Eye,
  Trash2,
  Star,
  Github,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { getCurrentUser } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import { AddContactDialog } from "@/components/add-contact-dialog"

// Generate web3-style avatar colors (same as dashboard)
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

export function ProfileSection() {
  const storeUser = useAppStore((state) => state.currentUser)
  const mockUser = getCurrentUser()
  
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

  // Use store user if available, otherwise fall back to mock user
  const currentUser = storeUser ? {
    ...mockUser,
    username: storeUser.username,
    email: storeUser.email,
    displayName: formatNameFromEmail(storeUser.email)
  } : mockUser
  
  const [showKeyDialog, setShowKeyDialog] = useState(false)
  const [showSocialDialog, setShowSocialDialog] = useState(false)
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false)
  const [showPaymentMethodsDialog, setShowPaymentMethodsDialog] = useState(false)
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false)
  const [showAddContactDialog, setShowAddContactDialog] = useState(false)
  const [copied, setCopied] = useState(false)

  const userSettings = useAppStore((state) => state.userSettings)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const paymentMethods = useAppStore((state) => state.paymentMethods)
  const removePaymentMethod = useAppStore((state) => state.removePaymentMethod)
  const setDefaultPaymentMethod = useAppStore((state) => state.setDefaultPaymentMethod)
  const socialConnections = useAppStore((state) => state.socialConnections)
  const updateSocialConnection = useAppStore((state) => state.updateSocialConnection)

  const handleCopyKey = () => {
    navigator.clipboard.writeText("mock-invisible-key-" + currentUser.invisibleKeyId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConnectSocial = (provider: "google" | "github") => {
    // Simulate OAuth connection
    updateSocialConnection(provider, true, `${currentUser.username}@${provider}.com`)
    setTimeout(() => setShowSocialDialog(false), 500)
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center space-y-4 py-8"
      >
        <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarFallback className={`text-2xl bg-gradient-to-br ${getWeb3AvatarStyle(currentUser?.username || 'user')} text-white font-bold shadow-lg`}>
              {currentUser.displayName?.split(' ')[0]?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h2 className="text-2xl font-bold">{currentUser.displayName}</h2>
          <p className="text-muted-foreground">@{currentUser.username}</p>
          <p className="text-sm text-muted-foreground mt-1">{currentUser.email}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => setShowAddContactDialog(true)} variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </h3>

        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowNotificationsDialog(true)}
          className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Notification Preferences</p>
              <p className="text-sm text-muted-foreground">Manage alerts and notifications</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-bold flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Methods
        </h3>

        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPaymentMethodsDialog(true)}
          className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Manage Payment Methods</p>
              <p className="text-sm text-muted-foreground">{paymentMethods.length} methods linked</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </motion.button>
      </motion.div>

      {/* Security & Wallet Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Security & Wallet Access
        </h3>
        <p className="text-sm text-muted-foreground">
          Your wallet is self-custodial. You have full control over your funds.
        </p>

        <div className="space-y-2">
          {/* Export Wallet Key */}
          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowKeyDialog(true)}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Export Wallet Key</p>
                <p className="text-sm text-muted-foreground">Backup your invisible key</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </motion.button>
        </div>
      </motion.div>

      {/* Social Recovery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-bold">Social Recovery</h3>
        <p className="text-sm text-muted-foreground">
          Connect your email or social accounts for easy account recovery.
        </p>

        <div className="space-y-2">
          {/* Connect Email */}
          <motion.div
            whileHover={{ scale: 1.02, x: 4 }}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Connect Email</p>
                <p className="text-sm text-muted-foreground">Recover via email verification</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary font-medium">Connected</span>
              <Check className="h-4 w-4 text-primary" />
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSocialDialog(true)}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Link2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">Connect Social</p>
                <p className="text-sm text-muted-foreground">
                  {socialConnections.filter((sc) => sc.connected && sc.provider !== "email").length > 0
                    ? `${socialConnections.filter((sc) => sc.connected && sc.provider !== "email").length} connected`
                    : "Link Google or GitHub"}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Privacy & Security
        </h3>

        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPrivacyDialog(true)}
          className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Privacy Settings</p>
              <p className="text-sm text-muted-foreground">Control who can see your activity</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Preferences
        </h3>

        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPreferencesDialog(true)}
          className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">App Preferences</p>
              <p className="text-sm text-muted-foreground">Language, currency, and theme</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </motion.button>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-bold">Account Information</h3>
        <div className="p-4 rounded-lg bg-card border border-border space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Member Since</span>
            <span className="text-sm font-medium">{currentUser.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Account Type</span>
            <span className="text-sm font-medium">Self-Custodial</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Gas Fees</span>
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-sm font-medium text-primary"
            >
              Sponsored
            </motion.span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-bold flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Help & Support
        </h3>

        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Help Center</p>
              <p className="text-sm text-muted-foreground">FAQs and support articles</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </motion.button>
      </motion.div>

      {/* Dialogs */}
      {/* Export Key Dialog */}
      <AnimatePresence>
        {showKeyDialog && (
          <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Export Wallet Key
                </DialogTitle>
                <DialogDescription>
                  Your invisible key gives full access to your wallet. Never share it with anyone.
                </DialogDescription>
              </DialogHeader>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">Security Warning</p>
                  <ul className="text-xs text-destructive/80 mt-2 space-y-1 list-disc list-inside">
                    <li>Anyone with this key can access your funds</li>
                    <li>Store it in a secure location</li>
                    <li>Never share it via email or messaging</li>
                  </ul>
                </div>

                <div className="relative">
                  <div className="p-4 rounded-lg bg-secondary border border-border font-mono text-sm break-all">
                    {currentUser.invisibleKeyId}-mock-key-0x1234567890abcdef
                  </div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button onClick={handleCopyKey} size="sm" variant="ghost" className="absolute top-2 right-2">
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                          >
                            <Check className="h-4 w-4 text-primary" />
                          </motion.div>
                        ) : (
                          <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Copy className="h-4 w-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </div>

                <Button onClick={() => setShowKeyDialog(false)} className="w-full">
                  I've Saved My Key
                </Button>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <Dialog open={showSocialDialog} onOpenChange={setShowSocialDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Social Accounts</DialogTitle>
            <DialogDescription>Link your social accounts for easy recovery</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {socialConnections
              .filter((sc) => sc.provider !== "email")
              .map((connection) => (
                <motion.div
                  key={connection.provider}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {connection.provider === "google" ? (
                        <Mail className="h-5 w-5 text-primary" />
                      ) : (
                        <Github className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold capitalize">{connection.provider}</p>
                      {connection.connected && <p className="text-xs text-muted-foreground">{connection.email}</p>}
                    </div>
                  </div>
                  {connection.connected ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-primary font-medium">Connected</span>
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => handleConnectSocial(connection.provider as "google" | "github")}>
                      Connect
                    </Button>
                  )}
                </motion.div>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Preferences</DialogTitle>
            <DialogDescription>Choose what notifications you want to receive</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {Object.entries(userSettings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                  <p className="text-xs text-muted-foreground">
                    {key === "push" && "Receive push notifications on your device"}
                    {key === "email" && "Get email updates about your account"}
                    {key === "transactionAlerts" && "Alerts for incoming and outgoing payments"}
                    {key === "securityAlerts" && "Important security and account updates"}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) =>
                    updateSettings({ notifications: { ...userSettings.notifications, [key]: checked } })
                  }
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentMethodsDialog} onOpenChange={setShowPaymentMethodsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Methods</DialogTitle>
            <DialogDescription>Manage your linked payment methods</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <motion.div
                key={method.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 rounded-lg bg-card border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{method.name}</p>
                      {method.isDefault && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">•••• {method.last4}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button size="sm" variant="ghost" onClick={() => setDefaultPaymentMethod(method.id)}>
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removePaymentMethod(method.id)}
                    disabled={method.isDefault}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Privacy Settings</DialogTitle>
            <DialogDescription>Control your privacy and visibility</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {Object.entries(userSettings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                  <p className="text-xs text-muted-foreground">
                    {key === "showProfile" && "Allow others to view your profile"}
                    {key === "showActivity" && "Make your transaction history visible"}
                    {key === "allowSearchByUsername" && "Let others find you by username"}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) =>
                    updateSettings({ privacy: { ...userSettings.privacy, [key]: checked } })
                  }
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPreferencesDialog} onOpenChange={setShowPreferencesDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>App Preferences</DialogTitle>
            <DialogDescription>Customize your InviPay experience</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Language</label>
              <select
                value={userSettings.preferences.language}
                onChange={(e) =>
                  updateSettings({ preferences: { ...userSettings.preferences, language: e.target.value } })
                }
                className="w-full mt-1 p-2 rounded-lg bg-secondary border border-border"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Currency</label>
              <select
                value={userSettings.preferences.currency}
                onChange={(e) =>
                  updateSettings({ preferences: { ...userSettings.preferences, currency: e.target.value } })
                }
                className="w-full mt-1 p-2 rounded-lg bg-secondary border border-border"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Theme</label>
              <select
                value={userSettings.preferences.theme}
                onChange={(e) =>
                  updateSettings({
                    preferences: { ...userSettings.preferences, theme: e.target.value as "dark" | "light" | "system" },
                  })
                }
                className="w-full mt-1 p-2 rounded-lg bg-secondary border border-border"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddContactDialog isOpen={showAddContactDialog} onClose={() => setShowAddContactDialog(false)} />
    </div>
  )
}
