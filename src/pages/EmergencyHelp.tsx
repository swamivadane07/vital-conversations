import { EmergencyInfo } from "@/components/sidebar/EmergencyInfo";

const EmergencyHelpPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-destructive">Emergency Help</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Immediate access to urgent medical contacts and guidance.
        </p>
        <div className="mt-6">
          <EmergencyInfo />
        </div>
      </div>
    </div>
  );
};

export default EmergencyHelpPage;