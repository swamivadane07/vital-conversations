import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Minus, ShoppingCart, Heart, Info, Star, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface Medicine {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  dosage: string;
  requiresPrescription: boolean;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  sideEffects: string[];
  isPopular?: boolean;
  discount?: number;
}

const MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol',
    brand: 'Crocin',
    category: 'Pain Relief',
    price: 45,
    originalPrice: 60,
    stock: 150,
    dosage: '650mg',
    requiresPrescription: false,
    image: '/api/placeholder/200/200',
    rating: 4.5,
    reviews: 1200,
    description: 'Effective pain relief and fever reducer',
    sideEffects: ['Nausea', 'Drowsiness'],
    isPopular: true,
    discount: 25
  },
  {
    id: '2',
    name: 'Amoxicillin',
    brand: 'Novamox',
    category: 'Antibiotics',
    price: 180,
    stock: 80,
    dosage: '500mg',
    requiresPrescription: true,
    image: '/api/placeholder/200/200',
    rating: 4.3,
    reviews: 850,
    description: 'Broad-spectrum antibiotic for bacterial infections',
    sideEffects: ['Stomach upset', 'Diarrhea']
  },
  {
    id: '3',
    name: 'Cetirizine',
    brand: 'Zyrtec',
    category: 'Allergy',
    price: 95,
    originalPrice: 120,
    stock: 200,
    dosage: '10mg',
    requiresPrescription: false,
    image: '/api/placeholder/200/200',
    rating: 4.6,
    reviews: 950,
    description: 'Antihistamine for allergy relief',
    sideEffects: ['Drowsiness', 'Dry mouth'],
    discount: 21
  },
  {
    id: '4',
    name: 'Metformin',
    brand: 'Glycomet',
    category: 'Diabetes',
    price: 120,
    stock: 90,
    dosage: '500mg',
    requiresPrescription: true,
    image: '/api/placeholder/200/200',
    rating: 4.4,
    reviews: 720,
    description: 'Diabetes management medication',
    sideEffects: ['Nausea', 'Diarrhea']
  },
  {
    id: '5',
    name: 'Ibuprofen',
    brand: 'Brufen',
    category: 'Pain Relief',
    price: 85,
    stock: 120,
    dosage: '400mg',
    requiresPrescription: false,
    image: '/api/placeholder/200/200',
    rating: 4.2,
    reviews: 680,
    description: 'Anti-inflammatory pain reliever',
    sideEffects: ['Stomach irritation', 'Heartburn'],
    isPopular: true
  },
  {
    id: '6',
    name: 'Omeprazole',
    brand: 'Prilosec',
    category: 'Gastro',
    price: 150,
    stock: 75,
    dosage: '20mg',
    requiresPrescription: true,
    image: '/api/placeholder/200/200',
    rating: 4.7,
    reviews: 890,
    description: 'Proton pump inhibitor for acid reflux',
    sideEffects: ['Headache', 'Diarrhea']
  }
];

const CATEGORIES = ['All', 'Pain Relief', 'Antibiotics', 'Allergy', 'Diabetes', 'Gastro', 'Vitamins', 'Skincare'];
const BRANDS = ['All', 'Crocin', 'Novamox', 'Zyrtec', 'Glycomet', 'Brufen', 'Prilosec'];

const ITEMS_PER_PAGE = 9;

