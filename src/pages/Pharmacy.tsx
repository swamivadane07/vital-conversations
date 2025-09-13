import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Upload, Search, ShoppingCart, Package, History, UserCheck } from "lucide-react";

const Pharmacy = () => {
  const features = [
    {
      title: "Upload Prescription",
      description: "Upload your prescription and get verified medicines",
      icon: Upload,
      link: "/pharmacy/upload-prescription",
      color: "bg-primary"
    },
    {
      title: "Medicine Catalog",
      description: "Browse medicines by category, name or brand",
      icon: Search,
      link: "/pharmacy/catalog",
      color: "bg-secondary"
    },
    {
      title: "Shopping Cart",
      description: "Review your selected medicines and quantities",
      icon: ShoppingCart,
      link: "/pharmacy/cart",
      color: "bg-accent"
    },
    {
      title: "Order History",
      description: "View your past orders and track deliveries",
      icon: History,
      link: "/pharmacy/orders",
      color: "bg-muted"
    },
    {
      title: "Track Orders",
      description: "Real-time tracking of your medicine deliveries",
      icon: Package,
      link: "/pharmacy/track",
      color: "bg-success"
    },
    {
      title: "Profile Settings",
      description: "Manage addresses and payment methods",
      icon: UserCheck,
      link: "/pharmacy/profile",
      color: "bg-warning"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Online Pharmacy</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your trusted partner for medicine delivery. Upload prescriptions, browse medicines, and get doorstep delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="hover-scale transition-all duration-300 hover:shadow-soft">
            <CardHeader className="pb-4">
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to={feature.link}>
                  Access {feature.title}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Why Choose Our Pharmacy?</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="font-semibold mb-2">Verified Medicines</h3>
            <p className="opacity-90">All medicines are verified and authenticated</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Fast Delivery</h3>
            <p className="opacity-90">Same day delivery available in most areas</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Prescription Support</h3>
            <p className="opacity-90">Upload prescriptions for verification</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pharmacy;