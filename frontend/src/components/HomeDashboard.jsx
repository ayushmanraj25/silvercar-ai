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
  Sparkles,
} from "lucide-react";

export default function HomeDashboard() {
  const [stats, setStats] = useState({
    residents: 0,
    staff: 0,
    donations: 0,
    criticalAlerts: 0,
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

  const criticalCount = healthAlerts.filter((a) => a.status === "Critical").length;
  const warningCount = healthAlerts.filter((a) => a.status === "Warning").length;

  const aiSummaryText =
    criticalCount > 0
      ? `AI flags ${criticalCount} critical and ${warningCount} warning cases.`
      : warningCount > 0
      ? `AI detected ${warningCount} warning cases. Monitor closely.`
      : "All residents are stable. No risky vitals detected.";

  const aiSummaryTone =
    criticalCount > 0
      ? "text-red-400"
      : warningCount > 0
      ? "text-amber-400"
      : "text-emerald-400";

  return (
    <MainLayout>
      <div className="space-y-7">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
              SilverCare AI · Control Center
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 flex items-center gap-2">
              Good Morning,{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
                Dr. Ayushman Khan
              </span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Live overview of residents, staff, donations and AI health insights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-emerald-500" />
                System status: <span className="font-medium text-emerald-600">Online</span>
              </span>
              <span>Synced with AI health engine</span>
            </div>
            
          </div>
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
            icon={
              <Heart
                className={`h-5 w-5 ${
                  healthAlerts.length > 0 ? "text-red-500 animate-pulse" : "text-rose-400"
                }`}
              />
            }
            trend={{ value: "AI-monitored vitals", type: "neutral" }}
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

        {/* AI Health Insight Strip */}
        <Card className="border border-indigo-100 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-900 text-slate-50 shadow-md">
          <CardContent className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-indigo-300" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-indigo-200 uppercase">
                  AI Health Summary
                </p>
                <p className={`text-sm md:text-base font-medium ${aiSummaryTone}`}>
                  {aiSummaryText}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-indigo-300/40 bg-indigo-500/10 text-indigo-100 hover:bg-indigo-500/20"
              onClick={() => (window.location.href = "/health")}
            >
              View Monitor
            </Button>
          </CardContent>
        </Card>

        {/* Recent Health Alerts */}
        <Card className="shadow-sm border border-border/70 bg-white/70 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-red-600">
              <AlertTriangle className="h-5 w-5" /> Recent Health Alerts
              {healthAlerts.length > 0 && (
                <span className="ml-2 text-xs rounded-full px-2 py-0.5 bg-red-100 text-red-700">
                  Live · {healthAlerts.length}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthAlerts.length > 0 ? (
              <div className="space-y-3">
                {healthAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex justify-between items-center border rounded-xl px-4 py-3 bg-gradient-to-r from-red-50 via-amber-50 to-white hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        {alert.residentName}
                        <span className="text-xs text-gray-500">
                          Age {alert.age ?? "–"} · {alert.gender || "N/A"}
                        </span>
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">
                        {alert.heartRate && (
                          <span>
                            HR: <span className="font-medium">{alert.heartRate} bpm</span>
                          </span>
                        )}
                        {alert.bloodPressure && (
                          <span>
                            {" "}
                            · BP:{" "}
                            <span className="font-medium">{alert.bloodPressure}</span>
                          </span>
                        )}
                        {alert.oxygenLevel && (
                          <span>
                            {" "}
                            · SpO₂:{" "}
                            <span className="font-medium">{alert.oxygenLevel}%</span>
                          </span>
                        )}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs md:text-sm font-semibold rounded-full ${
                        alert.status === "Critical"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 flex items-center gap-2">
                <span>🎉</span> No recent critical alerts. All residents look stable.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm border border-border/70 bg-white/80 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-3 border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:-translate-y-0.5 hover:shadow-md transition-all group"
              onClick={() => (window.location.href = "/residents")}
            >
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-slate-50 flex items-center justify-center group-hover:scale-105 transition">
                <Users className="h-5 w-5" />
              </div>
              <span className="font-semibold text-sm">Manage Residents</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-3 border-emerald-100 bg-emerald-50/60 hover:bg-emerald-100 hover:-translate-y-0.5 hover:shadow-md transition-all group"
              onClick={() => (window.location.href = "/staff")}
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition">
                <UserCog className="h-5 w-5" />
              </div>
              <span className="font-semibold text-sm">Manage Staff</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-3 border-rose-100 bg-rose-50/60 hover:bg-rose-100 hover:-translate-y-0.5 hover:shadow-md transition-all group"
              onClick={() => (window.location.href = "/health")}
            >
              <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center group-hover:scale-105 transition">
                <Heart className="h-5 w-5" />
              </div>
              <span className="font-semibold text-sm">Health Check</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-3 border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100 hover:-translate-y-0.5 hover:shadow-md transition-all group"
              onClick={() => (window.location.href = "/alerts")}
            >
              <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:scale-105 transition">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-semibold text-sm">Safety Report</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
