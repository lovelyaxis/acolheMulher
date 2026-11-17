import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha"; // Vamos criar essa tela já já
import RedeDeAtendimento from "./pages/RedeDeAtendimento";
import RedeDeAtendimentoInterno from "./pages/RedeDeAtendimentoInterno";
import DashboardProfissional from "./pages/DashboardProfissional";

import DashboardAdmin from "./pages/DashboardAdmin";
import CadastroUnidade from "./pages/CadastroUnidade";
import GerenciarUnidades from "./pages/GerenciarUnidades";
import EditarUnidade from "./pages/EditarUnidade";
import TiposDeAcolhimento from "./pages/TiposdeAcolhimento";
import Ajuda from "./pages/Ajuda";
import Sobre from "./pages/Sobre";
import GestaoProfissionais from "./pages/GestaoProfissionais";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import ComoFunciona from "./pages/ComoFunciona";
import GestaoEncaminhamentos from "./pages/GestaoEncaminhamentos";
import VagasAbrigos from "./pages/VagasAbrigos";
import RegistroOcorrencias from "./pages/RegistroOcorrencias";
import RegistrarEncaminhamento from "./pages/RegistrarEncaminhamento";
import CanalOrientacaoAnonima from "./pages/CanalOrientacaoAnonima";
import MeuPerfil from "./pages/MeuPerfil";
// import CadastroLuna from "./pages/CadastroLuna"; // Descomente se o grupo decidir manter

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ================= ROTAS PÚBLICAS ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/canal-orientacao" element={<CanalOrientacaoAnonima />} />
        <Route path="/rede-de-atendimento" element={<RedeDeAtendimento />} />
        <Route path="/tipos-de-acolhimento" element={<TiposDeAcolhimento />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/ajuda" element={<Ajuda />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        {/* <Route path="/cadastro-luna" element={<CadastroLuna />} /> */}

        {/* ================= ROTAS PROTEGIDAS (GERAL / PROFISSIONAL) ================= */}
        <Route
          path="/meu-perfil"
          element={
            <ProtectedRoute>
              <MeuPerfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard-profissional"
          element={
            <ProtectedRoute perfil="PROFISSIONAL">
              <DashboardProfissional />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profissional/rede"
          element={
            <ProtectedRoute perfil={["PROFISSIONAL", "ADMINISTRADOR"]}>
              <RedeDeAtendimentoInterno />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registrar-encaminhamento"
          element={
            <ProtectedRoute perfil="PROFISSIONAL">
              <RegistrarEncaminhamento />
            </ProtectedRoute>
          }
        />

        {/* ================= ROTAS PROTEGIDAS (ADMINISTRADOR) ================= */}
        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute perfil="ADMINISTRADOR">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cadastrar-unidade"
          element={
            <ProtectedRoute perfil="ADMINISTRADOR">
              <CadastroUnidade />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/unidades"
          element={
            <ProtectedRoute perfil="ADMINISTRADOR">
              <GerenciarUnidades />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/unidades/:id/editar"
          element={
            <ProtectedRoute perfil="ADMINISTRADOR">
              <EditarUnidade />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gestao-profissionais"
          element={
            <ProtectedRoute perfil="ADMINISTRADOR">
              <GestaoProfissionais />
            </ProtectedRoute>
          }
        />

        <Route
          path="/relatorios"
          element={
            <ProtectedRoute perfil="ADMINISTRADOR">
              <Relatorios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracoes"
          element={
            <ProtectedRoute perfil="ADMINISTRADOR">
              <Configuracoes />
            </ProtectedRoute>
          }
        />

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

        {/* ================= ROTA CORINGA (SEMPRE POR ÚLTIMO) ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
