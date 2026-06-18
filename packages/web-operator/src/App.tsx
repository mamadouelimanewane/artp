import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider, useToastEmitter } from "./lib/toast";
import { useAuthStore } from "./store/auth";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import ComplaintDetailPage from "./pages/ComplaintDetailPage";
import QosPage from "./pages/QosPage";
import ReportPage from "./pages/ReportPage";
import AlertsPage from "./pages/AlertsPage";
import ProfilePage from "./pages/ProfilePage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function ToastBridge() { useToastEmitter(); return null; }

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ToastBridge />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/"               element={<RequireAuth><DashboardPage /></RequireAuth>} />
          <Route path="/complaints"     element={<RequireAuth><ComplaintsPage /></RequireAuth>} />
          <Route path="/complaints/:id" element={<RequireAuth><ComplaintDetailPage /></RequireAuth>} />
          <Route path="/qos"            element={<RequireAuth><QosPage /></RequireAuth>} />
          <Route path="/reports"        element={<RequireAuth><ReportPage /></RequireAuth>} />
          <Route path="/alerts"         element={<RequireAuth><AlertsPage /></RequireAuth>} />
          <Route path="/profile"        element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
