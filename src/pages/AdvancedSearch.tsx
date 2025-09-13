import { AdvancedSearch as AdvancedSearchComponent } from "@/components/advanced/AdvancedSearch";

const AdvancedSearch = () => {
  return (
    <div className="p-6 space-y-6 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Advanced Search</h1>
        <p className="text-muted-foreground">Search across doctors, lab tests, articles, and appointments with powerful filters</p>
      </div>
      
      <AdvancedSearchComponent />
    </div>
  );
};

export default AdvancedSearch;