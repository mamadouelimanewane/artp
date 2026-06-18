import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { ToastProvider } from "./lib/toast";
import Dashboard from "./pages/Dashboard";
import SimPage from "./pages/SimPage";
import SvaPage from "./pages/SvaPage";
import IncidentsPage from "./pages/IncidentsPage";
import AnalyticsPage from "./pages/AnalyticsPage";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="flex">
          <Sidebar />
          <main className="main-content bg-slate-50 w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sim" element={<SimPage />} />
              <Route path="/sva" element={<SvaPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
