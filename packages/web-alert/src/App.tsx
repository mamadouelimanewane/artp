import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import SignalerPage from "./pages/SignalerPage";
import SuiviPage from "./pages/SuiviPage";
import CartePage from "./pages/CartePage";
import StatsPage from "./pages/StatsPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="main-content bg-slate-50 w-full">
          <Routes>
            <Route path="/" element={<SignalerPage />} />
            <Route path="/suivi" element={<SuiviPage />} />
            <Route path="/carte" element={<CartePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
