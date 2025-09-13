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
import { Plus, Edit, Trash2, AlertTriangle, Heart } from 'lucide-react'

interface Allergy {
  id: string
  allergen: string
  severity: string
  reaction: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

interface AllergiesSectionProps {
  allergies: Allergy[]
  loading: boolean
  onAdd: (data: Omit<Allergy, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onUpdate: (id: string, updates: Partial<Allergy>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function AllergiesSection({ allergies, loading, onAdd, onUpdate, onDelete }: AllergiesSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Allergy | null>(null)
  const [formData, setFormData] = useState({
    allergen: '',
    severity: 'mild',
    reaction: '',
    notes: ''
  })

  const resetForm = () => {
    setFormData({
      allergen: '',
      severity: 'mild',
      reaction: '',
      notes: ''
    })
  }

  const handleAdd = async () => {
    await onAdd(formData)
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEdit = (item: Allergy) => {
    setEditingItem(item)
    setFormData({
      allergen: item.allergen,
      severity: item.severity,
      reaction: item.reaction || '',
      notes: item.notes || ''
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'secondary'
      case 'moderate': return 'default'
      case 'severe': return 'destructive'
      case 'life-threatening': return 'destructive'
      default: return 'secondary'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'severe':
      case 'life-threatening':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
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
          <h3 className="text-lg font-semibold">Allergies</h3>
          <p className="text-sm text-muted-foreground">Manage your known allergies and reactions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Allergy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Allergy</DialogTitle>
              <DialogDescription>
                Add a new allergy to your medical records
              </DialogDescription>
            </DialogHeader>
            <AllergyForm
              formData={formData}
              setFormData={setFormData}
              onSave={handleAdd}
              title="Add Allergy"
            />
          </DialogContent>
        </Dialog>
      </div>

      {allergies.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Allergies Recorded</h3>
            <p className="text-muted-foreground mb-4">
              Keep track of your allergies for better healthcare
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Allergy
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {allergies.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{item.allergen}</span>
                    {getSeverityIcon(item.severity)}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getSeverityColor(item.severity)}>
                      {item.severity}
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
                          <AlertDialogTitle>Delete Allergy</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this allergy? This action cannot be undone.
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
                {item.reaction && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Reaction:</strong> {item.reaction}
                  </p>
                )}
              </CardHeader>
              {item.notes && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{item.notes}</p>
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
              <DialogTitle>Edit Allergy</DialogTitle>
              <DialogDescription>
                Update the allergy information
              </DialogDescription>
            </DialogHeader>
            <AllergyForm
              formData={formData}
              setFormData={setFormData}
              onSave={handleUpdate}
              title="Update Allergy"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface AllergyFormProps {
  formData: {
    allergen: string
    severity: string
    reaction: string
    notes: string
  }
  setFormData: (data: any) => void
  onSave: () => Promise<void>
  title: string
}

function AllergyForm({ formData, setFormData, onSave, title }: AllergyFormProps) {
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
        <Label htmlFor="allergen">Allergen *</Label>
        <Input
          id="allergen"
          value={formData.allergen}
          onChange={(e) => setFormData({ ...formData, allergen: e.target.value })}
          placeholder="e.g., Peanuts, Shellfish, Penicillin"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="severity">Severity</Label>
        <Select
          value={formData.severity}
          onValueChange={(value) => setFormData({ ...formData, severity: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mild">Mild</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="severe">Severe</SelectItem>
            <SelectItem value="life-threatening">Life-threatening</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reaction">Typical Reaction</Label>
        <Input
          id="reaction"
          value={formData.reaction}
          onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
          placeholder="e.g., Hives, difficulty breathing, swelling"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional information about this allergy..."
          rows={3}
        />
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={loading || !formData.allergen.trim()}
        className="w-full"
      >
        {loading ? 'Saving...' : title}
      </Button>
    </div>
  )
}