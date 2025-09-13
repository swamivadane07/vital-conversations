import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Calendar, User, FileText } from 'lucide-react'
import { format } from 'date-fns'

interface MedicalHistory {
  id: string
  condition_name: string
  diagnosis_date: string | null
  status: string
  description: string | null
  doctor_name: string | null
  created_at: string
  updated_at: string
}

interface MedicalHistorySectionProps {
  medicalHistory: MedicalHistory[]
  loading: boolean
  onAdd: (data: Omit<MedicalHistory, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onUpdate: (id: string, updates: Partial<MedicalHistory>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function MedicalHistorySection({ medicalHistory, loading, onAdd, onUpdate, onDelete }: MedicalHistorySectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MedicalHistory | null>(null)
  const [formData, setFormData] = useState({
    condition_name: '',
    diagnosis_date: '',
    status: 'active',
    description: '',
    doctor_name: ''
  })

  const resetForm = () => {
    setFormData({
      condition_name: '',
      diagnosis_date: '',
      status: 'active',
      description: '',
      doctor_name: ''
    })
  }

  const handleAdd = async () => {
    await onAdd(formData)
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEdit = (item: MedicalHistory) => {
    setEditingItem(item)
    setFormData({
      condition_name: item.condition_name,
      diagnosis_date: item.diagnosis_date || '',
      status: item.status,
      description: item.description || '',
      doctor_name: item.doctor_name || ''
    })
  }

  const handleUpdate = async () => {
    if (!editingItem) return
    await onUpdate(editingItem.id, formData)
    resetForm()
    setEditingItem(null)
  }

  const handleDelete = async (id: string) => {
    await onDelete(id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'destructive'
      case 'resolved': return 'secondary'
      case 'chronic': return 'default'
      default: return 'secondary'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Medical History</h3>
          <p className="text-sm text-muted-foreground">Track your medical conditions and diagnoses</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Medical Condition</DialogTitle>
              <DialogDescription>
                Add a new medical condition to your history
              </DialogDescription>
            </DialogHeader>
            <MedicalHistoryForm
              formData={formData}
              setFormData={setFormData}
              onSave={handleAdd}
              title="Add Condition"
            />
          </DialogContent>
        </Dialog>
      </div>

      {medicalHistory.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Medical History</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your medical conditions and diagnoses
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Condition
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {medicalHistory.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.condition_name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Medical Condition</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this medical condition? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                {item.diagnosis_date && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Diagnosed: {format(new Date(item.diagnosis_date), 'MMM dd, yyyy')}
                  </div>
                )}
                {item.doctor_name && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    Dr. {item.doctor_name}
                  </div>
                )}
              </CardHeader>
              {item.description && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Medical Condition</DialogTitle>
              <DialogDescription>
                Update the medical condition information
              </DialogDescription>
            </DialogHeader>
            <MedicalHistoryForm
              formData={formData}
              setFormData={setFormData}
              onSave={handleUpdate}
              title="Update Condition"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface MedicalHistoryFormProps {
  formData: {
    condition_name: string
    diagnosis_date: string
    status: string
    description: string
    doctor_name: string
  }
  setFormData: (data: any) => void
  onSave: () => Promise<void>
  title: string
}

function MedicalHistoryForm({ formData, setFormData, onSave, title }: MedicalHistoryFormProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await onSave()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="condition_name">Condition Name *</Label>
        <Input
          id="condition_name"
          value={formData.condition_name}
          onChange={(e) => setFormData({ ...formData, condition_name: e.target.value })}
          placeholder="e.g., Hypertension, Diabetes, Asthma"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diagnosis_date">Diagnosis Date</Label>
          <Input
            id="diagnosis_date"
            type="date"
            value={formData.diagnosis_date}
            onChange={(e) => setFormData({ ...formData, diagnosis_date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="chronic">Chronic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="doctor_name">Doctor Name</Label>
        <Input
          id="doctor_name"
          value={formData.doctor_name}
          onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
          placeholder="Dr. Smith"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Additional details about the condition..."
          rows={3}
        />
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={loading || !formData.condition_name.trim()}
        className="w-full"
      >
        {loading ? 'Saving...' : title}
      </Button>
    </div>
  )
}