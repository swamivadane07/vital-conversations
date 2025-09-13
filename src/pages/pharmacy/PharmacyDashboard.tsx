import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  Package, 
  ShoppingCart, 
  FileText, 
  Clock, 
  TrendingUp, 
  Heart, 
  Pill,
  Bell,
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import NotificationCenter from "@/components/pharmacy/NotificationCenter";
import MedicineReminder from "@/components/pharmacy/MedicineReminder";

const PharmacyDashboard = () => {
  // Mock data
  const stats = {
    totalOrders: 12,
    deliveredOrders: 8,
    totalSpent: 1240.50,
    activeReminders: 3,
    pendingPrescriptions: 1
  };

  const recentOrders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-20",
      status: "delivered",
      items: 2,
      total: 171.00
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-18",
      status: "out_for_delivery",
      items: 1,
      total: 45.00
    }
  ];

  const upcomingMedicine = [
    { name: "Metformin", time: "08:00 AM", dosage: "500mg" },
    { name: "Vitamin D3", time: "09:00 AM", dosage: "60000 IU" }
  ];

  const quickActions = [
    {
      title: "Upload Prescription",
      description: "Upload new prescription for verification",
      icon: FileText,
      link: "/pharmacy/upload-prescription",
      color: "bg-primary"
    },
    {
      title: "Browse Medicines",
      description: "Search and order medicines",
      icon: Pill,
      link: "/pharmacy/catalog",
      color: "bg-secondary"
    },
    {
      title: "View Cart",
      description: "Review items in your cart",
      icon: ShoppingCart,
      link: "/pharmacy/cart",
      color: "bg-accent"
    },
    {
      title: "Track Orders",
      description: "Monitor your delivery status",
      icon: Package,
      link: "/pharmacy/orders",
      color: "bg-success"
    }
  ];

  const healthMetrics = {
    medicineAdherence: 85,
    weeklyGoal: 90,
    streakDays: 12
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Pharmacy Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Manage your medicines, orders, and health tracking
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-soft transition-all duration-300">
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">{stats.totalOrders}</h3>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-soft transition-all duration-300">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-success">{stats.deliveredOrders}</h3>
            <p className="text-sm text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-soft transition-all duration-300">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">₹{stats.totalSpent}</h3>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-soft transition-all duration-300">
          <CardContent className="p-4 text-center">
            <Bell className="h-8 w-8 text-warning mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-warning">{stats.activeReminders}</h3>
            <p className="text-sm text-muted-foreground">Active Reminders</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-soft transition-all duration-300">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-secondary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-secondary">{stats.pendingPrescriptions}</h3>
            <p className="text-sm text-muted-foreground">Pending Rx</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Fast access to common pharmacy features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.title} to={action.link} className="group">
                    <Card className="hover:shadow-soft transition-all duration-300 hover:scale-[1.02]">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${action.color} text-white`}>
                            <action.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {action.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest medicine orders</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/pharmacy/orders">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items} item(s) • {order.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={order.status === "delivered" ? "secondary" : "default"}>
                      {order.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <span className="font-medium">₹{order.total}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Health Adherence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Medicine Adherence
              </CardTitle>
              <CardDescription>Track your medication consistency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Week's Progress</span>
                  <span>{healthMetrics.medicineAdherence}%</span>
                </div>
                <Progress value={healthMetrics.medicineAdherence} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  Goal: {healthMetrics.weeklyGoal}% • Current streak: {healthMetrics.streakDays} days
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-primary">{healthMetrics.streakDays}</h4>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-success">{healthMetrics.medicineAdherence}%</h4>
                  <p className="text-sm text-muted-foreground">Adherence Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medicine Reminders Component */}
          <MedicineReminder />
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Notification Center */}
          <NotificationCenter />

          {/* Upcoming Medicine */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Next Doses Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingMedicine.map((medicine, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{medicine.name}</p>
                      <p className="text-xs text-muted-foreground">{medicine.dosage}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{medicine.time}</Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Reminders
              </Button>
            </CardContent>
          </Card>

          {/* Health Tips */}
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Daily Health Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-1" />
                <div>
                  <p className="text-sm mb-2">
                    Take your medicines at the same time each day to maintain consistent levels in your body.
                  </p>
                  <p className="text-xs opacity-90">
                    Tip: Set daily reminders to build a healthy routine.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
              <p className="text-sm font-medium text-destructive mb-2">Medication Emergency?</p>
              <Button variant="destructive" size="sm" className="w-full">
                Contact Pharmacist
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;