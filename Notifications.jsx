
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, Clock, Filter, Search, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const NotificationCard = ({ notification, onDismiss, onMarkAsRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case "alert":
        return <Bell className="h-5 w-5 text-destructive" />;
      case "update":
        return <Clock className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="glass-card card-hover">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="mt-1">{getIcon()}</div>
            <div>
              <h3 className="font-semibold">{notification.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  {notification.timestamp}
                </span>
                {notification.type === "alert" && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-destructive/10 text-destructive">
                    Urgent
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMarkAsRead(notification.id)}
              className="h-8 w-8"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDismiss(notification.id)}
              className="h-8 w-8 text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Notifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "Critical Patient Update",
      message: "Patient #123's vital signs require immediate attention.",
      timestamp: "2 minutes ago",
      read: false
    },
    {
      id: 2,
      type: "update",
      title: "ML Model Training Complete",
      message: "Sepsis prediction model has completed training with 95% accuracy.",
      timestamp: "1 hour ago",
      read: false
    },
    {
      id: 3,
      type: "alert",
      title: "System Alert",
      message: "Database synchronization required for patient records.",
      timestamp: "2 hours ago",
      read: false
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleDismiss = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      title: "Notification dismissed",
      description: "The notification has been removed from your list.",
    });
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast({
      title: "Marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast({
      title: "All notifications cleared",
      description: "Your notification list has been cleared.",
    });
  };

  const filteredNotifications = notifications
    .filter(n => {
      if (filter === "unread") return !n.read;
      if (filter === "alerts") return n.type === "alert";
      return true;
    })
    .filter(n => 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button
          variant="destructive"
          onClick={handleClearAll}
          className="flex items-center"
          disabled={notifications.length === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Filter Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="flex-1 md:flex-none"
              >
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                onClick={() => setFilter("unread")}
                className="flex-1 md:flex-none"
              >
                Unread
              </Button>
              <Button
                variant={filter === "alerts" ? "default" : "outline"}
                onClick={() => setFilter("alerts")}
                className="flex-1 md:flex-none"
              >
                Alerts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No notifications</h3>
              <p className="text-sm text-muted-foreground mt-2">
                You're all caught up! Check back later for new notifications.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onDismiss={handleDismiss}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Notifications;
