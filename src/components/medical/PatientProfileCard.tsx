import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { User, Edit, Phone, Heart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Profile {
  first_name: string | null
  last_name: string | null
  date_of_birth: string | null
  blood_type: string | null
  height_cm: number | null
  weight_kg: number | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  medical_notes: string | null
  phone: string | null
}

export function PatientProfileCard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Profile>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    blood_type: '',
    height_cm: null,
    weight_kg: null,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_notes: '',
    phone: ''
  })

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setProfile(data)
        setFormData(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const updateProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...formData
        })
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      setIsEditing(false)
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Profile, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  const calculateBMI = (height: number | null, weight: number | null) => {
    if (!height || !weight) return null
    const heightInMeters = height / 100
    return (weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Patient Profile</span>
          </CardTitle>
          <CardDescription>Complete your medical profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Create Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Medical Profile</DialogTitle>
                <DialogDescription>
                  Update your personal and medical information
                </DialogDescription>
              </DialogHeader>
              <ProfileForm
                formData={formData}
                onInputChange={handleInputChange}
                onSave={updateProfile}
                loading={loading}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    )
  }

  const age = calculateAge(profile.date_of_birth)
  const bmi = calculateBMI(profile.height_cm, profile.weight_kg)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Patient Profile</span>
          </div>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Medical Profile</DialogTitle>
                <DialogDescription>
                  Update your personal and medical information
                </DialogDescription>
              </DialogHeader>
              <ProfileForm
                formData={formData}
                onInputChange={handleInputChange}
                onSave={updateProfile}
                loading={loading}
              />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">
            {profile.first_name} {profile.last_name}
          </p>
          <p className="text-sm text-muted-foreground">
            {age ? `${age} years old` : 'Age not specified'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Label className="text-xs text-muted-foreground">Blood Type</Label>
            <p className="font-medium">
              {profile.blood_type ? (
                <Badge variant="outline">{profile.blood_type}</Badge>
              ) : (
                'Not specified'
              )}
            </p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">BMI</Label>
            <p className="font-medium">
              {bmi ? `${bmi} kg/m²` : 'Not calculated'}
            </p>
          </div>
        </div>

        {profile.emergency_contact_name && (
          <div className="pt-2 border-t">
            <Label className="text-xs text-muted-foreground flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>Emergency Contact</span>
            </Label>
            <p className="font-medium text-sm">{profile.emergency_contact_name}</p>
            <p className="text-xs text-muted-foreground">{profile.emergency_contact_phone}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ProfileFormProps {
  formData: Profile
  onInputChange: (field: keyof Profile, value: string | number | null) => void
  onSave: () => void
  loading: boolean
}

function ProfileForm({ formData, onInputChange, onSave, loading }: ProfileFormProps) {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={formData.first_name || ''}
            onChange={(e) => onInputChange('first_name', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={formData.last_name || ''}
            onChange={(e) => onInputChange('last_name', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth || ''}
            onChange={(e) => onInputChange('date_of_birth', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => onInputChange('phone', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="blood_type">Blood Type</Label>
          <Select
            value={formData.blood_type || ''}
            onValueChange={(value) => onInputChange('blood_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              {bloodTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="height_cm">Height (cm)</Label>
          <Input
            id="height_cm"
            type="number"
            value={formData.height_cm || ''}
            onChange={(e) => onInputChange('height_cm', e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
        <div>
          <Label htmlFor="weight_kg">Weight (kg)</Label>
          <Input
            id="weight_kg"
            type="number"
            step="0.1"
            value={formData.weight_kg || ''}
            onChange={(e) => onInputChange('weight_kg', e.target.value ? parseFloat(e.target.value) : null)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
          <Input
            id="emergency_contact_name"
            value={formData.emergency_contact_name || ''}
            onChange={(e) => onInputChange('emergency_contact_name', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
          <Input
            id="emergency_contact_phone"
            value={formData.emergency_contact_phone || ''}
            onChange={(e) => onInputChange('emergency_contact_phone', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="medical_notes">Medical Notes</Label>
        <Textarea
          id="medical_notes"
          placeholder="Any additional medical information, conditions, or notes..."
          value={formData.medical_notes || ''}
          onChange={(e) => onInputChange('medical_notes', e.target.value)}
          rows={3}
        />
      </div>

      <Button onClick={onSave} disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save Profile'}
      </Button>
    </div>
  )
}