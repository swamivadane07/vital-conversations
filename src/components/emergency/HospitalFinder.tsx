import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Phone, Clock, Star, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: number;
  rating: number;
  type: string;
  emergencyServices: boolean;
  coordinates: [number, number];
}

interface HospitalFinderProps {
  onLocationEnabled?: (location: { lat: number; lng: number }) => void;
}

export function HospitalFinder({ onLocationEnabled }: HospitalFinderProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [mapboxToken, setMapboxToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);

  // Mock hospital data for demonstration
  const mockHospitals: Hospital[] = [
    {
      id: "1",
      name: "City General Hospital",
      address: "123 Main St, Downtown",
      phone: "(555) 123-4567",
      distance: 0.8,
      rating: 4.5,
      type: "General Hospital",
      emergencyServices: true,
      coordinates: [-74.006, 40.7128]
    },
    {
      id: "2", 
      name: "Emergency Medical Center",
      address: "456 Oak Ave, Midtown",
      phone: "(555) 987-6543",
      distance: 1.2,
      rating: 4.2,
      type: "Emergency Center",
      emergencyServices: true,
      coordinates: [-74.005, 40.7120]
    },
    {
      id: "3",
      name: "Metro Health Clinic",
      address: "789 Pine St, Uptown", 
      phone: "(555) 456-7890",
      distance: 2.1,
      rating: 4.0,
      type: "Urgent Care",
      emergencyServices: false,
      coordinates: [-74.004, 40.7115]
    }
  ];

  const enableLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      toast.error("Geolocation not supported");
      return;
    }

    setLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setLocation(userLocation);
        onLocationEnabled?.(userLocation);
        findNearbyHospitals(userLocation);
        toast.success("Location enabled successfully");
        setLoading(false);
      },
      (error) => {
        let errorMessage = "Failed to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        
        setLocationError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const findNearbyHospitals = async (userLocation: { lat: number; lng: number }) => {
    // In a real implementation, this would call a hospitals API
    // For now, we'll use mock data with calculated distances
    const hospitalsWithDistance = mockHospitals.map(hospital => ({
      ...hospital,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        hospital.coordinates[1],
        hospital.coordinates[0]
      )
    })).sort((a, b) => a.distance - b.distance);

    setHospitals(hospitalsWithDistance);
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const openDirections = (hospital: Hospital) => {
    if (location) {
      const url = `https://www.google.com/maps/dir/${location.lat},${location.lng}/${hospital.coordinates[1]},${hospital.coordinates[0]}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(hospital.address)}`;
      window.open(url, '_blank');
    }
  };

  const callHospital = (phone: string) => {
    window.open(`tel:${phone.replace(/[^0-9]/g, '')}`, '_self');
  };

  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-accent-foreground">
          <MapPin className="w-5 h-5" />
          Find Nearest Hospital
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Enable */}
        {!location && (
          <div className="space-y-4">
            <p className="text-sm text-accent-foreground/80 leading-relaxed">
              Enable location services for fastest emergency response
            </p>
            
            {locationError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {locationError}
                </p>
              </div>
            )}

            <Button 
              onClick={enableLocation}
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-10"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin mr-2" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Enable Location
                </>
              )}
            </Button>
          </div>
        )}

        {/* Location Enabled */}
        {location && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-success">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse flex-shrink-0" />
              <span>Location enabled - Showing nearby hospitals</span>
            </div>

            <Button 
              onClick={() => findNearbyHospitals(location)}
              variant="outline"
              size="sm"
              className="w-full h-9"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Refresh Results
            </Button>
          </div>
        )}

        {/* Hospital Results */}
        {hospitals.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-accent-foreground">
              Nearby Hospitals ({hospitals.length} found)
            </h4>
            
            <div className="space-y-3">
              {hospitals.slice(0, 3).map((hospital) => (
                <Card key={hospital.id} className="border-accent/10 bg-background/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-sm text-foreground mb-2 truncate">
                          {hospital.name}
                        </h5>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant={hospital.emergencyServices ? "destructive" : "secondary"} className="text-xs">
                            {hospital.emergencyServices ? "Emergency" : hospital.type}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">{hospital.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{hospital.address}</p>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <Badge variant="outline" className="text-xs font-medium">
                          {hospital.distance.toFixed(1)} mi
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => openDirections(hospital)}
                        className="flex-1 h-8 text-xs font-medium"
                      >
                        <Navigation className="w-3 h-3 mr-2" />
                        Directions
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => callHospital(hospital.phone)}
                        className="h-8 px-3"
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Note */}
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive text-center font-medium leading-relaxed">
            ⚡ For life-threatening emergencies, call 911 immediately
          </p>
        </div>
      </CardContent>
    </Card>
  );
}