
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RedeDeAtendimento from "./pages/RedeDeAtendimento";
import DashboardProfissional from "./pages/DashboardProfissional";

import DashboardAdmin from "./pages/DashboardAdmin";
import CadastroUnidade from "./pages/CadastroUnidade";
import TiposDeAcolhimento from "./pages/TiposdeAcolhimento";
import Ajuda from "./pages/Ajuda";
import Sobre from "./pages/Sobre";
import GestaoProfissionais from "./pages/GestaoProfissionais";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import ComoFunciona from './pages/ComoFunciona';
import GestaoEncaminhamentos from './pages/GestaoEncaminhamentos';
import VagasAbrigos from './pages/VagasAbrigos';
import RegistroOcorrencias from './pages/RegistroOcorrencias';
import CadastroLuna from './pages/CadastroLuna'

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      <Route
        path="/rede-de-atendimento"
        element={<RedeDeAtendimento />}
      />
      <Route
        path="/dashboard-profissional"
        element={
          <ProtectedRoute perfil="PROFISSIONAL">
            <DashboardProfissional />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/cadastro-luna" element={<CadastroLuna />} />

      {/* ADICIONANDO AS PAGINAS DO MATHEUS */}

      <Route
        path="/dashboard-admin"
        element={
          <ProtectedRoute perfil="ADMINISTRADOR">
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />

      <Route path="/cadastrar-unidade" element={<CadastroUnidade />} />

      <Route path="/tipos-de-acolhimento" element={<TiposDeAcolhimento />} />

      <Route path="/sobre" element={<Sobre />} />

      <Route path="/ajuda" element={<Ajuda />} />

      <Route path="/gestao-profissionais" element={<GestaoProfissionais />} />

      <Route path="/relatorios" element={<Relatorios />} />

      <Route path="/configuracoes" element={<Configuracoes />} />

      <Route path="/como-funciona" element={<ComoFunciona />} />

      <Route
        path="/admin/encaminhamentos"
        element={
          <ProtectedRoute perfil="ADMINISTRADOR">
            <GestaoEncaminhamentos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/vagas-abrigos"
        element={
          <ProtectedRoute perfil="ADMINISTRADOR">
            <VagasAbrigos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/registro-ocorrencias"
        element={
          <ProtectedRoute perfil="ADMINISTRADOR">
            <RegistroOcorrencias />
          </ProtectedRoute>
        }
      />
    </Routes>
    </AuthProvider>
  );
}
