import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Clock, MapPin, Plus, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LabTestCart } from "@/components/labtests/LabTestCart";
import { AdvancedSearch } from "@/components/advanced/AdvancedSearch";
import { SmartSymptomPredictor } from "@/components/advanced/SmartSymptomPredictor";
import { VoiceSymptomInput } from "@/components/advanced/VoiceSymptomInput";

interface LabTest {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  preparation: string;
  sampleType: string;
  reportTime: string;
}

const mockLabTests: LabTest[] = [
  {
    id: "1",
    name: "Complete Blood Count (CBC)",
    category: "Blood Test",
    description: "Comprehensive blood analysis including RBC, WBC, platelets, and hemoglobin levels.",
    price: 45,
    duration: "15 minutes",
    preparation: "No fasting required",
    sampleType: "Blood",
    reportTime: "Same day"
  },
  {
    id: "2",
    name: "Lipid Profile",
    category: "Blood Test",
    description: "Cholesterol and triglyceride levels to assess cardiovascular health.",
    price: 60,
    duration: "10 minutes",
    preparation: "12-hour fasting required",
    sampleType: "Blood",
    reportTime: "1-2 days"
  },
  {
    id: "3",
    name: "Thyroid Function Test",
    category: "Hormone Test",
    description: "TSH, T3, and T4 levels to evaluate thyroid gland function.",
    price: 85,
    duration: "10 minutes",
    preparation: "No special preparation",
    sampleType: "Blood",
    reportTime: "2-3 days"
  },
  {
    id: "4",
    name: "Chest X-Ray",
    category: "Imaging",
    description: "Digital chest radiography to examine lungs, heart, and chest cavity.",
    price: 120,
    duration: "30 minutes",
    preparation: "Remove jewelry and metal objects",
    sampleType: "Imaging",
    reportTime: "Same day"
  },
  {
    id: "5",
    name: "ECG (Electrocardiogram)",
    category: "Cardiac Test",
    description: "Heart rhythm and electrical activity assessment.",
    price: 75,
    duration: "20 minutes",
    preparation: "Avoid caffeine 2 hours before",
    sampleType: "Electrical recording",
    reportTime: "Same day"
  },
  {
    id: "6",
    name: "MRI Brain Scan",
    category: "Imaging",
    description: "Detailed brain imaging using magnetic resonance technology.",
    price: 800,
    duration: "60 minutes",
    preparation: "Remove all metal objects, inform about implants",
    sampleType: "Imaging",
    reportTime: "3-5 days"
  }
];

const LabTests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<{ test: LabTest; quantity: number }[]>([]);

  const categories = ["all", "Blood Test", "Hormone Test", "Imaging", "Cardiac Test"];

  const filteredTests = mockLabTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (test: LabTest) => {
    setCart(prev => {
      const existing = prev.find(item => item.test.id === test.id);
      if (existing) {
        return prev.map(item =>
          item.test.id === test.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { test, quantity: 1 }];
    });
  };

  const removeFromCart = (testId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.test.id === testId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.test.id === testId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.test.id !== testId);
    });
  };

  const getCartItemQuantity = (testId: string) => {
    return cart.find(item => item.test.id === testId)?.quantity || 0;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="p-6 space-y-6 fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Lab Tests</h1>
          <p className="text-muted-foreground">Book diagnostic tests and health screenings</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="btn-hover relative">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({getTotalItems()})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Lab Test Cart</DialogTitle>
            </DialogHeader>
            <LabTestCart 
              cartItems={cart} 
              onUpdateQuantity={(testId, quantity) => {
                if (quantity === 0) {
                  setCart(prev => prev.filter(item => item.test.id !== testId));
                } else {
                  setCart(prev => prev.map(item =>
                    item.test.id === testId ? { ...item, quantity } : item
                  ));
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Advanced Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="card-hover shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Advanced Search</CardTitle>
          </CardHeader>
          <CardContent>
            <AdvancedSearch onResultSelect={(result) => {
              if (result.type === 'lab-test') {
                setSearchTerm(result.title);
              }
            }} />
          </CardContent>
        </Card>
        
        <Card className="card-hover shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Voice Search</CardTitle>
          </CardHeader>
          <CardContent>
            <VoiceSymptomInput onSymptomDetected={(symptoms) => {
              if (symptoms.length > 0) {
                setSearchTerm(symptoms.join(' '));
              }
            }} />
          </CardContent>
        </Card>
        
        <Card className="card-hover shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Smart Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <SmartSymptomPredictor symptoms={[]} />
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search lab tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <Card key={test.id} className="card-hover shadow-card bg-gradient-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg mb-2">{test.name}</CardTitle>
                  <Badge variant="outline" className="mb-2">
                    {test.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">${test.price}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{test.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Duration: {test.duration}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>Preparation: {test.preparation}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Report ready in: {test.reportTime}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                {getCartItemQuantity(test.id) > 0 ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromCart(test.id)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-medium min-w-[2rem] text-center">
                      {getCartItemQuantity(test.id)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToCart(test)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => addToCart(test)} className="btn-hover">
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No lab tests found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default LabTests;