
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Bell, Search, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"

export const Header: React.FC = () => {
  const { notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  const { user, logout, login, isLoading } = useAuth();


  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4">

      <Drawer>




        <div className="flex items-center justify-between">
          {/* Left side with sidebar trigger and search */}
          <div className="flex items-center space-x-4 flex-1 max-w-md">
            <SidebarTrigger />
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search projects, tasks, or team members..."
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DrawerTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">


                <Bell className="h-5 w-5" />


                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DrawerTrigger>

            {/* Quick Actions */}
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              New Project
            </Button>

            {/* User Profile and Logout */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                />
                <AvatarFallback>
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => {
                  logout();
                }}
              >
                <LogOut className="h-4 w-4"


                />
              </Button>
            </div>
          </div>
        </div>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Notification</DrawerTitle>
            <DrawerDescription>
              Everything that you need to notice.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4">
            <div
              // ref={containerRef}
              className="flex flex-col space-y-2 max-h-96 overflow-y-auto"
            >
              {/* {notifications.map(...)} */}

              <div className="bg-blue-500/10 text-blue-800 border  border-blue-300 p-4 rounded shadow">
                <p className="text-sm font-bold">New comment on your task</p>
                <p className="text-sm truncate w-full">
                  New comment on your task that is really long and should be truncated
                </p>
              </div>

              <div className="bg-red-500/10 text-red-800 border  border-red-300 p-4 rounded shadow">
                <p className="text-sm font-bold">New comment on your task</p>
                <p className="text-sm truncate w-full">
                  New comment on your task that is really long and should be truncated
                </p>
              </div>

            </div>
          </div>


        </DrawerContent>
      </Drawer>
    </header >
  );
};
