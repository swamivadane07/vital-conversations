import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, MapPin, Calendar, Video, Clock, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DoctorBooking } from "@/components/doctors/DoctorBooking";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  price: number;
  availability: string[];
  bio: string;
}

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    experience: 12,
    rating: 4.9,
    reviews: 156,
    location: "New York, NY",
    image: "/placeholder.svg",
    price: 150,
    availability: ["Mon", "Wed", "Fri"],
    bio: "Expert in cardiovascular diseases with over 12 years of experience."
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Dermatologist",
    experience: 8,
    rating: 4.8,
    reviews: 89,
    location: "Los Angeles, CA",
    image: "/placeholder.svg",
    price: 120,
    availability: ["Tue", "Thu", "Sat"],
    bio: "Specialized in skin conditions and cosmetic dermatology."
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialization: "General Practitioner",
    experience: 6,
    rating: 4.7,
    reviews: 124,
    location: "Chicago, IL",
    image: "/placeholder.svg",
    price: 100,
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    bio: "Comprehensive primary care with focus on preventive medicine."
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialization: "Neurologist",
    experience: 15,
    rating: 4.9,
    reviews: 203,
    location: "Boston, MA",
    image: "/placeholder.svg",
    price: 180,
    availability: ["Wed", "Thu", "Fri"],
    bio: "Leading expert in neurological disorders and brain health."
  }
];

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");

  const specializations = ["all", "Cardiologist", "Dermatologist", "General Practitioner", "Neurologist"];

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = selectedSpecialization === "all" || doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="p-6 space-y-6 fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Find a Doctor</h1>
        <p className="text-muted-foreground">Connect with qualified healthcare professionals</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search doctors by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          {specializations.map(spec => (
            <option key={spec} value={spec}>
              {spec === "all" ? "All Specializations" : spec}
            </option>
          ))}
        </select>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="card-hover shadow-card bg-gradient-card">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-medical rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{doctor.name}</CardTitle>
                  <Badge variant="secondary" className="mb-2">
                    {doctor.specialization}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{doctor.rating}</span>
                    <span>({doctor.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{doctor.experience} years experience</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{doctor.location}</span>
              </div>

              <p className="text-sm text-muted-foreground">{doctor.bio}</p>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <span className="text-lg font-semibold text-primary">${doctor.price}</span>
                  <span className="text-sm text-muted-foreground">/consultation</span>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="btn-hover">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Book Consultation with {doctor.name}</DialogTitle>
                    </DialogHeader>
                    <DoctorBooking doctor={doctor} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No doctors found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Doctors;