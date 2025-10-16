"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Mail, Shield, Zap, Users, CheckCircle, Star, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [userExists, setUserExists] = useState<boolean | null>(null)
  const [showUserCheck, setShowUserCheck] = useState(false)
  const [showAccountNotFound, setShowAccountNotFound] = useState(false)
  const router = useRouter()
  const login = useAppStore((state) => state.login)

  // Check if user exists in localStorage
  const checkUserExists = (email: string): boolean => {
    if (typeof window === 'undefined') return false
    
    // Check current session first
    const userSession = localStorage.getItem('inviPay_user')
    if (userSession) {
      const userData = JSON.parse(userSession)
      if (userData.email === email) return true
    }
    
    // Check all registered users
    const registeredUsers = localStorage.getItem('inviPay_registered_users')
    if (registeredUsers) {
      const users = JSON.parse(registeredUsers)
      return users.some((user: any) => user.email === email)
    }
    
    return false
  }

  const resetForm = () => {
    setUserExists(null)
    setShowUserCheck(false)
    setShowAccountNotFound(false)
    setIsLoading(false)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Check if user exists
    const exists = checkUserExists(email)
    setUserExists(exists)
    setShowUserCheck(true)
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false)
      
      // If user exists and they're trying to sign in, proceed
      if (exists && !showSignup) {
        login(email)
        setUserExists(true)
        setShowUserCheck(false)
        // Show success message briefly before redirecting
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
      // If user doesn't exist and they're trying to sign up, proceed
      else if (!exists && showSignup) {
        login(email)
        setUserExists(false)
        setShowUserCheck(false)
        // Show success message briefly before redirecting
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
      // If user doesn't exist but they're trying to sign in, show account not found prompt
      else if (!exists && !showSignup) {
        setShowUserCheck(false)
        setShowAccountNotFound(true)
      }
      // If user exists but they're trying to sign up, switch to signin and proceed
      else if (exists && showSignup) {
        setShowSignup(false)
        setShowUserCheck(false)
        setUserExists(true)
        // Show success message briefly before redirecting
        setTimeout(() => {
          login(email)
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }, 500)
      }
    }, 1500)
  }

  const features = [
    {
      icon: Zap,
      title: "Instant Payments",
      description: "Send money in seconds with zero gas fees"
    },
    {
      icon: Shield,
      title: "Secure by Design",
      description: "Powered by Starknet account abstraction"
    },
    {
      icon: Users,
      title: "Easy to Use",
      description: "Just an email address, no complex setup"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Freelancer",
      content: "Finally, crypto payments that just work. No more gas fees eating into my earnings!",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Small Business Owner",
      content: "My customers love how easy it is to pay. It's like Venmo but with crypto benefits.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Logo and Badge */}
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25"
              >
                <span className="text-primary-foreground font-bold text-2xl">I</span>
              </motion.div>
              <Badge variant="secondary" className="px-4 py-1">
                <Star className="w-3 h-3 mr-1" />
                Powered by Starknet
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Send Money
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Invisibly
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Experience the future of payments. Send crypto with just an email address. 
                No wallets, no gas fees, no complexity.
              </p>
            </div>

            {/* Email Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleEmailSubmit}
              className="max-w-md mx-auto space-y-4"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 text-lg"
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !email}
                className="w-full h-12 text-lg font-semibold"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    {showSignup ? "Create Account" : "Sign In"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground">
                {showSignup ? "Already have an account?" : "New to InviPay?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setShowSignup(!showSignup)
                    resetForm()
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {showSignup ? "Sign in" : "Create account"}
                </button>
              </p>
            </motion.form>

            {/* User Check Feedback */}
            <AnimatePresence>
              {showUserCheck && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-md mx-auto"
                >
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        {showSignup ? "Creating your account..." : "Signing you in..."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Exists/Doesn't Exist Feedback */}
            <AnimatePresence>
              {userExists !== null && !showUserCheck && !showAccountNotFound && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-md mx-auto"
                >
                  <div className={`p-4 rounded-lg border ${
                    userExists 
                      ? "bg-primary/10 border-primary/20 text-primary" 
                      : "bg-accent/10 border-accent/20 text-accent"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        userExists ? "bg-primary/20" : "bg-accent/20"
                      }`}>
                        <CheckCircle className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {userExists 
                            ? "Account found! Redirecting to dashboard..." 
                            : "New account created! Redirecting to dashboard..."
                          }
                        </p>
                        <p className="text-xs opacity-80 mt-1">
                          {userExists 
                            ? "Welcome back to InviPay" 
                            : "Your invisible wallet is being set up"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Account Not Found Prompt */}
            <AnimatePresence>
              {showAccountNotFound && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-md mx-auto"
                >
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle className="w-3 h-3 text-destructive" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-destructive">
                          Account not found
                        </p>
                        <p className="text-xs text-destructive/80 mt-1">
                          No account found with this email address. Please create an account to continue using InviPay.
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => {
                              setShowSignup(true)
                              setShowAccountNotFound(false)
                              setUserExists(null)
                              setShowUserCheck(false)
                            }}
                            className="text-xs"
                          >
                            Create Account
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowAccountNotFound(false)
                              setUserExists(null)
                              setShowUserCheck(false)
                              setEmail("")
                            }}
                            className="text-xs"
                          >
                            Try Different Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold">Why Choose InviPay?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The simplest way to send and receive crypto payments
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-8 text-center space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors"
                    >
                      <feature.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold">Loved by Users</h2>
            <p className="text-xl text-muted-foreground">
              See what people are saying about InviPay
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-lg italic">"{testimonial.content}"</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who are already sending money invisibly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => (document.querySelector('input[type="email"]') as HTMLInputElement)?.focus()}
                className="h-12 px-8 text-lg"
              >
                Start Sending Money
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>No setup required</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">I</span>
              </div>
              <span className="text-lg font-semibold">InviPay</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 InviPay. Powered by Starknet Account Abstraction.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
