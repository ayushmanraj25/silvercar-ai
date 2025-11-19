import React, { useState, useEffect } from "react";
import axios from "axios";
import { MainLayout } from "./layout/MainLayout";
import { HeartPulse, Pencil, Trash2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/* =============== MODAL COMPONENT =============== */
const Modal = ({ isOpen, title, children, onClose, onConfirm, showConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 text-xl">×</button>
        </div>

        <div className="p-6">{children}</div>

        {showConfirm && (
          <div className="p-4 border-t flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="destructive" onClick={onConfirm}>Confirm</Button>
          </div>
        )}
      </div>
    </div>
  );
};

/* =============== FORM MODAL =============== */
const HealthFormModal = ({ record, onClose, onSave, isLoading }) => {
  const [form, setForm] = useState({
    residentName: record?.residentName || "",
    age: record?.age || "",
    gender: record?.gender || "Male",
    heartRate: record?.heartRate || "",
    bloodPressure: record?.bloodPressure || "",
    temperature: record?.temperature || "",
    oxygenLevel: record?.oxygenLevel || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal
      isOpen={true}
      title={record ? "Edit Health Record" : "Add New Health Record"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label>Resident Name *</label>
            <input
              type="text"
              value={form.residentName}
              onChange={(e) => setForm({ ...form, residentName: e.target.value })}
              required
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label>Age *</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              required
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label>Gender</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full border rounded-md p-2"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label>Heart Rate (bpm)</label>
            <input
              type="number"
              value={form.heartRate}
              onChange={(e) => setForm({ ...form, heartRate: e.target.value })}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label>Blood Pressure (120/80)</label>
            <input
              type="text"
              value={form.bloodPressure}
              onChange={(e) =>
                setForm({ ...form, bloodPressure: e.target.value })
              }
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label>Temperature (°F)</label>
            <input
              type="number"
              value={form.temperature}
              onChange={(e) =>
                setForm({ ...form, temperature: e.target.value })
              }
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label>Oxygen (%)</label>
            <input
              type="number"
              value={form.oxygenLevel}
              onChange={(e) =>
                setForm({ ...form, oxygenLevel: e.target.value })
              }
              className="w-full border rounded-md p-2"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            className="bg-blue-600 text-white"
            disabled={isLoading}
          >
            {record ? "Save Changes" : "Add Record"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

/* =============== MAIN PAGE =============== */
export default function HealthMonitor() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [search, setSearch] = useState("");

  const fetchRecords = async () => {
    setLoading(true);
    const res = await axios.get("http://localhost:5001/health");
    setRecords(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleSave = async (form) => {
    try {
      if (currentRecord) {
        await axios.put(`http://localhost:5001/health/${currentRecord.id}`, form);
      } else {
        await axios.post("http://localhost:5001/health", form);
      }
      fetchRecords();
      setIsFormOpen(false);
      setCurrentRecord(null);
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    await axios.delete(`http://localhost:5001/health/${currentRecord.id}`);
    fetchRecords();
    setIsDeleteOpen(false);
  };

  const filtered = records.filter((r) =>
    r.residentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-8 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HeartPulse className="h-7 w-7 text-red-500" /> Health Monitor
          </h1>

          <div className="flex gap-3">
            <Button className="bg-blue-600 text-white"
              onClick={() => { setCurrentRecord(null); setIsFormOpen(true); }}>
              + Add Record
            </Button>

            <Button variant="outline" onClick={fetchRecords}>
              <RefreshCcw className={`${loading ? "animate-spin" : ""} mr-2`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md w-full p-2 mb-6"
        />

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rec) => (
            <div
              key={rec.id}
              className={`p-5 rounded-xl shadow border ${
                rec.status === "Critical"
                  ? "bg-red-50 border-red-300"
                  : rec.status === "Warning"
                  ? "bg-yellow-50 border-yellow-300"
                  : "bg-green-50 border-green-300"
              }`}
            >
              <h3 className="font-bold text-lg">{rec.residentName}</h3>
              <p>Age {rec.age} | {rec.gender}</p>
              <p><b>HR:</b> {rec.heartRate}</p>
              <p><b>BP:</b> {rec.bloodPressure}</p>
              <p><b>Temp:</b> {rec.temperature}</p>
              <p><b>Oxygen:</b> {rec.oxygenLevel}%</p>

              {/* ⭐ AI RISK SCORE FIXED */}
              <p className="mt-1">
                <b>AI Risk Score:</b>{" "}
                <span
                  className={
                    rec.riskScore > 70
                      ? "text-red-600"
                      : rec.riskScore > 40
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                >
                  {rec.riskScore ?? 0}/100
                </span>
              </p>

              <p className="mt-1">
                <b>Status: </b>
                <span
                  className={
                    rec.status === "Critical"
                      ? "text-red-600"
                      : rec.status === "Warning"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                >
                  {rec.status}
                </span>
              </p>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => {
                  setCurrentRecord(rec);
                  setIsFormOpen(true);
                }}>
                  <Pencil className="h-4" /> Edit
                </Button>

                <Button variant="destructive" onClick={() => {
                  setCurrentRecord(rec);
                  setIsDeleteOpen(true);
                }}>
                  <Trash2 className="h-4" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* MODALS */}
        {isFormOpen && (
          <HealthFormModal
            record={currentRecord}
            onClose={() => setIsFormOpen(false)}
            onSave={handleSave}
            isLoading={loading}
          />
        )}

        {isDeleteOpen && (
          <Modal
            isOpen={true}
            title="Delete Health Record"
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDeleteConfirm}
            showConfirm={true}
          >
            Are you sure you want to delete{" "}
            <b>{currentRecord?.residentName}</b>?
          </Modal>
        )}

      </div>
    </MainLayout>
  );
}
