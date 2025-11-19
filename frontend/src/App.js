import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomeDashboard from "./components/HomeDashboard";
import ResidentsList from "./components/ResidentsList";
import StaffList from "./components/StaffList";
import DonationsList from "./components/DonationsList";
import HealthMonitor from "./components/HealthMonitor";
import SafetyAlerts from "./components/SafetyAlerts";

// import NotificationsPage from "./components/NotificationsPage";
 import SettingsPage from "./components/SettingsPage";

console.log("Alias test working ✅");

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/residents" element={<ResidentsList />} />
        <Route path="/staff" element={<StaffList />} />
        <Route path="/donations" element={<DonationsList />} />
        <Route path="/health" element={<HealthMonitor />} />
        <Route path="/alerts" element={<SafetyAlerts />} />

        {/* FIXED ROUTES */}
        
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
