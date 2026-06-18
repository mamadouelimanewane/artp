import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth";
import LoginPage        from "./pages/LoginPage";
import HomePage         from "./pages/HomePage";
import MissionsPage     from "./pages/MissionsPage";
import MissionDetailPage from "./pages/MissionDetailPage";
import MeasurePage      from "./pages/MeasurePage";
import MapPage          from "./pages/MapPage";
import ProfilePage      from "./pages/ProfilePage";

function OnlineWatcher() {
  const setOnline = useAuthStore(s => s.setOnline);
  useEffect(() => {
    const on  = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, [setOnline]);
  return null;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const agent = useAuthStore(s => s.agent);
  return agent ? <>{children}</> : <Navigate to="/login" replace/>;
}

export default function App() {
  return (
    <BrowserRouter>
      <OnlineWatcher/>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/" element={<PrivateRoute><HomePage/></PrivateRoute>}/>
        <Route path="/missions" element={<PrivateRoute><MissionsPage/></PrivateRoute>}/>
        <Route path="/missions/:id" element={<PrivateRoute><MissionDetailPage/></PrivateRoute>}/>
        <Route path="/measure" element={<PrivateRoute><MeasurePage/></PrivateRoute>}/>
        <Route path="/map" element={<PrivateRoute><MapPage/></PrivateRoute>}/>
        <Route path="/profile" element={<PrivateRoute><ProfilePage/></PrivateRoute>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}
