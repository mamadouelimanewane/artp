import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CapteursPage from "./pages/CapteursPage";
import InterferencesPage from "./pages/InterferencesPage";
import AttributionPage from "./pages/AttributionPage";
import RapportsPage from "./pages/RapportsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="main-content bg-slate-50 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/capteurs" element={<CapteursPage />} />
            <Route path="/interferences" element={<InterferencesPage />} />
            <Route path="/attribution" element={<AttributionPage />} />
            <Route path="/rapports" element={<RapportsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
