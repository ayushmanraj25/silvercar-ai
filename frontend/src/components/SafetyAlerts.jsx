import React, { useEffect, useState } from "react";
import axios from "axios";
import { MainLayout } from "../components/layout/MainLayout";
import { ShieldAlert, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SafetyAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = () => {
    setLoading(true);
    axios
      .get("http://localhost:5001/alerts")
      .then((res) => setAlerts(res.data))
      .catch((err) => console.error("Error fetching alerts:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-blue-600" />
              Safety Alerts
            </h1>
            <p className="text-gray-500">
              AI-generated emergency and health risk alerts
            </p>
          </div>

          <Button variant="outline" onClick={fetchAlerts}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 p-4 rounded-md shadow-sm ${
                alert.level === "Critical"
                  ? "border-red-500 bg-red-50"
                  : alert.level === "Warning"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-green-500 bg-green-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <AlertCircle
                    className={`h-5 w-5 ${
                      alert.level === "Critical"
                        ? "text-red-500"
                        : alert.level === "Warning"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(alert.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <p className="text-gray-500 text-center">No active safety alerts.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
