import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AccueilPage from "./pages/AccueilPage";
import Dashboard from "./pages/Dashboard";
import TraficPage from "./pages/TraficPage";
import ImeiPage from "./pages/ImeiPage";
import MobileMoneyPage from "./pages/MobileMoneyPage";
import FiscalitePage from "./pages/FiscalitePage";
import IaPage from "./pages/IaPage";
import SouverainetePage from "./pages/SouverainetePage";
import CdrPage from "./pages/CdrPage";
import CniePage from "./pages/CniePage";
import DossierLegalPage from "./pages/DossierLegalPage";
import OttPage from "./pages/OttPage";
import SimulateurPage from "./pages/SimulateurPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen" style={{ background: "#020617" }}>
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/accueil" element={<AccueilPage />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/trafic" element={<TraficPage />} />
            <Route path="/imei" element={<ImeiPage />} />
            <Route path="/mobilemoney" element={<MobileMoneyPage />} />
            <Route path="/fiscalite" element={<FiscalitePage />} />
            <Route path="/ia" element={<IaPage />} />
            <Route path="/souverainete" element={<SouverainetePage />} />
            <Route path="/cdr" element={<CdrPage />} />
            <Route path="/cnie" element={<CniePage />} />
            <Route path="/dossier" element={<DossierLegalPage />} />
            <Route path="/ott" element={<OttPage />} />
            <Route path="/simulateur" element={<SimulateurPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
