import QuickActions from "@/components/QuickActions";

const QuickActionsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Quick Actions</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Access essential health services and emergency contacts quickly
          </p>
        </div>
        <QuickActions />
      </div>
    </div>
  );
};

export default QuickActionsPage;