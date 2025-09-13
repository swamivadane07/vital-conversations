import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Heart, 
  Pill, 
  History, 
  Upload, 
  Plus,
  Activity,
  UserCheck,
  AlertTriangle
} from 'lucide-react'
import { useMedicalRecords } from '@/hooks/useMedicalRecords'
import { useAuth } from '@/hooks/useAuth'
import { MedicalHistorySection } from '@/components/medical/MedicalHistorySection'
import { AllergiesSection } from '@/components/medical/AllergiesSection'
import { PrescriptionsSection } from '@/components/medical/PrescriptionsSection'
import { DocumentsSection } from '@/components/medical/DocumentsSection'
import { PatientProfileCard } from '@/components/medical/PatientProfileCard'

export default function MedicalRecords() {
  const { user } = useAuth()
  const {
    loading,
    medicalHistory,
    allergies,
    prescriptions,
    documents,
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
  } = useMedicalRecords()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">Please log in to view your medical records.</p>
        </div>
      </div>
    )
  }

  // Get active/critical items count for badges
  const activeConditions = medicalHistory.filter(h => h.status === 'active').length
  const severeAllergies = allergies.filter(a => a.severity === 'severe' || a.severity === 'life-threatening').length
  const activePrescriptions = prescriptions.filter(p => p.status === 'active').length

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Medical Records
        </h1>
        <p className="text-muted-foreground">
          Manage your complete medical history, prescriptions, and health documents
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <PatientProfileCard />
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Active Conditions</span>
              </div>
              <Badge variant={activeConditions > 0 ? "destructive" : "secondary"}>
                {activeConditions}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Critical Allergies</span>
              </div>
              <Badge variant={severeAllergies > 0 ? "destructive" : "secondary"}>
                {severeAllergies}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pill className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Active Prescriptions</span>
              </div>
              <Badge variant={activePrescriptions > 0 ? "default" : "secondary"}>
                {activePrescriptions}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>Medical History</span>
          </TabsTrigger>
          <TabsTrigger value="allergies" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>Allergies</span>
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="flex items-center space-x-2">
            <Pill className="h-4 w-4" />
            <span>Prescriptions</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <MedicalHistorySection
            medicalHistory={medicalHistory}
            loading={loading}
            onAdd={addMedicalHistory}
            onUpdate={updateMedicalHistory}
            onDelete={deleteMedicalHistory}
          />
        </TabsContent>

        <TabsContent value="allergies">
          <AllergiesSection
            allergies={allergies}
            loading={loading}
            onAdd={addAllergy}
            onUpdate={updateAllergy}
            onDelete={deleteAllergy}
          />
        </TabsContent>

        <TabsContent value="prescriptions">
          <PrescriptionsSection
            prescriptions={prescriptions}
            loading={loading}
            onAdd={addPrescription}
            onUpdate={updatePrescription}
            onDelete={deletePrescription}
          />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsSection
            documents={documents}
            loading={loading}
            onUpload={uploadDocument}
            onDelete={deleteDocument}
            onDownload={downloadDocument}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}