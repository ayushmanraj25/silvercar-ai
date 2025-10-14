// frontend/src/components/ResidentsList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// FIX: Changed import path from "../layout/MainLayout" to "./layout/MainLayout"
// assuming MainLayout is located in frontend/src/components/layout/MainLayout.jsx
import { MainLayout } from "./layout/MainLayout";

// =========================================================================
// UI COMPONENTS (MODALS & CARD)
// =========================================================================

// Global utility to replace alert/confirm
const CustomModal = ({ isOpen, title, children, onClose, onConfirm, showConfirm = false, confirmLabel = "Confirm", variant = "default" }) => {
    if (!isOpen) return null;

    // Fixed primary color to indigo-600/indigo-700 for guaranteed visibility
    const confirmClasses = variant === "destructive" 
        ? "bg-red-600 hover:bg-red-700" 
        : "bg-indigo-600 hover:bg-indigo-700";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <div className="p-6">
                    {children}
                </div>
                <div className="p-4 border-t border-gray-100 flex justify-end space-x-3">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    {showConfirm && (
                        <button 
                            onClick={onConfirm} 
                            className={`px-4 py-2 text-white font-medium rounded-lg transition-colors ${confirmClasses}`}
                        >
                            {confirmLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Form for Adding or Editing a Resident
const ResidentFormModal = ({ resident, onClose, onSave, isLoading }) => {
    const [formData, setFormData] = useState({
        name: resident?.name || '',
        age: resident?.age || '',
        gender: resident?.gender || '',
        healthInfo: resident?.healthInfo || '',
        room: resident?.room || '',
    });
    
    const isEditMode = !!resident;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ 
            ...formData, 
            age: parseInt(formData.age, 10) 
        });
    };

    return (
        <CustomModal 
            isOpen={true} 
            title={isEditMode ? `Edit Resident: ${resident.name}` : "Add New Resident"} 
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required 
                        className="border rounded-lg px-3 py-2 w-full focus:ring-indigo-500 focus:border-indigo-500" />
                    <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required 
                        className="border rounded-lg px-3 py-2 w-full focus:ring-indigo-500 focus:border-indigo-500" />
                    <select name="gender" value={formData.gender} onChange={handleChange} required 
                        className="border rounded-lg px-3 py-2 w-full focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <input type="text" name="room" placeholder="Room Number (e.g., 101)" value={formData.room} onChange={handleChange}
                        className="border rounded-lg px-3 py-2 w-full focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <textarea name="healthInfo" placeholder="Health Information/Conditions" value={formData.healthInfo} onChange={handleChange} rows="3"
                    className="border rounded-lg px-3 py-2 w-full focus:ring-indigo-500 focus:border-indigo-500"></textarea>

                {/* Submit Button */}
                <div className="pt-2 flex justify-end">
                    <button 
                        type="submit"
                        disabled={isLoading}
                        // Fixed primary color to indigo-600/indigo-700 for guaranteed visibility
                        className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isLoading ? (isEditMode ? "Saving..." : "Adding...") : (isEditMode ? "Save Changes" : "Add Resident")}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

// Resident Card Component (Enhanced for CRUD and AI Risk)
const ResidentCard = ({ resident, onEdit, onDelete, onPredictRisk, isPredicting }) => {
    // Determine status and set corresponding styles (Using simple 'Stable' since riskLevel is paused)
    const statusColor = resident.healthStatus === 'Stable' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';
    const statusLabel = resident.healthStatus || 'Stable';

    // Placeholder image
    const imagePlaceholder = resident.gender?.toLowerCase() === 'female' 
        ? "https://placehold.co/50x50/f06292/ffffff?text=F" 
        : "https://placehold.co/50x50/4fc3f7/ffffff?text=M";

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <img src={imagePlaceholder} alt={resident.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{resident.name}</h3>
                        <p className="text-sm text-gray-500">Age {resident.age || 'N/A'} - Room {resident.room || 'N/A'}</p>
                    </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${statusColor}`}>
                    {statusLabel}
                </span>
            </div>

            <div className="space-y-3 text-sm text-gray-600 border-t pt-4 mt-4">
                <p className="flex items-center">
                    <i className="bi bi-heart-pulse text-red-500 mr-2"></i>
                    Health Info: <span className="ml-1 font-medium text-gray-700">{resident.healthInfo || resident.conditions || 'None recorded'}</span>
                </p>
                <p className="flex items-center">
                    <i className="bi bi-clock-history text-indigo-600 mr-2"></i>
                    Gender: <span className="ml-1 font-medium text-gray-700 capitalize">{resident.gender}</span>
                </p>
            </div>

            {/* Note: AI Predict button is removed or commented out until feature is re-enabled */}

            <div className="mt-5 flex space-x-3">
                <button onClick={() => onEdit(resident)}
                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-2 rounded-lg transition-colors text-sm shadow-sm"
                >
                    <i className="bi bi-pencil-square mr-1"></i> Edit
                </button>
                <button onClick={() => onDelete(resident)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm shadow-md"
                >
                    <i className="bi bi-trash-fill mr-1"></i> Delete
                </button>
            </div>
        </div>
    );
};


// =========================================================================
// MAIN RESIDENTS LIST COMPONENT (CRUD & AI LOGIC)
// =========================================================================

export default function ResidentsList() {
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentResident, setCurrentResident] = useState(null); // Used for both edit and delete
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [feedbackVariant, setFeedbackVariant] = useState('default');
    const [searchTerm, setSearchTerm] = useState('');
    // const [isPredicting, setIsPredicting] = useState(false); // AI state paused

    // --- Feedback / Alert Handler ---
    const showFeedback = (message, variant = 'default') => {
        setFeedbackMessage(message);
        setFeedbackVariant(variant);
        setTimeout(() => setFeedbackMessage(null), 5000); // Increased visibility time for important messages
    };

    // --- C (Create) & R (Read) ---
    const fetchResidents = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5001/residents");
            setResidents(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching residents:", err);
            showFeedback("Failed to load residents. Check backend on port 5001.", 'destructive');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, []);

    // --- C (Create) & U (Update) ---
    const handleSave = async (formData) => {
        setLoading(true);
        try {
            if (currentResident && currentResident.id) {
                // Update (U) - NOT YET FULLY IMPLEMENTED IN BACKEND
                await axios.put(`http://localhost:5001/residents/${currentResident.id}`, formData);
                showFeedback(`Resident ${formData.name} updated successfully!`);
            } else {
                // Create (C)
                await axios.post("http://localhost:5001/residents", formData);
                showFeedback(`Resident ${formData.name} added successfully!`, 'success');
            }
            setIsFormOpen(false);
            setCurrentResident(null);
            fetchResidents(); // Refresh list
        } catch (err) {
            console.error("Error saving resident:", err);
            showFeedback(`Failed to save resident. Error: ${err.response?.data?.message || err.message}`, 'destructive');
        } finally {
            setLoading(false);
        }
    };

    // --- D (Delete) ---
    const handleDeleteConfirm = async () => {
        // FIX: Ensure 'id' exists and use it correctly for Prisma-based backend
        if (!currentResident || !currentResident.id) return;
        
        setIsDeleteOpen(false);
        setLoading(true);

        try {
            // NOTE: The ID here is assumed to be 'id' based on Prisma/PostgreSQL primary key
            await axios.delete(`http://localhost:5001/residents/${currentResident.id}`);
            showFeedback(`Resident ${currentResident.name} deleted successfully!`, 'success');
            fetchResidents();
        } catch (err) {
            console.error("Error deleting resident:", err);
            showFeedback(`Failed to delete resident. Error: ${err.message}`, 'destructive');
        } finally {
            setLoading(false);
            setCurrentResident(null);
        }
    };
    
    // --- AI Risk Prediction Logic (PAUSED) ---
    const handlePredictRisk = (resident) => {
        showFeedback(`AI Prediction for ${resident.name} is currently paused.`, 'default');
    };

    // Helper functions for modal state
    const handleOpenAdd = () => {
        setCurrentResident(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (resident) => {
        setCurrentResident(resident);
        setIsFormOpen(true);
    };
    
    const handleOpenDelete = (resident) => {
        setCurrentResident(resident);
        setIsDeleteOpen(true);
    };
    
    // --- Search Filtering Logic ---
    const filteredResidents = residents.filter(resident => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        // Check for null/undefined to prevent errors if data is incomplete
        return (
            (resident.name && resident.name.toLowerCase().includes(lowerCaseSearch)) ||
            (resident.room && resident.room.toLowerCase().includes(lowerCaseSearch)) ||
            (resident.healthInfo && resident.healthInfo.toLowerCase().includes(lowerCaseSearch)) ||
            (resident.age && resident.age.toString().includes(lowerCaseSearch))
        );
    });

    // --- Render ---
    return (
        // WRAP the entire component content with MainLayout
        <MainLayout>
            <div className="p-8 max-w-7xl mx-auto">
                {/* Feedback Message */}
                {feedbackMessage && (
                    <div className={`mb-4 p-3 rounded-lg text-sm font-medium transition-opacity duration-300 ${
                        feedbackVariant === 'destructive' ? 'bg-red-100 text-red-700' : 
                        feedbackVariant === 'success' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                        {feedbackMessage}
                    </div>
                )}
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Resident Management</h1>
                    {/* New Add Resident button and Refresh button */}
                    <div className="flex space-x-3">
                        <button
                            onClick={handleOpenAdd}
                            // Replaced custom color with indigo-600 for visibility
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-md flex items-center"
                        >
                            <i className="bi bi-plus-lg mr-2"></i>
                            Add New Resident
                        </button>
                        <button
                            onClick={fetchResidents}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors shadow-sm flex items-center"
                        >
                            <i className={`bi bi-arrow-clockwise mr-2 ${loading ? 'animate-spin' : ''}`}></i>
                            {loading ? "Loading..." : "Refresh List"}
                        </button>
                    </div>
                </div>

                {/* Search Input Field */}
                <div className="mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search residents by Name, Room, Age, or Health Info..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                        <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>

                {/* Resident Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredResidents.length === 0 && !loading ? (
                        <div className="col-span-full text-center py-20 text-gray-500 border-4 border-dashed border-gray-200 rounded-lg bg-gray-50">
                            <p className="text-lg font-medium">
                                {searchTerm 
                                    ? `No residents found matching "${searchTerm}".` 
                                    : "No residents found. Add one using the button above!"
                                }
                            </p>
                        </div>
                    ) : (
                        filteredResidents.map(resident => (
                            <ResidentCard 
                                key={resident.id} 
                                resident={resident} 
                                onEdit={handleOpenEdit}
                                onDelete={handleOpenDelete}
                                onPredictRisk={handlePredictRisk}
                                isPredicting={false} // State paused
                            />
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
                
                {/* Delete Confirmation Modal */}
                {isDeleteOpen && currentResident && (
                    <CustomModal
                        isOpen={isDeleteOpen}
                        title="Confirm Deletion"
                        onClose={() => setIsDeleteOpen(false)}
                        // FIX: Ensure onConfirm calls the dedicated delete logic
                        onConfirm={handleDeleteConfirm} 
                        showConfirm={true}
                        confirmLabel="Delete"
                        variant="destructive"
                    >
                        <p className="text-gray-700">Are you sure you want to permanently delete resident <span className="font-bold">{currentResident.name}</span>? This action cannot be undone.</p>
                    </CustomModal>
                )}
            </div>
        </MainLayout>
    );
}