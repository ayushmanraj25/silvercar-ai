import React from 'react';
import { MainLayout } from "../components/layout/MainLayout";
import { Users, Heart, UserCog, DollarSign, Activity, Shield, TrendingUp, Calendar, Clock, AlertTriangle } from "lucide-react";


const StatsCard = ({ title, value, icon, trend }) => {
    const isPositive = trend.type === 'positive';
    const trendColor = isPositive 
        ? 'text-green-600 bg-green-50' 
        : trend.type === 'negative' 
        ? 'text-red-600 bg-red-50'
        : 'text-gray-600 bg-gray-50';

    const TrendIcon = isPositive ? TrendingUp : TrendingUp; 

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-shadow duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <div className="text-indigo-600 h-6 w-6">
                    {icon}
                </div>
            </div>
            <div className="mt-3">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`mt-4 flex items-center text-xs font-semibold px-2 py-1 rounded-full w-fit ${trendColor}`}>
                <TrendIcon className="w-3 h-3 mr-1" />
                {trend.value}
            </div>
        </div>
    );
};

// 2. Health Alerts Component (Card-based)
const HealthAlertsCard = () => {
    // Mock Data for alerts
    const alerts = [
        { id: 1, resident: "Robert Chen", detail: "Unusual blood pressure spike detected. Requires follow-up.", time: "5 min ago", color: "text-red-600" },
        { id: 2, resident: "Mary Johnson", detail: "Request for pain medication. Check chart for dosage.", time: "1 hour ago", color: "text-yellow-600" },
        { id: 3, resident: "James Wilson", detail: "Room 205 humidity level is below optimal range.", time: "3 hours ago", color: "text-blue-600" },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center border-b pb-4 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                <h2 className="text-xl font-bold text-gray-800">Critical Health Alerts (7)</h2>
            </div>
            <ul className="space-y-4">
                {alerts.map(alert => (
                    <li key={alert.id} className="flex items-start p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        <Clock className={`h-4 w-4 mt-1 mr-3 ${alert.color}`} />
                        <div>
                            <p className="font-semibold text-gray-900">{alert.resident}</p>
                            <p className="text-sm text-gray-700">{alert.detail}</p>
                            <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                        </div>
                    </li>
                ))}
                <li className="text-center pt-2">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                        View All Alerts →
                    </button>
                </li>
            </ul>
        </div>
    );
};


// 3. Simple Card Wrapper
const CustomCard = ({ title, icon: Icon, children, iconColor = "text-indigo-500" }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center border-b pb-4 mb-4">
            {Icon && <Icon className={`h-6 w-6 ${iconColor} mr-3`} />}
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <div>
            {children}
        </div>
    </div>
);


// =========================================================================
// MAIN DASHBOARD COMPONENT
// =========================================================================

export default function HomeDashboard() {
    
    // Function to handle link navigation
    const handleNavigation = (path) => {
        window.location.href = path;
    };

    // Function to handle temporary feature actions (replaces alert())
    const handleFeatureAction = (featureName) => {
        console.log(`${featureName} feature triggered. Placeholder for future implementation.`);
        // Optionally, show feedback in the UI instead of logging
    };

    return (
        <MainLayout>
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Welcome Header */}
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">Good Morning, Dr. Ayushman Khan 💣</h1>
                        <p className="text-gray-600 mt-1">Here's your facility overview for today</p>
                    </div>
                    {/* Primary Action Button */}
                    <button 
                        onClick={() => handleFeatureAction("Schedule Review")}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center"
                    >
                        <Calendar className="mr-2 h-5 w-5" />
                        Schedule Review
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard 
                        title="Total Residents" 
                        value={148} 
                        icon={<Users />} 
                        trend={{ value: "+3 this month", type: "positive" }} 
                    />
                    <StatsCard 
                        title="Health Alerts" 
                        value={7} 
                        icon={<Heart />} 
                        trend={{ value: "-2 from yesterday", type: "positive" }} 
                    />
                    <StatsCard 
                        title="Staff on Duty" 
                        value={24} 
                        icon={<UserCog />} 
                        trend={{ value: "Full capacity", type: "positive" }} 
                    />
                    <StatsCard 
                        title="Monthly Budget" 
                        value="$89,240" 
                        icon={<DollarSign />} 
                        trend={{ value: "85% utilized", type: "neutral" }} 
                    />
                </div>

                {/* Main Content: Alerts & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 1. Health Alerts (takes 2/3 width) */}
                    <div className="lg:col-span-2">
                        <HealthAlertsCard />
                    </div>

                    {/* 2. Quick Actions (takes 1/3 width) */}
                    <CustomCard title="Quick Actions" icon={Activity} iconColor="text-blue-500">
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleNavigation("/residents")}
                                className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors shadow-sm"
                            >
                                <Users className="h-6 w-6 text-indigo-600 mb-1" />
                                <span className="text-sm font-medium text-gray-800">Manage Residents</span>
                            </button>
                            <button 
                                onClick={() => handleNavigation("/staff")}
                                className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors shadow-sm"
                            >
                                <UserCog className="h-6 w-6 text-indigo-600 mb-1" />
                                <span className="text-sm font-medium text-gray-800">Manage Staff</span>
                            </button>
                            <button 
                                onClick={() => handleNavigation("/donations")}
                                className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors shadow-sm"
                            >
                                <DollarSign className="h-6 w-6 text-indigo-600 mb-1" />
                                <span className="text-sm font-medium text-gray-800">View Donations</span>
                            </button>
                            <button 
                                onClick={() => handleFeatureAction("Safety Report")}
                                className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors shadow-sm"
                            >
                                <Shield className="h-6 w-6 text-indigo-600 mb-1" />
                                <span className="text-sm font-medium text-gray-800">Safety Report</span>
                            </button>
                        </div>
                    </CustomCard>
                </div>

                {/* Recent Activity */}
                <CustomCard title="Recent Activity" icon={TrendingUp} iconColor="text-green-500">
                    <ul className="space-y-4">
                        <li className="flex items-center text-gray-700">
                            <span className="text-lg mr-3 text-green-500">✅</span> 
                            <div>
                                <p>Medication administered - <span className="font-semibold">Eleanor Martinez</span></p>
                                <p className="text-xs text-gray-500">10 minutes ago</p>
                            </div>
                        </li>
                        <li className="flex items-center text-gray-700">
                            <span className="text-lg mr-3 text-green-500">✅</span> 
                            <div>
                                <p>Health check completed - <span className="font-semibold">Robert Chen</span></p>
                                <p className="text-xs text-gray-500">25 minutes ago</p>
                            </div>
                        </li>
                        <li className="flex items-center text-gray-700">
                            <span className="text-lg mr-3 text-blue-500">📅</span> 
                            <div>
                                <p>Family visit scheduled - <span className="font-semibold">Mary Johnson</span></p>
                                <p className="text-xs text-gray-500">1 hour ago</p>
                            </div>
                        </li>
                        <li className="flex items-center text-gray-700">
                            <span className="text-lg mr-3 text-orange-500">🍽️</span> 
                            <div>
                                <p>Dietary plan updated - <span className="font-semibold">James Wilson</span></p>
                                <p className="text-xs text-gray-500">2 hours ago</p>
                            </div>
                        </li>
                    </ul>
                </CustomCard>
            </div>
        </MainLayout>
    );
}
