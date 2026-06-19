import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import RegistrePage from "./pages/RegistrePage";
import DnssecPage from "./pages/DnssecPage";
import CybersquattingPage from "./pages/CybersquattingPage";
import RegistrarsPage from "./pages/RegistrarsPage";
import ObservatoirePage from "./pages/ObservatoirePage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="main-content bg-slate-50 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/registre" element={<RegistrePage />} />
            <Route path="/dnssec" element={<DnssecPage />} />
            <Route path="/cybersquatting" element={<CybersquattingPage />} />
            <Route path="/registrars" element={<RegistrarsPage />} />
            <Route path="/observatoire" element={<ObservatoirePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
