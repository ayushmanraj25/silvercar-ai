import React, { useState, useEffect } from "react";
import axios from "axios";
import { MainLayout } from "./layout/MainLayout";
import { Users, Pencil, Trash2, Calendar } from "lucide-react";

// -----------------------------
// MODAL COMPONENT
// -----------------------------
const Modal = ({ isOpen, title, children, onClose, onConfirm, showConfirm = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
        {showConfirm && (
          <div className="p-4 border-t flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// -----------------------------
// RESIDENT FORM MODAL
// -----------------------------
const ResidentFormModal = ({ resident, onClose, onSave, isLoading }) => {
  const [form, setForm] = useState({
    name: resident?.name || "",
    age: resident?.age || "",
    gender: resident?.gender || "Male",
    room: resident?.room || "",
    healthInfo: resident?.healthInfo || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal isOpen={true} title={resident ? "Edit Resident" : "Add New Resident"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Full Name *</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="font-medium">Age *</label>
            <input
              type="number"
              placeholder="Enter age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="font-medium">Gender *</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full border rounded-md p-2"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Room *</label>
            <input
              type="text"
              placeholder="e.g. 101, 205A"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div className="col-span-2">
            <label className="font-medium">Health Info</label>
            <textarea
              placeholder="e.g. Diabetes, Hypertension, etc."
              value={form.healthInfo}
              onChange={(e) => setForm({ ...form, healthInfo: e.target.value })}
              className="w-full border rounded-md p-2"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white ${
              isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {resident ? "Save Changes" : "Add Resident"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// -----------------------------
// MAIN RESIDENT LIST
// -----------------------------
export default function ResidentsList() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentResident, setCurrentResident] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Residents
  const fetchResidents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5001/residents");
      setResidents(res.data);
    } catch (err) {
      console.error("Error fetching residents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  // Save or Update Resident
  const handleSave = async (form) => {
    try {
      if (currentResident) {
        await axios.put(`http://localhost:5001/residents/${currentResident.id}`, form);
      } else {
        await axios.post("http://localhost:5001/residents", form);
      }
      fetchResidents();
      setIsFormOpen(false);
      setCurrentResident(null);
    } catch (err) {
      console.error("Error saving resident:", err);
    }
  };

  // Delete Resident
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5001/residents/${currentResident.id}`);
      fetchResidents();
      setIsDeleteOpen(false);
    } catch (err) {
      console.error("Error deleting resident:", err);
    }
  };

  // Filter for Search
  const filteredResidents = residents.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Residents</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setCurrentResident(null);
                setIsFormOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Users className="h-4 w-4 mr-2" /> Add Resident
            </button>
            <button
              onClick={fetchResidents}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
            >
              <Calendar className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by name or health info..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md w-full p-2 mb-6"
        />

        {/* Residents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResidents.length === 0 ? (
            <p className="text-gray-500">No residents found.</p>
          ) : (
            filteredResidents.map((resident) => (
              <div
                key={resident.id}
                className="bg-white shadow-md rounded-xl p-5 border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{resident.name}</h3>
                  <p className="text-gray-500 text-sm">
                    Age {resident.age} | {resident.gender}
                  </p>
                  <p className="mt-2 text-gray-700">
                    <strong>Room:</strong> {resident.room || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Health:</strong> {resident.healthInfo || "Fine"}
                  </p>
                </div>

                <div className="flex space-x-3 pt-4 border-t mt-4">
                  <button
                    onClick={() => {
                      setCurrentResident(resident);
                      setIsFormOpen(true);
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 flex items-center justify-center"
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setCurrentResident(resident);
                      setIsDeleteOpen(true);
                    }}
                    className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        {isFormOpen && (
          <ResidentFormModal
            resident={currentResident}
            onClose={() => setIsFormOpen(false)}
            onSave={handleSave}
            isLoading={loading}
          />
        )}

        {/* Delete Modal */}
        {isDeleteOpen && currentResident && (
          <Modal
            isOpen={isDeleteOpen}
            title="Delete Resident"
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDeleteConfirm}
            showConfirm={true}
          >
            <p>
              Are you sure you want to delete{" "}
              <strong>{currentResident.name}</strong>?
            </p>
          </Modal>
        )}
      </div>
    </MainLayout>
  );
}
