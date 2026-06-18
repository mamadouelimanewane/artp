import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import DatasetsPage from "./pages/DatasetsPage";
import ApiPage from "./pages/ApiPage";
import ExplorerPage from "./pages/ExplorerPage";
import DocsPage from "./pages/DocsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="main-content bg-slate-50 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/datasets" element={<DatasetsPage />} />
            <Route path="/api" element={<ApiPage />} />
            <Route path="/explorer" element={<ExplorerPage />} />
            <Route path="/docs" element={<DocsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
