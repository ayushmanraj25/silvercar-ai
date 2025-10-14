import React, { useEffect, useState } from "react";
import axios from "axios";
import { MainLayout } from "../components/layout/MainLayout";
import { HeartPulse, Activity, AlertTriangle } from "lucide-react";

export default function HealthMonitor() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/health")
      .then((res) => setRecords(res.data))
      .catch((err) => console.error("Error fetching health data:", err));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-red-500" />
            Health Monitor
          </h1>
          <p className="text-gray-500">Live health records of residents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((r) => (
            <div
              key={r.id}
              className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">{r.residentName}</h2>
                {r.status === "Critical" ? (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                ) : (
                  <Activity className="h-5 w-5 text-green-500" />
                )}
              </div>
              <p className="text-sm text-gray-600">
                <strong>Heart Rate:</strong> {r.heartRate} bpm
              </p>
              <p className="text-sm text-gray-600">
                <strong>Blood Pressure:</strong> {r.bloodPressure}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    r.status === "Critical"
                      ? "text-red-600"
                      : r.status === "Warning"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {r.status}
                </span>
              </p>
            </div>
          ))}
        </div>

        {records.length === 0 && (
          <p className="text-gray-500 text-center">No health data available.</p>
        )}
      </div>
    </MainLayout>
  );
}
