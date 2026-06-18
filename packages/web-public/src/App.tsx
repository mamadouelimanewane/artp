import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage       from "./pages/HomePage";
import OperateursPage from "./pages/OperateursPage";
import CartePage      from "./pages/CartePage";
import RapportsPage   from "./pages/RapportsPage";
import FaqPage        from "./pages/FaqPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<HomePage/>}       />
        <Route path="/operateurs" element={<OperateursPage/>} />
        <Route path="/carte"      element={<CartePage/>}      />
        <Route path="/rapports"   element={<RapportsPage/>}   />
        <Route path="/faq"        element={<FaqPage/>}        />
      </Routes>
    </BrowserRouter>
  );
}
