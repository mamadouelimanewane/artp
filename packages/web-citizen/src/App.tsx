import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider, useToastEmitter } from "./lib/toast";
import { useAuthStore } from "./store/auth";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NewComplaintPage from "./pages/NewComplaintPage";
import MyComplaintsPage from "./pages/MyComplaintsPage";
import ComplaintDetailPage from "./pages/ComplaintDetailPage";
import QosTestPage from "./pages/QosTestPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import ComparateurPage from "./pages/ComparateurPage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function ToastBridge() {
  useToastEmitter();
  return null;
}

export default function App() {
  return (
    <ToastProvider>
    <BrowserRouter>
      <ToastBridge />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/complaints" element={<RequireAuth><MyComplaintsPage /></RequireAuth>} />
        <Route path="/complaints/new" element={<RequireAuth><NewComplaintPage /></RequireAuth>} />
        <Route path="/complaints/:id" element={<RequireAuth><ComplaintDetailPage /></RequireAuth>} />
        <Route path="/qos" element={<RequireAuth><QosTestPage /></RequireAuth>} />
        <Route path="/chat" element={<RequireAuth><ChatPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/comparateur" element={<RequireAuth><ComparateurPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ToastProvider>
  );
}
