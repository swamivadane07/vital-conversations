import { useState, useEffect } from "react";
import { AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function OfflineNotice() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineAlert) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
              You're offline. Some features may be limited.
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOfflineAlert(false)}
            className="h-6 px-2 text-orange-800 hover:bg-orange-100 dark:text-orange-200 dark:hover:bg-orange-900"
          >
            ×
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3 text-green-500" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-orange-500" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}