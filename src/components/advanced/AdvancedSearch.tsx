import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface SearchResult {
  id: string;
  title: string;
  type: 'doctor' | 'lab-test' | 'appointment' | 'article';
  description: string;
  tags: string[];
  rating?: number;
  price?: number;
  location?: string;
}

interface AdvancedSearchProps {
  onResultSelect?: (result: SearchResult) => void;
}

const mockSearchData: SearchResult[] = [
  {
    id: '1',
    title: 'Dr. Sarah Johnson - Cardiologist',
    type: 'doctor',
    description: 'Experienced heart specialist with 15 years of practice',
    tags: ['cardiology', 'heart', 'experienced'],
    rating: 4.8,
    location: 'New York'
  },
  {
    id: '2',
    title: 'Complete Blood Count (CBC)',
    type: 'lab-test',
    description: 'Comprehensive blood analysis to check overall health',
    tags: ['blood', 'routine', 'health-check'],
    price: 45
  },
  {
    id: '3',
    title: 'Managing Diabetes: A Complete Guide',
    type: 'article',
    description: 'Comprehensive guide on diabetes management and lifestyle',
    tags: ['diabetes', 'lifestyle', 'management']
  },
  {
    id: '4',
    title: 'Dr. Michael Chen - Neurologist',
    type: 'doctor',
    description: 'Specializing in brain and nervous system disorders',
    tags: ['neurology', 'brain', 'specialist'],
    rating: 4.9,
    location: 'California'
  },
  {
    id: '5',
    title: 'MRI Brain Scan',
    type: 'lab-test',
    description: 'Detailed imaging of brain structures',
    tags: ['brain', 'imaging', 'mri'],
    price: 850
  }
];

const recentSearches = [
  'cardiologist near me',
  'blood test prices',
  'diabetes symptoms',
  'neurologist appointment'
];

const popularSearches = [
  'general practitioner',
  'covid test',
  'blood pressure check',
  'vaccination schedule',
  'health insurance'
];

export const AdvancedSearch = ({ onResultSelect }: AdvancedSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setFilteredResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filtered = mockSearchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    setResults(filtered);
    setFilteredResults(filtered);
    setIsSearching(false);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const debounceTimer = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setResults([]);
      setFilteredResults([]);
    }
  }, [searchQuery, performSearch]);

  useEffect(() => {
    let filtered = [...results];

    // Filter by type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(item => selectedTypes.includes(item.type));
    }

    // Filter by price range (for lab tests)
    filtered = filtered.filter(item => {
      if (item.type === 'lab-test' && item.price) {
        return item.price >= priceRange[0] && item.price <= priceRange[1];
      }
      return true;
    });

    // Sort results
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredResults(filtered);
  }, [results, selectedTypes, sortBy, priceRange]);

  const handleTypeFilter = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    }
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSortBy('relevance');
    setPriceRange([0, 1000]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'doctor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'lab-test': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'appointment': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'article': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for doctors, lab tests, articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 h-12 text-lg"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {(selectedTypes.length > 0 || sortBy !== 'relevance') && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedTypes.length + (sortBy !== 'relevance' ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              {(selectedTypes.length > 0 || sortBy !== 'relevance') && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>

            {results.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {filteredResults.length} of {results.length} results
              </p>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 border rounded-lg bg-accent/10 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type Filter */}
                <div>
                  <h4 className="font-medium mb-3">Content Type</h4>
                  <div className="space-y-2">
                    {['doctor', 'lab-test', 'appointment', 'article'].map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={(checked) => handleTypeFilter(type, checked as boolean)}
                        />
                        <label htmlFor={type} className="text-sm capitalize cursor-pointer">
                          {type.replace('-', ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h4 className="font-medium mb-3">Sort By</h4>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range (for lab tests) */}
                <div>
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-20"
                      />
                      <span>-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Search Suggestions */}
      {!searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4" />
                Recent Searches
              </h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={search}
                    onClick={() => setSearchQuery(search)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full text-left p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <Search className="w-3 h-3" />
                    {search}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <Badge
                    key={search}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSearchQuery(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-4">
          {isSearching ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <motion.div
                    className="w-8 h-8 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onResultSelect?.(result)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{result.title}</h3>
                          <Badge variant="secondary" className={getTypeColor(result.type)}>
                            {result.type.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {result.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {result.rating && (
                            <span className="flex items-center gap-1">
                              ⭐ {result.rating}
                            </span>
                          )}
                          {result.price && (
                            <span>${result.price}</span>
                          )}
                          {result.location && (
                            <span>📍 {result.location}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
