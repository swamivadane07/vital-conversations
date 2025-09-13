import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, CreditCard, Plus, Edit3, Trash2, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Address {
  id: string;
  label: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "wallet";
  label: string;
  details: string;
  isDefault: boolean;
}

const PharmacyProfile = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    dateOfBirth: "1990-05-15",
    emergencyContact: "+91 87654 32109"
  });

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Home",
      name: "John Doe",
      address: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "+91 98765 43210",
      isDefault: true
    },
    {
      id: "2",
      label: "Office",
      name: "John Doe",
      address: "456 Business Park, Floor 10",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400002",
      phone: "+91 98765 43210",
      isDefault: false
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      label: "HDFC Credit Card",
      details: "**** **** **** 1234",
      isDefault: true
    },
    {
      id: "2",
      type: "upi",
      label: "PhonePe UPI",
      details: "john@phonepe",
      isDefault: false
    }
  ]);

  const [isEditing, setIsEditing] = useState({
    profile: false,
    address: "",
    payment: ""
  });

  const handleProfileSave = () => {
    setIsEditing({ ...isEditing, profile: false });
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully",
    });
  };

  const handleAddressDelete = (addressId: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast({
      title: "Address Deleted",
      description: "Address has been removed successfully",
    });
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
    toast({
      title: "Default Address Updated",
      description: "Default delivery address has been changed",
    });
  };

  const handlePaymentDelete = (paymentId: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentId));
    toast({
      title: "Payment Method Deleted",
      description: "Payment method has been removed successfully",
    });
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "card": return <CreditCard className="h-5 w-5" />;
      case "upi": return <div className="w-5 h-5 bg-primary rounded-sm" />;
      case "wallet": return <div className="w-5 h-5 bg-secondary rounded-sm" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, addresses, and payment methods
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Addresses
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing({ ...isEditing, profile: !isEditing.profile })}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditing.profile ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing.profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing.profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing.profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    disabled={!isEditing.profile}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    value={profile.emergencyContact}
                    onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                    disabled={!isEditing.profile}
                  />
                </div>
              </div>
              {isEditing.profile && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing({ ...isEditing, profile: false })}>
                    Cancel
                  </Button>
                  <Button onClick={handleProfileSave}>
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Delivery Addresses</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Address
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <Card key={address.id} className={`${address.isDefault ? 'border-primary' : ''}`}>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{address.label}</CardTitle>
                          {address.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                        <CardDescription>{address.name}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddressDelete(address.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm space-y-1">
                      <p>{address.address}</p>
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                      <p>Phone: {address.phone}</p>
                    </div>
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefaultAddress(address.id)}
                        className="w-full"
                      >
                        Set as Default
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payments">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payment Methods</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Payment Method
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((payment) => (
                <Card key={payment.id} className={`${payment.isDefault ? 'border-primary' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {getPaymentIcon(payment.type)}
                        <div>
                          <h4 className="font-medium">{payment.label}</h4>
                          <p className="text-sm text-muted-foreground">{payment.details}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {payment.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePaymentDelete(payment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {!payment.isDefault && (
                      <Button variant="outline" size="sm" className="w-full">
                        Set as Default
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PharmacyProfile;