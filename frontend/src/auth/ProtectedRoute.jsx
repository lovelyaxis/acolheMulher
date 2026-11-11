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
 * dashboard do próprio perfil (ou para /login quando o perfil for
 * desconhecido, evitando redirecionamento em loop).
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

const DESTINO_POR_PERFIL = {
  ADMINISTRADOR: "/dashboard-admin",
  PROFISSIONAL: "/dashboard-profissional",
};

export default function ProtectedRoute({ perfil, children }) {
  const { estaAutenticado, usuario, carregando } = useAuth();
  const location = useLocation();

  // Enquanto carrega a sessão, não deixa a página protegida piscar.
  if (carregando) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-page px-6"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
          <span
            className="h-5 w-5 animate-spin rounded-full border-2 border-brand/30 border-t-brand"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-navy">
            Verificando sua sessão...
          </span>
        </div>
      </div>
    );
  }

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
    const destino = DESTINO_POR_PERFIL[perfilUsuario] || "/login";
    return <Navigate to={destino} replace state={{ from: location }} />;
  }

  return children;
}
