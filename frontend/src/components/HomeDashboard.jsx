import React, { useEffect, useState } from "react";
import axios from "axios";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Heart,
  UserCog,
  DollarSign,
  Calendar,
  Shield,
  AlertTriangle,
  Activity,
} from "lucide-react";

export default function HomeDashboard() {
  const [stats, setStats] = useState({
    residents: 0,
    staff: 0,
    donations: 0,
  });
  const [healthAlerts, setHealthAlerts] = useState([]);

  // Fetch dashboard stats
  useEffect(() => {
    axios
      .get("http://localhost:5001/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  // Fetch health alerts
  useEffect(() => {
    axios
      .get("http://localhost:5001/health")
      .then((res) => {
        const criticals = res.data.filter(
          (r) => r.status === "Critical" || r.status === "Warning"
        );
        setHealthAlerts(criticals.slice(0, 5)); // only latest 5
      })
      .catch((err) => console.error("Error fetching health alerts:", err));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Good Morning, Dr. Ayushman Khan
            </h1>
            <p className="text-muted-foreground mt-1">
              Here’s your facility overview for today
            </p>
          </div>
          <Button variant="premium">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Review
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Residents"
            value={stats.residents}
            icon={<Users className="h-5 w-5" />}
            trend={{ value: "+3 this month", type: "positive" }}
          />
          <StatsCard
            title="Health Alerts"
            value={healthAlerts.length}
            icon={<Heart className="h-5 w-5 text-red-500" />}
            trend={{ value: "Live criticals", type: "neutral" }}
          />
          <StatsCard
            title="Staff on Duty"
            value={stats.staff}
            icon={<UserCog className="h-5 w-5" />}
            trend={{ value: "Full capacity", type: "positive" }}
          />
          <StatsCard
            title="Monthly Donations"
            value={`$${stats.donations.toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: "85% utilized", type: "neutral" }}
          />
        </div>

        {/* Recent Health Alerts */}
        <Card className="shadow-sm border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-red-600">
              <AlertTriangle className="h-5 w-5" /> Recent Health Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthAlerts.length > 0 ? (
              <div className="space-y-4">
                {healthAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex justify-between items-center border rounded-lg p-4 bg-red-50 hover:bg-red-100 transition"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {alert.residentName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {alert.heartRate
                          ? `Heart Rate: ${alert.heartRate} bpm`
                          : ""}
                        {alert.bloodPressure
                          ? ` | BP: ${alert.bloodPressure}`
                          : ""}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        alert.status === "Critical"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent critical alerts 🎉</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-3 hover:bg-accent"
              onClick={() => (window.location.href = "/residents")}
            >
              <Users className="h-7 w-7 text-primary" />
              <span className="font-semibold">Manage Residents</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-3 hover:bg-accent"
              onClick={() => (window.location.href = "/staff")}
            >
              <UserCog className="h-7 w-7 text-teal-600" />
              <span className="font-semibold">Manage Staff</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-3 hover:bg-accent"
              onClick={() => (window.location.href = "/health")}
            >
              <Heart className="h-7 w-7 text-red-600" />
              <span className="font-semibold">Health Check</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-3 hover:bg-accent"
              onClick={() => (window.location.href = "/safety")}
            >
              <Shield className="h-7 w-7 text-blue-600" />
              <span className="font-semibold">Safety Report</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
