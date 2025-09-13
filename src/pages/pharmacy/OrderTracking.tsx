import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Package, Truck, MapPin, Phone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const OrderTracking = () => {
  const order = {
    id: "ORD-2024-001",
    status: "out_for_delivery",
    placedAt: "2024-01-20 10:30 AM",
    estimatedDelivery: "2024-01-21 6:00 PM",
    items: [
      { name: "Paracetamol", brand: "Crocin", quantity: 2, price: 25.50 },
      { name: "Vitamin D3", brand: "D-Rise", quantity: 1, price: 120.00 }
    ],
    total: 171.00,
    deliveryAddress: {
      name: "John Doe",
      address: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      pincode: "400001"
    },
    courier: {
      name: "FastTrack Delivery",
      trackingId: "FT123456789",
      driverName: "Rajesh Kumar",
      driverPhone: "+91 98765 43210"
    }
  };

  const trackingSteps = [
    {
      id: 1,
      title: "Order Placed",
      description: "Your order has been confirmed",
      status: "completed",
      timestamp: "Jan 20, 10:30 AM",
      icon: CheckCircle
    },
    {
      id: 2,
      title: "Prescription Verified",
      description: "Prescription validated by pharmacist",
      status: "completed", 
      timestamp: "Jan 20, 11:15 AM",
      icon: CheckCircle
    },
    {
      id: 3,
      title: "Order Packed",
      description: "Medicines packed and ready for dispatch",
      status: "completed",
      timestamp: "Jan 20, 2:00 PM", 
      icon: CheckCircle
    },
    {
      id: 4,
      title: "Out for Delivery",
      description: "Package is on the way to your address",
      status: "current",
      timestamp: "Jan 21, 9:00 AM",
      icon: Truck
    },
    {
      id: 5,
      title: "Delivered",
      description: "Package delivered successfully",
      status: "pending",
      timestamp: "Expected by 6:00 PM",
      icon: Package
    }
  ];

  const currentStepIndex = trackingSteps.findIndex(step => step.status === "current");
  const progress = ((currentStepIndex + 1) / trackingSteps.length) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-success";
      case "current": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadgeVariant = (orderStatus: string) => {
    switch (orderStatus) {
      case "delivered": return "secondary" as const;
      case "out_for_delivery": return "default" as const;
      case "packed": return "secondary" as const;
      case "verified": return "secondary" as const;
      default: return "outline" as const;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/pharmacy/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            All Orders
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Track Order</h1>
          <p className="text-muted-foreground">Order ID: {order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tracking Progress */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Order Status</CardTitle>
                  <CardDescription>Estimated delivery: {order.estimatedDelivery}</CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Order Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-4">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = step.status === "completed";
                  const isCurrent = step.status === "current";
                  
                  return (
                    <div key={step.id} className="flex items-start space-x-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isCompleted ? "bg-success border-success" :
                        isCurrent ? "bg-primary border-primary" :
                        "bg-muted border-muted"
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          isCompleted ? "text-white" :
                          isCurrent ? "text-white" :
                          "text-muted-foreground"
                        }`} />
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <h3 className={`font-medium ${getStatusColor(step.status)}`}>
                            {step.title}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {order.status === "out_for_delivery" && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Truck className="h-5 w-5" />
                  Delivery Partner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Courier Service</p>
                    <p className="font-medium">{order.courier.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking ID</p>
                    <p className="font-medium font-mono">{order.courier.trackingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Driver Name</p>
                    <p className="font-medium">{order.courier.driverName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Number</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{order.courier.driverPhone}</p>
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.brand} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.deliveryAddress.name}</p>
                <p className="text-muted-foreground">{order.deliveryAddress.address}</p>
                <p className="text-muted-foreground">
                  {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;