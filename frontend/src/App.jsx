
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RedeDeAtendimento from "./pages/RedeDeAtendimento";
import DashboardProfissional from "./pages/DashboardProfissional";

import CadastroLuna from './pages/CadastroLuna'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/rede-de-atendimento"
        element={<RedeDeAtendimento />}
      />
      <Route
        path="/dashboard-profissional"
        element={<DashboardProfissional />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/cadastro-luna" element={<CadastroLuna />} />
    </Routes>
  );
}
