import React, { useEffect, useState } from "react";
import axios from "axios";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { HeartPulse, AlertTriangle, Activity, PlusCircle } from "lucide-react";

export default function HealthMonitor() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    residentName: "",
    heartRate: "",
    bloodPressure: "",
    status: "Normal",
  });

  // ✅ Fetch all records
  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:5001/health");
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching health data:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ✅ Add new record
  const addRecord = async () => {
    if (!form.residentName || !form.heartRate || !form.bloodPressure)
      return alert("All fields are required!");

    try {
      await axios.post("http://localhost:5001/health", form);
      setForm({
        residentName: "",
        heartRate: "",
        bloodPressure: "",
        status: "Normal",
      });
      fetchRecords();
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };

  // ✅ Delete record
  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this health record?")) return;
    try {
      await axios.delete(`http://localhost:5001/health/${id}`);
      fetchRecords();
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-red-500" />
            Health Monitor
          </h1>
          <div className="flex gap-3">
            <Button onClick={addRecord} className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Record
            </Button>
            <Button onClick={fetchRecords} variant="outline">
              Refresh
            </Button>
          </div>
        </div>

        {/* Add New Form */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Resident Name"
            value={form.residentName}
            onChange={(e) => setForm({ ...form, residentName: e.target.value })}
            className="border rounded-md p-2"
          />
          <input
            type="number"
            placeholder="Heart Rate"
            value={form.heartRate}
            onChange={(e) => setForm({ ...form, heartRate: e.target.value })}
            className="border rounded-md p-2"
          />
          <input
            type="text"
            placeholder="Blood Pressure (e.g. 120/80)"
            value={form.bloodPressure}
            onChange={(e) =>
              setForm({ ...form, bloodPressure: e.target.value })
            }
            className="border rounded-md p-2"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border rounded-md p-2"
          >
            <option value="Normal">Normal</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((r) => (
            <div
              key={r.id}
              className={`rounded-lg shadow-sm p-5 border transition-all hover:shadow-md ${
                r.status === "Critical"
                  ? "bg-red-50 border-red-400"
                  : r.status === "Warning"
                  ? "bg-yellow-50 border-yellow-300"
                  : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">{r.residentName}</h2>
                {r.status === "Critical" ? (
                  <AlertTriangle className="text-red-500 h-5 w-5" />
                ) : (
                  <Activity className="text-green-500 h-5 w-5" />
                )}
              </div>
              <p>
                <strong>Heart Rate:</strong> {r.heartRate} bpm
              </p>
              <p>
                <strong>Blood Pressure:</strong> {r.bloodPressure}
              </p>
              <p>
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

              <div className="flex justify-end gap-3 mt-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteRecord(r.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {records.length === 0 && (
          <p className="text-gray-500 text-center">
            No health data available yet.
          </p>
        )}
      </div>
    </MainLayout>
  );
}
