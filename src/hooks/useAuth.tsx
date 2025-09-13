import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  signUp: (email: string, password: string, userData?: { firstName?: string; lastName?: string }) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithOTP: (email: string) => Promise<{ error: any }>
  verifyOTP: (email: string, token: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData?: { firstName?: string; lastName?: string }) => {
    const redirectUrl = `${window.location.origin}/`
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: userData?.firstName,
          last_name: userData?.lastName
        }
      }
    })

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message
      })
    } else {
      toast({
        title: "Success!",
        description: "Please check your email to verify your account."
      })
    }

    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message
      })
    }

    return { error }
  }

  const signInWithOTP = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // Only allow existing users
      }
    })

    if (error) {
      toast({
        variant: "destructive",
        title: "OTP request failed",
        description: error.message
      })
    } else {
      toast({
        title: "OTP Sent!",
        description: "Check your email for the verification code."
      })
    }

    return { error }
  }

  const verifyOTP = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    })

    if (error) {
      toast({
        variant: "destructive",
        title: "OTP verification failed",
        description: error.message
      })
    } else {
      toast({
        title: "Login successful!",
        description: "Welcome back!"
      })
    }

    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message
      })
    }
  }

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/reset-password`
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    })

    if (error) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message
      })
    } else {
      toast({
        title: "Reset email sent",
        description: "Check your email for password reset instructions."
      })
    }

    return { error }
  }

  const value = {
    user,
    session,
    signUp,
    signIn,
    signInWithOTP,
    verifyOTP,
    signOut,
    resetPassword,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}