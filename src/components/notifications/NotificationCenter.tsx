
import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Clock, User, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scrollarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { apiService } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';
import type { Notification } from '@/types/organizationTypes';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (notificationId: number, entityType: string, entityId: number, action: 'approve' | 'reject') => {
    try {
      if (entityType === 'project') {
        await apiService.processProjectApproval(entityId.toString(), { action });
      } else if (entityType === 'task') {
        await apiService.processTaskApproval(entityId.toString(), { action });
      }
      
      // Mark notification as read
      await apiService.markNotificationAsRead(notificationId);
      
      toast({
        title: "Success",
        description: `${entityType} ${action}d successfully`
      });
      
      fetchNotifications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${action} ${entityType}`,
        variant: "destructive"
      });
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project_invite':
        return <FolderOpen className="w-4 h-4" />;
      case 'task_assignment':
        return <Check className="w-4 h-4" />;
      case 'approval_request':
        return <Clock className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'project_invite':
        return 'bg-blue-100 text-blue-800';
      case 'task_assignment':
        return 'bg-green-100 text-green-800';
      case 'approval_request':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
          )}
        </div>
        
        <ScrollArea className="h-96">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No notifications</div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <Card key={notification.notification_id} className={`mb-2 ${!notification.is_read ? 'bg-blue-50' : ''}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2 flex-1">
                        <Badge className={getNotificationColor(notification.type)}>
                          {getNotificationIcon(notification.type)}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.created_date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {!notification.is_read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(notification.notification_id)}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    
                    {notification.type === 'approval_request' && (
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproval(
                            notification.notification_id,
                            notification.entity_type,
                            notification.entity_id,
                            'approve'
                          )}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproval(
                            notification.notification_id,
                            notification.entity_type,
                            notification.entity_id,
                            'reject'
                          )}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
