import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NationalPage  from "./pages/NationalPage";
import MapPage       from "./pages/MapPage";
import OperatorsPage from "./pages/OperatorsPage";
import QosPage       from "./pages/QosPage";
import ReportsPage   from "./pages/ReportsPage";
import SettingsPage  from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<NationalPage/>}  />
        <Route path="/map"       element={<MapPage/>}       />
        <Route path="/operators" element={<OperatorsPage/>} />
        <Route path="/qos"       element={<QosPage/>}       />
        <Route path="/reports"   element={<ReportsPage/>}   />
        <Route path="/settings"  element={<SettingsPage/>}  />
        <Route path="*"          element={<Navigate to="/" replace/>} />
      </Routes>
    </BrowserRouter>
  );
}
