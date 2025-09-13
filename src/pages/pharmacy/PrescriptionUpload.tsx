import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle, XCircle, Clock, Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Prescription {
  id: string;
  fileName: string;
  status: "pending" | "verified" | "rejected";
  uploadDate: string;
  notes?: string;
}

const PrescriptionUpload = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: "1",
      fileName: "prescription_2024_01.pdf",
      status: "verified",
      uploadDate: "2024-01-15",
      notes: "Valid prescription for diabetes medication"
    },
    {
      id: "2", 
      fileName: "prescription_2024_02.jpg",
      status: "pending",
      uploadDate: "2024-01-20"
    }
  ]);
  
  const [notes, setNotes] = useState("");

  const handleFileUpload = () => {
    toast({
      title: "File Upload",
      description: "This would open file picker in a real implementation",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "default",
      verified: "secondary", 
      rejected: "destructive"
    };
    return <Badge variant={variants[status] || "default"}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Prescription Upload</h1>
        <p className="text-muted-foreground">
          Upload your prescription images or PDFs for verification
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Prescription
          </CardTitle>
          <CardDescription>
            Supported formats: JPG, PNG, PDF (Max size: 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors">
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Button onClick={handleFileUpload} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Choose File
                </Button>
                <Button onClick={handleFileUpload} variant="outline" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Take Photo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Drag and drop files here, or click to select
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Notes (Optional)</label>
            <Textarea
              placeholder="Add any special instructions or notes for the pharmacist..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button className="w-full">
            Upload Prescription
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Prescriptions</CardTitle>
          <CardDescription>Track the status of your uploaded prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{prescription.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded: {prescription.uploadDate}
                    </p>
                    {prescription.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {prescription.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(prescription.status)}
                  {getStatusBadge(prescription.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionUpload;