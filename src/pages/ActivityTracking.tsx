import { ActivityTracker } from "@/components/activity/ActivityTracker";
import { ActivityHistory } from "@/components/activity/ActivityHistory";

const ActivityTracking = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Activity Tracking</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Monitor your physical activities and track your fitness progress.
        </p>
        
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ActivityTracker />
          <ActivityHistory />
        </div>
      </div>
    </div>
  );
};

export default ActivityTracking;