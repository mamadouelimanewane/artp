import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
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

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Fermer la sidebar à chaque changement de route
  // (déjà géré dans Sidebar via onClick sur NavLink)

  return (
    <div className="flex min-h-screen" style={{ background: "#020617" }}>
      {/* Bouton hamburger — mobile uniquement */}
      <button
        className="hamburger-btn"
        onClick={() => setSidebarOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <span />
        <span />
        <span />
      </button>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main
        className="signum-main flex-1 overflow-auto"
        style={{ marginLeft: undefined }}
        // Sur desktop le margin-left est géré par flex (la sidebar est dans le flux)
        // Sur mobile la sidebar est en position fixed, le main prend toute la largeur
      >
        <Routes>
          <Route path="/accueil"      element={<AccueilPage />} />
          <Route path="/dashboard"    element={<Dashboard />} />
          <Route path="/trafic"       element={<TraficPage />} />
          <Route path="/imei"         element={<ImeiPage />} />
          <Route path="/mobilemoney"  element={<MobileMoneyPage />} />
          <Route path="/fiscalite"    element={<FiscalitePage />} />
          <Route path="/ia"           element={<IaPage />} />
          <Route path="/souverainete" element={<SouverainetePage />} />
          <Route path="/cdr"          element={<CdrPage />} />
          <Route path="/cnie"         element={<CniePage />} />
          <Route path="/dossier"      element={<DossierLegalPage />} />
          <Route path="/ott"          element={<OttPage />} />
          <Route path="/simulateur"   element={<SimulateurPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"   element={<LandingPage />} />
        <Route path="/*"  element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
