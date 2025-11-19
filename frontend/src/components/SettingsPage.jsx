import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Bell, Shield, UserCog } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    alerts: true,
    staffAlerts: true,
    donationAlerts: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* Notification Preferences */}
        <div className="p-6 border rounded-lg shadow-sm bg-white space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" /> Notifications
          </h2>

          <div className="space-y-3">
            {[
              { key: "alerts", label: "Health Alerts" },
              { key: "staffAlerts", label: "Staff & Duty Alerts" },
              { key: "donationAlerts", label: "New Donation Alerts" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-2 border-b"
              >
                <span className="text-gray-700">{item.label}</span>
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={() => toggleSetting(item.key)}
                  className="h-4 w-4"
                />
              </div>
            ))}
          </div>
        </div>

        {/* System Preferences */}
        <div className="p-6 border rounded-lg shadow-sm bg-white space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" /> System & Security
          </h2>
          <p className="text-sm text-gray-600">
            Security & encryption enabled. Auto-backup every 24 hours.
          </p>

          <button className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">
            Reset System Cache
          </button>
        </div>

        {/* Staff Controls */}
        <div className="p-6 border rounded-lg shadow-sm bg-white space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <UserCog className="h-5 w-5 text-purple-600" /> Staff Controls
          </h2>
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            Manage Access Permissions
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
