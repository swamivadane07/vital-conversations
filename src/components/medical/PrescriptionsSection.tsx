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
import { Plus, Edit, Trash2, Calendar, User, Pill, Clock } from 'lucide-react'
import { format, isAfter, isBefore } from 'date-fns'

interface Prescription {
  id: string
  medication_name: string
  dosage: string
  frequency: string
  prescribed_by: string | null
  prescribed_date: string | null
  start_date: string | null
  end_date: string | null
  status: string
  instructions: string | null
  created_at: string
  updated_at: string
}

interface PrescriptionsSectionProps {
  prescriptions: Prescription[]
  loading: boolean
  onAdd: (data: Omit<Prescription, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onUpdate: (id: string, updates: Partial<Prescription>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function PrescriptionsSection({ prescriptions, loading, onAdd, onUpdate, onDelete }: PrescriptionsSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Prescription | null>(null)
  const [formData, setFormData] = useState({
    medication_name: '',
    dosage: '',
    frequency: '',
    prescribed_by: '',
    prescribed_date: '',
    start_date: '',
    end_date: '',
    status: 'active',
    instructions: ''
  })

  const resetForm = () => {
    setFormData({
      medication_name: '',
      dosage: '',
      frequency: '',
      prescribed_by: '',
      prescribed_date: '',
      start_date: '',
      end_date: '',
      status: 'active',
      instructions: ''
    })
  }

  const handleAdd = async () => {
    await onAdd(formData)
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEdit = (item: Prescription) => {
    setEditingItem(item)
    setFormData({
      medication_name: item.medication_name,
      dosage: item.dosage,
      frequency: item.frequency,
      prescribed_by: item.prescribed_by || '',
      prescribed_date: item.prescribed_date || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      status: item.status,
      instructions: item.instructions || ''
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
      case 'active': return 'default'
      case 'completed': return 'secondary'
      case 'discontinued': return 'destructive'
      default: return 'secondary'
    }
  }

  const isExpired = (endDate: string | null) => {
    if (!endDate) return false
    return isBefore(new Date(endDate), new Date())
  }

  const isStarted = (startDate: string | null) => {
    if (!startDate) return true
    return isAfter(new Date(), new Date(startDate)) || format(new Date(), 'yyyy-MM-dd') === startDate
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
          <h3 className="text-lg font-semibold">Prescriptions</h3>
          <p className="text-sm text-muted-foreground">Track your medications and dosages</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Prescription</DialogTitle>
              <DialogDescription>
                Add a new prescription to your medical records
              </DialogDescription>
            </DialogHeader>
            <PrescriptionForm
              formData={formData}
              setFormData={setFormData}
              onSave={handleAdd}
              title="Add Prescription"
            />
          </DialogContent>
        </Dialog>
      </div>

      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Prescriptions</h3>
            <p className="text-muted-foreground mb-4">
              Keep track of your medications and dosages
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Prescription
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((item) => {
            const expired = isExpired(item.end_date)
            const started = isStarted(item.start_date)
            
            return (
              <Card key={item.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.medication_name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                      {expired && item.status === 'active' && (
                        <Badge variant="outline" className="text-orange-600">
                          Expired
                        </Badge>
                      )}
                      {!started && item.status === 'active' && (
                        <Badge variant="outline" className="text-blue-600">
                          Not Started
                        </Badge>
                      )}
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
                            <AlertDialogTitle>Delete Prescription</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this prescription? This action cannot be undone.
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
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Pill className="h-4 w-4 mr-2" />
                      <span><strong>Dosage:</strong> {item.dosage}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span><strong>Frequency:</strong> {item.frequency}</span>
                    </div>
                  </div>

                  {item.prescribed_by && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-2" />
                      Prescribed by: Dr. {item.prescribed_by}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {item.prescribed_date && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Prescribed: {format(new Date(item.prescribed_date), 'MMM dd, yyyy')}
                      </div>
                    )}
                    {item.start_date && item.end_date && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Duration: {format(new Date(item.start_date), 'MMM dd')} - {format(new Date(item.end_date), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                {item.instructions && (
                  <CardContent className="pt-0">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm"><strong>Instructions:</strong> {item.instructions}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Prescription</DialogTitle>
              <DialogDescription>
                Update the prescription information
              </DialogDescription>
            </DialogHeader>
            <PrescriptionForm
              formData={formData}
              setFormData={setFormData}
              onSave={handleUpdate}
              title="Update Prescription"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface PrescriptionFormProps {
  formData: {
    medication_name: string
    dosage: string
    frequency: string
    prescribed_by: string
    prescribed_date: string
    start_date: string
    end_date: string
    status: string
    instructions: string
  }
  setFormData: (data: any) => void
  onSave: () => Promise<void>
  title: string
}

function PrescriptionForm({ formData, setFormData, onSave, title }: PrescriptionFormProps) {
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
    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
      <div className="space-y-2">
        <Label htmlFor="medication_name">Medication Name *</Label>
        <Input
          id="medication_name"
          value={formData.medication_name}
          onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
          placeholder="e.g., Aspirin, Metformin, Lisinopril"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage *</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            placeholder="e.g., 10mg, 500mg, 1 tablet"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency *</Label>
          <Input
            id="frequency"
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            placeholder="e.g., Once daily, Twice daily, As needed"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prescribed_by">Prescribed By</Label>
          <Input
            id="prescribed_by"
            value={formData.prescribed_by}
            onChange={(e) => setFormData({ ...formData, prescribed_by: e.target.value })}
            placeholder="Dr. Smith"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prescribed_date">Prescribed Date</Label>
          <Input
            id="prescribed_date"
            type="date"
            value={formData.prescribed_date}
            onChange={(e) => setFormData({ ...formData, prescribed_date: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>
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
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          placeholder="Take with food, avoid alcohol, etc..."
          rows={3}
        />
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={loading || !formData.medication_name.trim() || !formData.dosage.trim() || !formData.frequency.trim()}
        className="w-full"
      >
        {loading ? 'Saving...' : title}
      </Button>
    </div>
  )
}