import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Eye, RotateCcw, Filter, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: "delivered" | "out_for_delivery" | "packed" | "cancelled";
  items: OrderItem[];
  total: number;
  prescriptionRequired: boolean;
}

const OrderHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const orders: Order[] = [
    {
      id: "ORD-2024-001",
      date: "2024-01-20",
      status: "delivered",
      items: [
        { id: "1", name: "Paracetamol", quantity: 2, price: 25.50 },
        { id: "2", name: "Vitamin D3", quantity: 1, price: 120.00 }
      ],
      total: 171.00,
      prescriptionRequired: false
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-18",
      status: "delivered",
      items: [
        { id: "3", name: "Metformin", quantity: 1, price: 85.00 },
        { id: "4", name: "Aspirin", quantity: 3, price: 15.00 }
      ],
      total: 130.00,
      prescriptionRequired: true
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-15",
      status: "out_for_delivery",
      items: [
        { id: "5", name: "Cough Syrup", quantity: 1, price: 45.00 }
      ],
      total: 45.00,
      prescriptionRequired: false
    },
    {
      id: "ORD-2024-004",
      date: "2024-01-10",
      status: "cancelled",
      items: [
        { id: "6", name: "Antibiotics", quantity: 2, price: 95.00 }
      ],
      total: 190.00,
      prescriptionRequired: true
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDate = dateFilter === "all" || 
      (dateFilter === "last_week" && new Date(order.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "last_month" && new Date(order.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      delivered: { label: "Delivered", variant: "secondary" as const },
      out_for_delivery: { label: "Out for Delivery", variant: "default" as const },
      packed: { label: "Packed", variant: "secondary" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const }
    };
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: "outline" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Order History</h1>
        <p className="text-muted-foreground">
          View and track all your past medicine orders
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders or medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="packed">Packed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last_week">Last Week</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all" 
                  ? "Try adjusting your search filters"
                  : "You haven't placed any orders yet"
                }
              </p>
              <Button asChild>
                <Link to="/pharmacy/catalog">
                  Browse Medicines
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-soft transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <CardDescription>
                      Ordered on {formatDate(order.date)} • {order.items.length} item(s)
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.prescriptionRequired && (
                      <Badge variant="outline">Rx Required</Badge>
                    )}
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">
                      Total: ₹{order.total.toFixed(2)}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/pharmacy/track?order=${order.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-primary">{orders.length}</h3>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-success">
              {orders.filter(o => o.status === "delivered").length}
            </h3>
            <p className="text-sm text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-warning">
              {orders.filter(o => o.status === "out_for_delivery").length}
            </h3>
            <p className="text-sm text-muted-foreground">In Transit</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-primary">
              ₹{orders.filter(o => o.status === "delivered").reduce((sum, o) => sum + o.total, 0).toFixed(0)}
            </h3>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderHistory;