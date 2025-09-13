import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, Check, X, Package, FileText, CreditCard, AlertCircle, Clock, Truck } from "lucide-react";

interface Notification {
  id: string;
  type: "order" | "prescription" | "payment" | "alert" | "delivery";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: "high" | "medium" | "low";
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "delivery",
      title: "Order Delivered",
      message: "Your order ORD-2024-001 has been successfully delivered to your address.",
      timestamp: "2 minutes ago",
      isRead: false,
      actionUrl: "/pharmacy/track?order=ORD-2024-001",
      priority: "medium"
    },
    {
      id: "2",
      type: "prescription",
      title: "Prescription Approved",
      message: "Your uploaded prescription has been verified by our pharmacist. You can now place orders.",
      timestamp: "1 hour ago",
      isRead: false,
      actionUrl: "/pharmacy/catalog",
      priority: "high"
    },
    {
      id: "3",
      type: "order",
      title: "Order Dispatched",
      message: "Your order ORD-2024-002 is packed and ready for delivery. Expected delivery: Today 6 PM.",
      timestamp: "3 hours ago",
      isRead: true,
      actionUrl: "/pharmacy/track?order=ORD-2024-002",
      priority: "medium"
    },
    {
      id: "4",
      type: "alert",
      title: "Medicine Reminder",
      message: "Time to take your Metformin (500mg). Don't forget your daily medication.",
      timestamp: "5 hours ago",
      isRead: false,
      priority: "high"
    },
    {
      id: "5",
      type: "payment",
      title: "Payment Successful",
      message: "Payment of ₹242.03 for order ORD-2024-001 has been processed successfully.",
      timestamp: "1 day ago",
      isRead: true,
      actionUrl: "/pharmacy/orders",
      priority: "low"
    },
    {
      id: "6",
      type: "prescription",
      title: "Prescription Expiring",
      message: "Your prescription for diabetes medication will expire in 3 days. Please upload a new one.",
      timestamp: "2 days ago",
      isRead: false,
      actionUrl: "/pharmacy/upload-prescription",
      priority: "high"
    }
  ]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order": return <Package className="h-4 w-4" />;
      case "prescription": return <FileText className="h-4 w-4" />;
      case "payment": return <CreditCard className="h-4 w-4" />;
      case "alert": return <AlertCircle className="h-4 w-4" />;
      case "delivery": return <Truck className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order": return "text-primary";
      case "prescription": return "text-secondary";
      case "payment": return "text-success";
      case "alert": return "text-warning";
      case "delivery": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge variant="destructive">High</Badge>;
      case "medium": return <Badge variant="default">Medium</Badge>;
      case "low": return <Badge variant="secondary">Low</Badge>;
      default: return null;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>
        <CardDescription>
          Stay updated with your orders and prescriptions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-primary/5 border-l-4 border-l-primary" : ""
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${!notification.isRead ? "bg-primary/10" : "bg-muted"}`}>
                          <div className={getNotificationColor(notification.type)}>
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-medium ${!notification.isRead ? "font-semibold" : ""}`}>
                              {notification.title}
                            </h4>
                            {getPriorityBadge(notification.priority)}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{notification.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 h-auto"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 h-auto text-destructive hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;