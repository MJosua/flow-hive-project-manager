
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  Kanban,
  Calendar,
  Users,
  Folder,
  User,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: Folder },
  { name: 'Kanban', href: '/kanban', icon: Kanban },
  { name: 'Gantt Chart', href: '/gantt', icon: Calendar },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Approvals', href: '/approvals', icon: User },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-gray-900">ProjectHub</h2>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className={cn(
            "h-5 w-5 transition-transform",
            isCollapsed && "rotate-180"
          )} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-yellow-50 text-yellow-700 border border-yellow-200" 
                  : "text-gray-700 hover:bg-gray-100",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className={cn(
          "flex items-center space-x-3",
          isCollapsed && "justify-center"
        )}>
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Smith</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
