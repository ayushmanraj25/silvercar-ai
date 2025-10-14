import { Button } from "../ui/button";
import {
  LayoutDashboard,
  Users,
  Heart,
  UserCog,
  DollarSign,
  Shield,
  Bell,
  Settings,
  Activity,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Residents", href: "/residents", icon: Users },
  { name: "Health Monitor", href: "/health", icon: Heart },
  { name: "Staff Management", href: "/staff", icon: UserCog },
  { name: "Financial", href: "/donations", icon: DollarSign },
  { name: "Safety Alerts", href: "/safety", icon: Shield },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Logo + Title */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">SilverCare AI</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} to={item.href}>
              <div
                className={clsx(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="leading-none">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Quick Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link to="/notifications">
          <div className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-100 text-gray-700">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">Notifications</span>
            </div>
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              3
            </span>
          </div>
        </Link>

        <Link to="/settings">
          <div className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100">
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
