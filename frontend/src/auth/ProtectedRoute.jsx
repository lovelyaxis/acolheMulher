import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Componente de proteção de rotas por perfil (estilo middleware).
 *
 * Protege páginas internas exigindo login e o perfil correto:
 *  - sem perfil: permite qualquer usuário autenticado
 *  - "PROFISSIONAL" ou "ADMINISTRADOR": permite apenas esse perfil
 *  - array de perfis: permite qualquer um dos perfis informados
 *
 * Se o usuário não estiver autenticado, redireciona para /login.
 * Se estiver autenticado, mas sem o perfil exigido, redireciona para o
 * dashboard do próprio perfil (ou para /login quando não houver perfil válido).
 *
 * Uso:
 *   <ProtectedRoute perfil="PROFISSIONAL"><DashboardProfissional /></ProtectedRoute>
 *   <ProtectedRoute perfil="ADMINISTRADOR"><DashboardAdmin /></ProtectedRoute>
 *   <ProtectedRoute perfil={["PROFISSIONAL", "ADMINISTRADOR"]}>
 *     <RedeDeAtendimentoInterno />
 *   </ProtectedRoute>
 */
const normalizarPerfis = (perfil) => {
  if (!perfil) return [];
  return Array.isArray(perfil) ? perfil : [perfil];
};

export default function ProtectedRoute({ perfil, children }) {
  const { estaAutenticado, usuario, carregando, logout } = useAuth();
  const location = useLocation();

  // Enquanto carrega a sessão, não renderiza nada (evita piscar páginas protegidas).
  if (carregando) return null;

  if (!estaAutenticado || !usuario) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const perfilUsuario = usuario.perfil;
  const perfisPermitidos = normalizarPerfis(perfil);

  if (
    perfisPermitidos.length > 0 &&
    !perfisPermitidos.includes(perfilUsuario)
  ) {
    // Usuário autenticado, mas com perfil diferente do exigido.
    const destino =
      perfilUsuario === "ADMINISTRADOR" ? "/dashboard-admin" : "/dashboard-profissional";
    return <Navigate to={destino} replace state={{ from: location }} />;
  }

  return children;
}