export default function OnlineStore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [prescriptionFilter, setPrescriptionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  
  const { toast } = useToast();

  // Filter and sort medicines
  const filteredMedicines = useMemo(() => {
    let filtered = MEDICINES.filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          medicine.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          medicine.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || medicine.brand === selectedBrand;
      const matchesPrice = medicine.price >= priceRange[0] && medicine.price <= priceRange[1];
      const matchesPrescription = prescriptionFilter === 'all' || 
                                (prescriptionFilter === 'prescription' && medicine.requiresPrescription) ||
                                (prescriptionFilter === 'otc' && !medicine.requiresPrescription);

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesPrescription;
    });

    // Sort medicines
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, prescriptionFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE);
  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const addToCart = (medicineId: string) => {
    setCart(prev => ({
      ...prev,
      [medicineId]: (prev[medicineId] || 0) + 1
    }));
    toast({
      title: "Added to Cart",
      description: "Item has been added to your cart.",
    });
  };

  const updateQuantity = (medicineId: string, change: number) => {
    setCart(prev => {
      const newQuantity = (prev[medicineId] || 0) + change;
      if (newQuantity <= 0) {
        const { [medicineId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [medicineId]: newQuantity };
    });
  };

  const toggleFavorite = (medicineId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(medicineId)) {
        newFavorites.delete(medicineId);
        toast({
          title: "Removed from Favorites",
          description: "Item removed from your favorites.",
        });
      } else {
        newFavorites.add(medicineId);
        toast({
          title: "Added to Favorites",
          description: "Item added to your favorites.",
        });
      }
      return newFavorites;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setPriceRange([0, 500]);
    setPrescriptionFilter('all');
    setSortBy('popularity');
    setCurrentPage(1);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Online Pharmacy Store</h1>
                  <p className="text-muted-foreground mt-2">
                    Find the medicines you need with fast delivery
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    {filteredMedicines.length} medicines available
                  </Badge>
                  <Button variant="outline" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {Object.keys(cart).length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {Object.values(cart).reduce((sum, qty) => sum + qty, 0)}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <Card className="sticky top-4">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search medicines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Brand</label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANDS.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Prescription Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Type</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="all"
                          checked={prescriptionFilter === 'all'}
                          onCheckedChange={() => setPrescriptionFilter('all')}
                        />
                        <label htmlFor="all" className="text-sm text-foreground">All Medicines</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="otc"
                          checked={prescriptionFilter === 'otc'}
                          onCheckedChange={() => setPrescriptionFilter('otc')}
                        />
                        <label htmlFor="otc" className="text-sm text-foreground">Over-the-Counter</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="prescription"
                          checked={prescriptionFilter === 'prescription'}
                          onCheckedChange={() => setPrescriptionFilter('prescription')}
                        />
                        <label htmlFor="prescription" className="text-sm text-foreground">Prescription Required</label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Sort and Filter Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden w-fit"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-foreground">Sort by:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Medicine Grid */}
              {paginatedMedicines.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {paginatedMedicines.map((medicine) => (
                    <Card key={medicine.id} className="group card-hover overflow-hidden">
                      <CardHeader className="p-0 relative">
                        <div className="aspect-square bg-muted relative overflow-hidden">
                          <img
                            src={medicine.image}
                            alt={medicine.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {medicine.discount && (
                            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                              {medicine.discount}% OFF
                            </Badge>
                          )}
                          {medicine.isPopular && (
                            <Badge className="absolute top-2 right-2 bg-warning text-warning-foreground">
                              Popular
                            </Badge>
                          )}
                          {medicine.requiresPrescription && (
                            <div className="absolute bottom-2 left-2">
                              <Badge variant="outline" className="bg-card/90 backdrop-blur-sm">
                                <FileText className="h-3 w-3 mr-1" />
                                Rx
                              </Badge>
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 backdrop-blur-sm"
                            onClick={() => toggleFavorite(medicine.id)}
                          >
                            <Heart 
                              className={`h-4 w-4 ${favorites.has(medicine.id) ? 'fill-red-500 text-red-500' : ''}`} 
                            />
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {medicine.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{medicine.brand} • {medicine.dosage}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-foreground ml-1">{medicine.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">({medicine.reviews} reviews)</span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-foreground">₹{medicine.price}</span>
                          {medicine.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{medicine.originalPrice}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <span>Stock: {medicine.stock}</span>
                          <Badge variant={medicine.stock > 50 ? "secondary" : "destructive"} className="text-xs">
                            {medicine.stock > 50 ? "In Stock" : "Low Stock"}
                          </Badge>
                        </div>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3 cursor-help">
                              <Info className="h-3 w-3" />
                              Quick Info
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-medium">{medicine.description}</p>
                              <p className="text-xs">Side effects: {medicine.sideEffects.join(', ')}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        {cart[medicine.id] ? (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(medicine.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-medium text-foreground min-w-[2ch] text-center">
                                {cart[medicine.id]}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(medicine.id, 1)}
                                disabled={cart[medicine.id] >= medicine.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button variant="default" size="sm" className="btn-hover">
                              ₹{medicine.price * cart[medicine.id]}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="w-full btn-hover"
                            onClick={() => addToCart(medicine.id)}
                            disabled={medicine.stock === 0}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-foreground mb-2">No medicines found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filter criteria to find what you're looking for.
                    </p>
                    <Button onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}