// frontend/src/pages/DonationsList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MainLayout } from "../components/layout/MainLayout";

// =========================================================================
// UI COMPONENTS (MODALS & CARD) - Reusing CustomModal from ResidentsList
// NOTE: For brevity, CustomModal is included here. If you have it globally, remove this.
// =========================================================================

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

// Form for Adding New Donation
const DonationFormModal = ({ onClose, onSave, isLoading }) => {
    // Note: The 'purpose' field is included in the form but is not in your current Prisma schema.
    const [formData, setFormData] = useState({
        donorName: '',
        amount: '',
        purpose: '', 
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
            title={"Record New Donation"} 
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Inputs */}
                <input type="text" name="donorName" placeholder="Donor Name" value={formData.donorName} onChange={handleChange} required 
                    className="border rounded-lg px-3 py-2 w-full focus:ring-indigo-500 focus:border-indigo-500" />
                <input type="number" name="amount" placeholder="Amount ($)" value={formData.amount} onChange={handleChange} required 
                    className="border rounded-lg px-3 py-2 w-full focus:ring-indigo-500 focus:border-indigo-500" />
                <textarea name="purpose" placeholder="Purpose (Optional)" value={formData.purpose} onChange={handleChange} rows="2"
                    className="border rounded-lg px-3 py-2 w-full focus:ring-indigo-500 focus:border-indigo-500"></textarea>

                {/* Submit Button */}
                <div className="pt-2 flex justify-end">
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isLoading ? "Saving..." : "Record Donation"}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

// Donation Card Component
const DonationCard = ({ donation, onDelete }) => {
    // Format date and amount
    const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(donation.amount);
    const date = new Date(donation.date || donation.createdAt).toLocaleDateString();
    
    // Determine card color based on amount (simple visual tier)
    let amountColor = 'bg-green-100 text-green-800';
    if (donation.amount > 500) {
        amountColor = 'bg-yellow-100 text-yellow-800';
    }
    if (donation.amount > 2000) {
        amountColor = 'bg-indigo-100 text-indigo-800';
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200 flex flex-col">
            
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <i className="bi bi-heart-fill text-red-500 text-2xl mr-3"></i>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{donation.donorName}</h3>
                        <p className="text-sm text-gray-500">Recorded on {date}</p>
                    </div>
                </div>
                <span className={`text-xl font-extrabold px-3 py-1 rounded-lg ${amountColor}`}>
                    {formattedAmount}
                </span>
            </div>
            
            <p className="text-sm text-gray-700 mt-2 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100 flex-grow">
                <span className="font-semibold text-gray-600">Purpose:</span> {donation.purpose || "General Operating Fund"}
            </p>

            <div className="mt-4 flex justify-end">
                <button onClick={() => onDelete(donation)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors text-sm shadow-md flex items-center"
                >
                    <i className="bi bi-trash-fill mr-1"></i> Remove Record
                </button>
            </div>
        </div>
    );
};

// =========================================================================
// MAIN DONATIONS LIST COMPONENT
// =========================================================================

export default function DonationsList() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentDonation, setCurrentDonation] = useState(null); 
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
    const fetchDonations = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5001/donations");
            setDonations(res.data);
        } catch (err) {
            console.error("Error fetching donations:", err);
            showFeedback("Failed to load donations data.", 'destructive');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    // --- C (Create) ---
    const handleSave = async (formData) => {
        setLoading(true);
        try {
            // Note: 'purpose' is sent but not saved unless you update your Prisma schema/backend
            await axios.post("http://localhost:5001/donations", {
                donorName: formData.donorName,
                amount: parseFloat(formData.amount),
                // purpose: formData.purpose, // Backend only expects donorName and amount for now
            }); 
            showFeedback(`Donation from ${formData.donorName} recorded successfully!`, 'success');
            setIsFormOpen(false);
            fetchDonations(); // Refresh list
        } catch (err) {
            console.error("Error adding donation:", err);
            showFeedback("Failed to add donation.", 'destructive');
        } finally {
            setLoading(false);
        }
    };

    // --- D (Delete) ---
    const handleDeleteConfirm = async () => {
        if (!currentDonation || !currentDonation.id) return;
        
        setIsDeleteOpen(false);
        setLoading(true);

        try {
            await axios.delete(`http://localhost:5001/donations/${currentDonation.id}`);
            showFeedback(`Donation deleted successfully!`, 'success');
            fetchDonations();
        } catch (err) {
            console.error("Error deleting donation:", err);
            showFeedback("Failed to delete donation record.", 'destructive');
        } finally {
            setLoading(false);
            setCurrentDonation(null);
        }
    };

    // Helper functions for modal state
    const handleOpenDelete = (donation) => {
        setCurrentDonation(donation);
        setIsDeleteOpen(true);
    };
    
    // --- Search Filtering Logic ---
    const filteredDonations = donations.filter(don => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return (
            (don.donorName && don.donorName.toLowerCase().includes(lowerCaseSearch)) ||
            (don.amount && don.amount.toString().includes(lowerCaseSearch)) ||
            (don.purpose && don.purpose.toLowerCase().includes(lowerCaseSearch)) 
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
                    <h1 className="text-3xl font-bold text-gray-900">Donations & Financials</h1>
                    {/* Add Donation button and Refresh button */}
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-md flex items-center"
                        >
                            <i className="bi bi-cash-stack mr-2"></i>
                            Record Donation
                        </button>
                        <button
                            onClick={fetchDonations}
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
                            placeholder="Search by Donor, Amount, or Purpose..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                        <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>

                {/* Donations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDonations.length === 0 && !loading ? (
                        <div className="col-span-full text-center py-20 text-gray-500 border-4 border-dashed border-gray-200 rounded-lg bg-gray-50">
                            <p className="text-lg font-medium">
                                {searchTerm 
                                    ? `No donations found matching "${searchTerm}".` 
                                    : "No donation records found. Record one now!"
                                }
                            </p>
                        </div>
                    ) : (
                        filteredDonations.map(don => (
                            <DonationCard 
                                key={don.id} 
                                donation={don} 
                                onDelete={handleOpenDelete}
                            />
                        ))
                    )}
                </div>

                {/* Add Modal */}
                {isFormOpen && (
                    <DonationFormModal
                        onClose={() => setIsFormOpen(false)}
                        onSave={handleSave}
                        isLoading={loading}
                    />
                )}
                
                {/* Delete Confirmation Modal */}
                {isDeleteOpen && currentDonation && (
                    <CustomModal
                        isOpen={isDeleteOpen}
                        title="Confirm Record Deletion"
                        onClose={() => setIsDeleteOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        showConfirm={true}
                        confirmLabel="Delete"
                        variant="destructive"
                    >
                        <p className="text-gray-700">Are you sure you want to permanently remove the donation record from <span className="font-bold">{currentDonation.donorName}</span> for <span className="font-bold">${currentDonation.amount}</span>? This action cannot be undone.</p>
                    </CustomModal>
                )}
            </div>
        </MainLayout>
    );
}