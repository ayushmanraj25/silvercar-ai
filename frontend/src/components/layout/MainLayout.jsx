import { Sidebar } from "./Sidebar";

export function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
