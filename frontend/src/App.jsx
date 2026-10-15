
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

      {/* ADICIONANDO AS PAGINAS DO MATHEUS */}

      <Route path="/dashboard-admin" element={<DashboardAdmin />} />

      <Route path="/cadastrar-unidade" element={<CadastroUnidade />} />

      <Route path="/tipos-de-acolhimento" element={<TiposDeAcolhimento />} />

      <Route path="/sobre" element={<Sobre />} />

      <Route path="/ajuda" element={<Ajuda />} />

      <Route path="/gestao-profissionais" element={<GestaoProfissionais />} />

      <Route path="/relatorios" element={<Relatorios />} />

      <Route path="/configuracoes" element={<Configuracoes />} />

      <Route path="/como-funciona" element={<ComoFunciona />} />

      <Route path="/admin/encaminhamentos" element={<GestaoEncaminhamentos />} />

      <Route path="/admin/vagas-abrigos" element={<VagasAbrigos />} />

      <Route path="/admin/registro-ocorrencias" element={<RegistroOcorrencias />} />
    </Routes>
  );
}
