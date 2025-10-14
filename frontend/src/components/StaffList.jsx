// frontend/src/pages/StaffList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
// Assuming MainLayout is located at ../components/layout/MainLayout
import { MainLayout } from "../components/layout/MainLayout"; 

// =========================================================================
// UI COMPONENTS (MODALS & CARD)
// =========================================================================

// Global utility to replace alert/confirm
const CustomModal = ({ isOpen, title, children, onClose, onConfirm, showConfirm = false, confirmLabel = "Confirm", variant = "default" }) => {
    if (!isOpen) return null;

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

// Form for Adding New Staff
const StaffFormModal = ({ onClose, onSave, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        contact: '',
        shift: '',
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <CustomModal 
            isOpen={true} 
            title={"Add New Staff Member"} 
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required 
                        className="border rounded-lg px-3 py-2 w-full focus:ring-indigo-500 focus:border-indigo-500" />
                    <input type="text" name="role" placeholder="Role (e.g., Nurse, Caretaker)" value={formData.role} onChange={handleChange} required 
                        className="border rounded-lg px-3 py-2 w-full focus:ring-indigo-500 focus:border-indigo-500" />
                    <input type="text" name="contact" placeholder="Contact/Phone" value={formData.contact} onChange={handleChange} 
                        className="border rounded-lg px-3 py-2 w-full focus:ring-indigo-500 focus:border-indigo-500" />
                    <input type="text" name="shift" placeholder="Shift (e.g., Morning, Night)" value={formData.shift} onChange={handleChange}
                        className="border rounded-lg px-3 py-2 w-full focus:ring-indigo-500 focus:border-indigo-500" />
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex justify-end">
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isLoading ? "Adding..." : "Add Staff"}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

// Staff Card Component
const StaffCard = ({ person, onDelete, onEdit }) => {
    // Determine shift status for styling
    let shiftColor = 'bg-gray-200 text-gray-700';
    if (person.shift?.toLowerCase().includes('morning')) {
        shiftColor = 'bg-yellow-100 text-yellow-700';
    } else if (person.shift?.toLowerCase().includes('night')) {
        shiftColor = 'bg-blue-100 text-blue-700';
    } else if (person.role?.toLowerCase().includes('nurse')) {
        shiftColor = 'bg-green-100 text-green-700';
    }
    
    // Placeholder image
    const imagePlaceholder = "https://placehold.co/50x50/indigo/ffffff?text=S";

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <img src={imagePlaceholder} alt={person.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{person.name}</h3>
                        <p className="text-sm text-indigo-600 font-semibold">{person.role || 'N/A'}</p>
                    </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${shiftColor}`}>
                    {person.shift || 'No Shift'}
                </span>
            </div>

            <div className="space-y-3 text-sm text-gray-600 border-t pt-4 mt-4">
                <p className="flex items-center">
                    <i className="bi bi-person-lines-fill text-gray-500 mr-2"></i>
                    ID: <span className="ml-1 font-medium text-gray-700">{person.id}</span>
                </p>
                <p className="flex items-center">
                    <i className="bi bi-telephone-fill text-green-500 mr-2"></i>
                    Contact: <span className="ml-1 font-medium text-gray-700">{person.contact || 'N/A'}</span>
                </p>
            </div>

            <div className="mt-5 flex space-x-3">
                <button onClick={() => onEdit(person)}
                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-2 rounded-lg transition-colors text-sm shadow-sm"
                >
                    <i className="bi bi-pencil-square mr-1"></i> Edit
                </button>
                <button onClick={() => onDelete(person)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm shadow-md"
                >
                    <i className="bi bi-trash-fill mr-1"></i> Delete
                </button>
            </div>
        </div>
    );
};


// =========================================================================
// MAIN STAFF LIST COMPONENT
// =========================================================================

export default function StaffList() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentStaff, setCurrentStaff] = useState(null); // Used for both edit and delete
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [feedbackVariant, setFeedbackVariant] = useState('default');
    const [searchTerm, setSearchTerm] = useState('');

    // --- Feedback / Alert Handler ---
    const showFeedback = (message, variant = 'default') => {
        setFeedbackMessage(message);
        setFeedbackVariant(variant);
        setTimeout(() => setFeedbackMessage(null), 3000); 
    };

    // --- R (Read) ---
    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5001/staff");
            setStaff(res.data);
        } catch (err) {
            console.error("Error fetching staff:", err);
            showFeedback("Failed to load staff data. Check backend on port 5001.", 'destructive');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    // --- C (Create) ---
    const handleSave = async (formData) => {
        setLoading(true);
        try {
            await axios.post("http://localhost:5001/staff", formData);
            showFeedback(`Staff member ${formData.name} added successfully!`, 'success');
            setIsFormOpen(false);
            fetchStaff(); // Refresh list
        } catch (err) {
            console.error("Error adding staff:", err);
            showFeedback(`Failed to add staff member. Error: ${err.response?.data?.message || err.message}`, 'destructive');
        } finally {
            setLoading(false);
        }
    };

    // --- D (Delete) ---
    const handleDeleteConfirm = async () => {
        if (!currentStaff || !currentStaff.id) return;
        
        setIsDeleteOpen(false);
        setLoading(true);

        try {
            await axios.delete(`http://localhost:5001/staff/${currentStaff.id}`);
            showFeedback(`Staff member ${currentStaff.name} deleted successfully!`, 'success');
            fetchStaff();
        } catch (err) {
            console.error("Error deleting staff:", err);
            showFeedback(`Failed to delete staff member. Error: ${err.message}`, 'destructive');
        } finally {
            setLoading(false);
            setCurrentStaff(null);
        }
    };

    // Helper functions for modal state
    const handleOpenAdd = () => {
        setCurrentStaff(null);
        setIsFormOpen(true);
    };

    const handleOpenDelete = (person) => {
        setCurrentStaff(person);
        setIsDeleteOpen(true);
    };

    // Placeholder for future Edit
    const handleOpenEdit = (person) => {
        showFeedback(`Edit functionality for ${person.name} coming soon!`);
        // setCurrentStaff(person);
        // setIsFormOpen(true);
    };
    
    // --- Search Filtering Logic ---
    const filteredStaff = staff.filter(person => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return (
            (person.name && person.name.toLowerCase().includes(lowerCaseSearch)) ||
            (person.role && person.role.toLowerCase().includes(lowerCaseSearch)) ||
            (person.shift && person.shift.toLowerCase().includes(lowerCaseSearch))
        );
    });

    // --- Render ---
    return (
        <MainLayout>
            <div className="p-8 max-w-7xl mx-auto">
                {/* Feedback Message */}
                {feedbackMessage && (
                    <div className={`mb-4 p-3 rounded-lg text-sm font-medium transition-opacity duration-300 ${
                        feedbackVariant === 'destructive' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {feedbackMessage}
                    </div>
                )}
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
                    {/* Add Staff button and Refresh button */}
                    <div className="flex space-x-3">
                        <button
                            onClick={handleOpenAdd}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-md flex items-center"
                        >
                            <i className="bi bi-plus-lg mr-2"></i>
                            Add New Staff
                        </button>
                        <button
                            onClick={fetchStaff}
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
                            placeholder="Search staff by Name, Role, or Shift..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                        <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>

                {/* Staff Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.length === 0 && !loading ? (
                        <div className="col-span-full text-center py-20 text-gray-500 border-4 border-dashed border-gray-200 rounded-lg bg-gray-50">
                            <p className="text-lg font-medium">
                                {searchTerm 
                                    ? `No staff members found matching "${searchTerm}".` 
                                    : "No staff members found. Add one using the button above!"
                                }
                            </p>
                        </div>
                    ) : (
                        filteredStaff.map(person => (
                            <StaffCard 
                                key={person.id} 
                                person={person} 
                                onDelete={handleOpenDelete}
                                onEdit={handleOpenEdit} // This is currently a placeholder
                            />
                        ))
                    )}
                </div>

                {/* Add Modal */}
                {isFormOpen && (
                    <StaffFormModal
                        onClose={() => setIsFormOpen(false)}
                        onSave={handleSave}
                        isLoading={loading}
                    />
                )}
                
                {/* Delete Confirmation Modal */}
                {isDeleteOpen && currentStaff && (
                    <CustomModal
                        isOpen={isDeleteOpen}
                        title="Confirm Staff Deletion"
                        onClose={() => setIsDeleteOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        showConfirm={true}
                        confirmLabel="Delete"
                        variant="destructive"
                    >
                        <p className="text-gray-700">Are you sure you want to permanently delete staff member <span className="font-bold">{currentStaff.name} ({currentStaff.role})</span>? This action cannot be undone.</p>
                    </CustomModal>
                )}
            </div>
        </MainLayout>
    );
}