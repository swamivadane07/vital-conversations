import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, Package, Clock, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  brand: string;
  dosage: string;
  price: number;
  quantity: number;
  requiresPrescription: boolean;
  image?: string;
}

const PharmacyCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Paracetamol",
      brand: "Crocin",
      dosage: "500mg",
      price: 25.50,
      quantity: 2,
      requiresPrescription: false
    },
    {
      id: "2",
      name: "Metformin", 
      brand: "Glucon-D",
      dosage: "500mg",
      price: 85.00,
      quantity: 1,
      requiresPrescription: true
    },
    {
      id: "3",
      name: "Vitamin D3",
      brand: "D-Rise", 
      dosage: "60000 IU",
      price: 120.00,
      quantity: 1,
      requiresPrescription: false
    }
  ]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(itemId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "Medicine removed from cart",
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;

  const prescriptionItems = cartItems.filter(item => item.requiresPrescription);
  const hasPrescriptionItems = prescriptionItems.length > 0;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Browse our medicine catalog to add items to your cart
            </p>
            <Button asChild>
              <Link to="/pharmacy/catalog">
                Browse Medicines
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        <p className="text-muted-foreground">
          Review your selected medicines before checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {hasPrescriptionItems && (
            <Card className="border-warning">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <Package className="h-5 w-5" />
                  Prescription Required
                </CardTitle>
                <CardDescription>
                  Some items require a valid prescription. Make sure you have uploaded your prescription.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link to="/pharmacy/upload-prescription">
                    Upload Prescription
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({cartItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.brand} - {item.dosage}
                    </p>
                    <div className="flex gap-2">
                      {item.requiresPrescription && (
                        <Badge variant="secondary">Rx Required</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-3 py-1 bg-muted rounded min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {deliveryFee > 0 && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Add ₹{(500 - subtotal).toFixed(2)} more for free delivery
                  </p>
                </div>
              )}

              <Button asChild className="w-full">
                <Link to="/pharmacy/checkout" className="flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Estimated Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Estimated Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your order will be delivered within 24-48 hours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PharmacyCart;