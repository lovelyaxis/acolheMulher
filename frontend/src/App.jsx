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
import AdminLayout from "./components/AdminLayout";
import VLibras from "./components/VLibras";

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
          element={
            <ProtectedRoute perfil="ADMINISTRADOR">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard-admin" element={<DashboardAdmin />} />
          <Route path="/cadastrar-unidade" element={<CadastroUnidade />} />
          <Route path="/admin/unidades" element={<GerenciarUnidades />} />
          <Route
            path="/admin/unidades/:id/editar"
            element={<EditarUnidade />}
          />
          <Route path="/gestao-profissionais" element={<GestaoProfissionais />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route
            path="/admin/encaminhamentos"
            element={<GestaoEncaminhamentos />}
          />
          <Route path="/admin/vagas-abrigos" element={<VagasAbrigos />} />
          <Route
            path="/admin/registro-ocorrencias"
            element={<RegistroOcorrencias />}
          />
        </Route>

        {/* ================= ROTA CORINGA (SEMPRE POR ÚLTIMO) ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <VLibras />
    </AuthProvider>
  );
}
