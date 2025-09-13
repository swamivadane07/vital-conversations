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
import { Plus, Upload, Download, Trash2, FileText, File, Image, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface MedicalDocument {
  id: string
  document_name: string
  document_type: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  uploaded_at: string
  notes: string | null
}

interface DocumentsSectionProps {
  documents: MedicalDocument[]
  loading: boolean
  onUpload: (file: File, documentType: MedicalDocument['document_type'], notes?: string) => Promise<void>
  onDelete: (id: string, filePath: string) => Promise<void>
  onDownload: (filePath: string, fileName: string) => Promise<void>
}

export function DocumentsSection({ documents, loading, onUpload, onDelete, onDownload }: DocumentsSectionProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('other')
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!selectedFile) return
    
    setUploading(true)
    try {
      await onUpload(selectedFile, documentType as MedicalDocument['document_type'], notes)
      setSelectedFile(null)
      setNotes('')
      setDocumentType('other')
      setIsUploadDialogOpen(false)
    } finally {
      setUploading(false)
    }
  }

  const getDocumentIcon = (mimeType: string | null) => {
    if (!mimeType) return <File className="h-5 w-5" />
    if (mimeType.startsWith('image/')) return <Image className="h-5 w-5" />
    return <FileText className="h-5 w-5" />
  }

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'lab_result': return 'default'
      case 'prescription': return 'secondary'
      case 'medical_report': return 'outline'
      case 'imaging': return 'destructive'
      case 'insurance': return 'default'
      default: return 'secondary'
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
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
          <h3 className="text-lg font-semibold">Medical Documents</h3>
          <p className="text-sm text-muted-foreground">Upload and manage your medical documents</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Medical Document</DialogTitle>
              <DialogDescription>
                Upload a new medical document to your records
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document_type">Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab_result">Lab Result</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="medical_report">Medical Report</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes about this document..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleUpload} 
                disabled={uploading || !selectedFile}
                className="w-full"
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Documents</h3>
            <p className="text-muted-foreground mb-4">
              Upload your medical documents for easy access
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload First Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getDocumentIcon(doc.mime_type)}
                    <div>
                      <CardTitle className="text-base">{doc.document_name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getDocumentTypeColor(doc.document_type)}>
                          {doc.document_type.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(doc.file_size)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDownload(doc.file_path, doc.document_name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Document</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this document? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(doc.id, doc.file_path)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Uploaded: {format(new Date(doc.uploaded_at), 'MMM dd, yyyy')}
                </div>
              </CardHeader>
              {doc.notes && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{doc.notes}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}