import { AdvancedSearch as AdvancedSearchComponent } from "@/components/advanced/AdvancedSearch";

const AdvancedSearch = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Advanced Search</h1>
            <p className="text-muted-foreground">Search across doctors, lab tests, articles, and appointments with powerful filters</p>
          </div>
        </div>
        
        <div className="fade-in">
          <AdvancedSearchComponent />
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;