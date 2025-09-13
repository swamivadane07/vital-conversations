import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

interface MedicalHistory {
  id: string
  user_id?: string
  condition_name: string
  diagnosis_date: string | null
  status: string
  description: string | null
  doctor_name: string | null
  created_at: string
  updated_at: string
}

interface Allergy {
  id: string
  user_id?: string
  allergen: string
  severity: string
  reaction: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

interface Prescription {
  id: string
  user_id?: string
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

interface MedicalDocument {
  id: string
  user_id?: string
  document_name: string
  document_type: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  uploaded_at: string
  notes: string | null
}

export function useMedicalRecords() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([])
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [documents, setDocuments] = useState<MedicalDocument[]>([])

  // Fetch all medical data
  const fetchMedicalData = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const [historyRes, allergiesRes, prescriptionsRes, documentsRes] = await Promise.all([
        supabase.from('medical_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('allergies').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('prescriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('medical_documents').select('*').eq('user_id', user.id).order('uploaded_at', { ascending: false })
      ])

      if (historyRes.error) throw historyRes.error
      if (allergiesRes.error) throw allergiesRes.error
      if (prescriptionsRes.error) throw prescriptionsRes.error
      if (documentsRes.error) throw documentsRes.error

      setMedicalHistory(historyRes.data || [])
      setAllergies(allergiesRes.data || [])
      setPrescriptions(prescriptionsRes.data || [])
      setDocuments(documentsRes.data || [])
    } catch (error) {
      console.error('Error fetching medical data:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch medical records'
      })
    } finally {
      setLoading(false)
    }
  }

  // Medical History operations
  const addMedicalHistory = async (data: Omit<MedicalHistory, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return
    
    try {
      const { data: newRecord, error } = await supabase
        .from('medical_history')
        .insert({ ...data, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      setMedicalHistory(prev => [newRecord, ...prev])
      toast({
        title: 'Success',
        description: 'Medical history added successfully'
      })
    } catch (error) {
      console.error('Error adding medical history:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add medical history'
      })
    }
  }

  const updateMedicalHistory = async (id: string, updates: Partial<MedicalHistory>) => {
    try {
      const { data: updatedRecord, error } = await supabase
        .from('medical_history')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setMedicalHistory(prev => prev.map(item => item.id === id ? updatedRecord : item))
      toast({
        title: 'Success',
        description: 'Medical history updated successfully'
      })
    } catch (error) {
      console.error('Error updating medical history:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update medical history'
      })
    }
  }

  const deleteMedicalHistory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medical_history')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMedicalHistory(prev => prev.filter(item => item.id !== id))
      toast({
        title: 'Success',
        description: 'Medical history deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting medical history:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete medical history'
      })
    }
  }

  // Allergy operations
  const addAllergy = async (data: Omit<Allergy, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return
    
    try {
      const { data: newRecord, error } = await supabase
        .from('allergies')
        .insert({ ...data, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      setAllergies(prev => [newRecord, ...prev])
      toast({
        title: 'Success',
        description: 'Allergy added successfully'
      })
    } catch (error) {
      console.error('Error adding allergy:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add allergy'
      })
    }
  }

  const updateAllergy = async (id: string, updates: Partial<Allergy>) => {
    try {
      const { data: updatedRecord, error } = await supabase
        .from('allergies')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setAllergies(prev => prev.map(item => item.id === id ? updatedRecord : item))
      toast({
        title: 'Success',
        description: 'Allergy updated successfully'
      })
    } catch (error) {
      console.error('Error updating allergy:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update allergy'
      })
    }
  }

  const deleteAllergy = async (id: string) => {
    try {
      const { error } = await supabase
        .from('allergies')
        .delete()
        .eq('id', id)

      if (error) throw error

      setAllergies(prev => prev.filter(item => item.id !== id))
      toast({
        title: 'Success',
        description: 'Allergy deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting allergy:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete allergy'
      })
    }
  }

  // Prescription operations
  const addPrescription = async (data: Omit<Prescription, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return
    
    try {
      const { data: newRecord, error } = await supabase
        .from('prescriptions')
        .insert({ ...data, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      setPrescriptions(prev => [newRecord, ...prev])
      toast({
        title: 'Success',
        description: 'Prescription added successfully'
      })
    } catch (error) {
      console.error('Error adding prescription:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add prescription'
      })
    }
  }

  const updatePrescription = async (id: string, updates: Partial<Prescription>) => {
    try {
      const { data: updatedRecord, error } = await supabase
        .from('prescriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setPrescriptions(prev => prev.map(item => item.id === id ? updatedRecord : item))
      toast({
        title: 'Success',
        description: 'Prescription updated successfully'
      })
    } catch (error) {
      console.error('Error updating prescription:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update prescription'
      })
    }
  }

  const deletePrescription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', id)

      if (error) throw error

      setPrescriptions(prev => prev.filter(item => item.id !== id))
      toast({
        title: 'Success',
        description: 'Prescription deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting prescription:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete prescription'
      })
    }
  }

  // Document upload
  const uploadDocument = async (file: File, documentType: MedicalDocument['document_type'], notes?: string) => {
    if (!user) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: newDocument, error: dbError } = await supabase
        .from('medical_documents')
        .insert({
          user_id: user.id,
          document_name: file.name,
          document_type: documentType,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type,
          notes
        })
        .select()
        .single()

      if (dbError) throw dbError

      setDocuments(prev => [newDocument, ...prev])
      toast({
        title: 'Success',
        description: 'Document uploaded successfully'
      })
    } catch (error) {
      console.error('Error uploading document:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to upload document'
      })
    }
  }

  const deleteDocument = async (id: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('medical-documents')
        .remove([filePath])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      setDocuments(prev => prev.filter(item => item.id !== id))
      toast({
        title: 'Success',
        description: 'Document deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting document:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete document'
      })
    }
  }

  const downloadDocument = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('medical-documents')
        .download(filePath)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading document:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to download document'
      })
    }
  }

  useEffect(() => {
    if (user) {
      fetchMedicalData()
    }
  }, [user])

  return {
    loading,
    medicalHistory,
    allergies,
    prescriptions,
    documents,
    fetchMedicalData,
    addMedicalHistory,
    updateMedicalHistory,
    deleteMedicalHistory,
    addAllergy,
    updateAllergy,
    deleteAllergy,
    addPrescription,
    updatePrescription,
    deletePrescription,
    uploadDocument,
    deleteDocument,
    downloadDocument
  }
}