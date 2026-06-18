import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CataloguePage from "./pages/CataloguePage";
import KycPage from "./pages/KycPage";
import NumberVerifyPage from "./pages/NumberVerifyPage";
import LocationPage from "./pages/LocationPage";
import OperateursPage from "./pages/OperateursPage";
import SandboxPage from "./pages/SandboxPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="main-content bg-slate-50 w-full">
          <Routes>
            <Route path="/" element={<CataloguePage />} />
            <Route path="/kyc" element={<KycPage />} />
            <Route path="/number-verify" element={<NumberVerifyPage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/operateurs" element={<OperateursPage />} />
            <Route path="/sandbox" element={<SandboxPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
