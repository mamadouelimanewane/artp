import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { ToastProvider } from "./lib/toast";
import Dashboard from "./pages/Dashboard";
import MarchesPage from "./pages/MarchesPage";
import InfractionsPage from "./pages/InfractionsPage";
import SimulateurPage from "./pages/SimulateurPage";
import VeillePage from "./pages/VeillePage";
import AssistantPage from "./pages/AssistantPage";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="flex">
          <Sidebar />
          <main className="main-content bg-slate-50 w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/marches" element={<MarchesPage />} />
              <Route path="/infractions" element={<InfractionsPage />} />
              <Route path="/simulateur" element={<SimulateurPage />} />
              <Route path="/veille" element={<VeillePage />} />
              <Route path="/assistant" element={<AssistantPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
