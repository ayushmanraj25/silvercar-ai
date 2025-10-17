import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeDashboard from "./components/HomeDashboard";
import ResidentsList from "./components/ResidentsList";
import StaffList from "./components/StaffList";
import DonationsList from "./components/DonationsList";
import HealthMonitor from "./components/HealthMonitor"; // ✅ Add this
import { Button } from "@/components/ui/button";
console.log("Alias test working ✅");

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/residents" element={<ResidentsList />} />
        <Route path="/staff" element={<StaffList />} />
        <Route path="/donations" element={<DonationsList />} />
        <Route path="/health" element={<HealthMonitor />} /> {/* ✅ Added */}
      </Routes>
    </Router>
  );
}

export default App;
