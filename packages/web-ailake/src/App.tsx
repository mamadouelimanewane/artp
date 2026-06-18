import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import StrategiePage from "./pages/StrategiePage";
import DataLakePage from "./pages/DataLakePage";
import PocPage from "./pages/PocPage";
import ConsultationPage from "./pages/ConsultationPage";
import ScoringPage from "./pages/ScoringPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="main-content bg-slate-50 w-full">
          <Routes>
            <Route path="/" element={<StrategiePage />} />
            <Route path="/datalake" element={<DataLakePage />} />
            <Route path="/poc" element={<PocPage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="/scoring" element={<ScoringPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
