import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CataloguePage from "./pages/CataloguePage";
import CertificationsPage from "./pages/CertificationsPage";
import ApprenantsPage from "./pages/ApprenantsPage";
import LivePage from "./pages/LivePage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="main-content bg-slate-50 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/certifications" element={<CertificationsPage />} />
            <Route path="/apprenants" element={<ApprenantsPage />} />
            <Route path="/live" element={<LivePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
