import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, HeartPulse, Settings, 
  Shield, DollarSign, Bell, UserCog 
} from "lucide-react";

export const MainLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Residents", icon: Users, path: "/residents" },
    { name: "Health Monitor", icon: HeartPulse, path: "/health" },
    { name: "Staff Management", icon: UserCog, path: "/staff" },
    { name: "Financial", icon: DollarSign, path: "/donations" },
    { name: "Safety Alerts", icon: Shield, path: "/alerts" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ==================== Sidebar ==================== */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col justify-between">

        {/* Top Section */}
        <div>
          <div className="px-6 py-6 border-b">
            <h1 className="text-xl font-bold text-indigo-600">SilverCare AI</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>

          {/* Navigation */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t p-6 space-y-3">
          {/* ✅ FIX — Settings button now linked */}
          <Link
            to="/settings"
            className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md"
          >
            <Settings className="h-5 w-5" /> Settings
          </Link>
        </div>

      </aside>

      {/* ==================== Main Content ==================== */}
      <main className="ml-64 flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
};
