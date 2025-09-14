import { SymptomChecker } from "@/components/sidebar/SymptomChecker";

const SymptomCheckerPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Symptom Checker</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Analyze your symptoms to get helpful guidance.
        </p>
        <div className="mt-6">
          <SymptomChecker />
        </div>
      </div>
    </div>
  );
};

export default SymptomCheckerPage;