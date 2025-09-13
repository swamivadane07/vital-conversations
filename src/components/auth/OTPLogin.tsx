import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { Mail, Shield, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function OTPLogin() {
  const { signInWithOTP, verifyOTP } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      const { error } = await signInWithOTP(email.trim())
      if (!error) {
        setStep('otp')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode.trim() || otpCode.length !== 6) return

    setLoading(true)
    try {
      const { error } = await verifyOTP(email, otpCode.trim())
      if (!error) {
        navigate('/')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    try {
      await signInWithOTP(email)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'email') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Login with OTP</span>
          </CardTitle>
          <CardDescription>
            Enter your email to receive a verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
              {loading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Enter Verification Code</span>
        </CardTitle>
        <CardDescription>
          We sent a 6-digit code to {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otpCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                setOtpCode(value)
              }}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || otpCode.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify & Login'}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep('email')}
              className="p-0 h-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Change Email
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendOTP}
              disabled={loading}
              className="p-0 h-auto"
            >
              Resend Code
            </Button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          <p className="font-medium mb-1">Didn't receive the code?</p>
          <ul className="text-xs space-y-1">
            <li>• Check your spam/junk folder</li>
            <li>• Wait up to 2 minutes for delivery</li>
            <li>• Click "Resend Code" if needed</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}