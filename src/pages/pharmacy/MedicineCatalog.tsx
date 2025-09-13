import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Heart, ShoppingCart, Plus, Minus, Pill } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Medicine {
  id: string;
  name: string;
  brand: string;
  category: string;
  dosage: string;
  price: number;
  stock: number;
  requiresPrescription: boolean;
  description: string;
  image?: string;
}

const MedicineCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const medicines: Medicine[] = [
    {
      id: "1",
      name: "Paracetamol",
      brand: "Crocin",
      category: "Pain Relief",
      dosage: "500mg",
      price: 25.50,
      stock: 100,
      requiresPrescription: false,
      description: "Effective pain relief and fever reducer"
    },
    {
      id: "2", 
      name: "Metformin",
      brand: "Glucon-D",
      category: "Diabetes",
      dosage: "500mg",
      price: 85.00,
      stock: 50,
      requiresPrescription: true,
      description: "Type 2 diabetes medication"
    },
    {
      id: "3",
      name: "Vitamin D3",
      brand: "D-Rise",
      category: "Vitamins",
      dosage: "60000 IU",
      price: 120.00,
      stock: 25,
      requiresPrescription: false,
      description: "Bone health supplement"
    },
    {
      id: "4",
      name: "Amoxicillin", 
      brand: "Amoxil",
      category: "Antibiotics",
      dosage: "250mg",
      price: 95.00,
      stock: 30,
      requiresPrescription: true,
      description: "Broad-spectrum antibiotic"
    }
  ];

  const categories = ["all", "Pain Relief", "Diabetes", "Vitamins", "Antibiotics", "Heart", "Respiratory"];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicineId: string) => {
    setCart(prev => ({
      ...prev,
      [medicineId]: (prev[medicineId] || 0) + 1
    }));
    toast({
      title: "Added to Cart",
      description: "Medicine added to your cart successfully",
    });
  };

  const removeFromCart = (medicineId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[medicineId] > 1) {
        newCart[medicineId]--;
      } else {
        delete newCart[medicineId];
      }
      return newCart;
    });
  };

  const toggleFavorite = (medicineId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(medicineId)) {
        newFavorites.delete(medicineId);
      } else {
        newFavorites.add(medicineId);
      }
      return newFavorites;
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock > 50) return { label: "In Stock", variant: "secondary" as const };
    if (stock > 10) return { label: "Low Stock", variant: "default" as const };
    return { label: "Out of Stock", variant: "destructive" as const };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Medicine Catalog</h1>
        <p className="text-muted-foreground">
          Browse and search for medicines by name, brand, or category
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines by name or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.map((medicine) => {
          const stockStatus = getStockStatus(medicine.stock);
          const cartQuantity = cart[medicine.id] || 0;
          const isFavorite = favorites.has(medicine.id);

          return (
            <Card key={medicine.id} className="hover:shadow-soft transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Pill className="h-6 w-6 text-primary" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(medicine.id)}
                    className="p-2"
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                    />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <CardTitle className="text-lg">{medicine.name}</CardTitle>
                  <CardDescription>{medicine.brand} - {medicine.dosage}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{medicine.category}</Badge>
                    <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                    {medicine.requiresPrescription && (
                      <Badge variant="secondary">Rx Required</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {medicine.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">₹{medicine.price}</p>
                    <p className="text-xs text-muted-foreground">{medicine.stock} in stock</p>
                  </div>
                </div>

                {cartQuantity > 0 ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(medicine.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-3 py-1 bg-muted rounded">{cartQuantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart(medicine.id)}
                        disabled={medicine.stock === 0}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      View in Cart
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => addToCart(medicine.id)}
                    disabled={medicine.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMedicines.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No medicines found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicineCatalog;