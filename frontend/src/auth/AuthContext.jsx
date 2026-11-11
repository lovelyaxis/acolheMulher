import { createContext, useContext, useEffect, useState } from "react";
import {
  login as serviceLogin,
  logout as serviceLogout,
  estaAutenticado,
  usuarioLogado,
  tokenSessao,
  verificarSessao,
} from "./authService";
import { CHAVE_SESSION, lerSession } from "./session";

const AuthContext = createContext(null);
const MAX_TENTATIVAS = 5;

/**
 * Provedor de autenticação da aplicação.
 * Fornece o estado da sessão (usuário, token, perfil) e as funções
 * login() e logout() para todo o componente via useAuth().
 *
 * O token é emitido pelo back-end. Ao abrir a página, a sessão guardada
 * é conferida no servidor (GET /api/auth/me).
 *
 * `carregando` cobre apenas a verificação inicial da sessão.
 * `entrando` cobre o envio do formulário de login.
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState(null);
  const [tentativasRestantes, setTentativasRestantes] =
    useState(MAX_TENTATIVAS);
  const [bloqueadoAte, setBloqueadoAte] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function iniciar() {
      if (estaAutenticado()) {
        setUsuario(usuarioLogado());
        setToken(tokenSessao());

        const resultado = await verificarSessao();
        if (!ativo) return;

        if (resultado.valida) {
          setUsuario(resultado.usuario);
        } else {
          setUsuario(null);
          setToken(null);
        }
      }
      if (ativo) setCarregando(false);
    }

    iniciar();

    // Se o servidor recusar o token em qualquer chamada, encerra a sessão.
    function aoExpirar() {
      setUsuario(null);
      setToken(null);
    }
    window.addEventListener("am:sessao-expirada", aoExpirar);

    return () => {
      ativo = false;
      window.removeEventListener("am:sessao-expirada", aoExpirar);
    };
  }, []);

  // Mantém as abas sincronizadas quando a sessão muda em outra aba.
  useEffect(() => {
    function sincronizar(evento) {
      if (evento.key !== null && evento.key !== CHAVE_SESSION) return;

      const sessao = lerSession();
      setUsuario(sessao ? sessao.usuario : null);
      setToken(sessao ? sessao.token : null);
    }

    window.addEventListener("storage", sincronizar);
    return () => window.removeEventListener("storage", sincronizar);
  }, []);

  // Encerra a sessão quando o token vence, mesmo sem chamada de API.
  useEffect(() => {
    if (!token) return;

    const sessao = lerSession();
    if (!sessao) {
      serviceLogout();
      setUsuario(null);
      setToken(null);
      return;
    }

    const restante = sessao.expiraEm - Date.now();
    if (restante <= 0) {
      serviceLogout();
      setUsuario(null);
      setToken(null);
      return;
    }

    const timer = setTimeout(() => {
      serviceLogout();
      setUsuario(null);
      setToken(null);
    }, restante);

    return () => clearTimeout(timer);
  }, [token]);

  // Libera o formulário quando o bloqueio de 15 minutos termina.
  useEffect(() => {
    if (!bloqueadoAte) return;

    const restante = bloqueadoAte - Date.now();
    if (restante <= 0) {
      setBloqueadoAte(null);
      setTentativasRestantes(MAX_TENTATIVAS);
      return;
    }

    const timer = setTimeout(() => {
      setBloqueadoAte(null);
      setTentativasRestantes(MAX_TENTATIVAS);
    }, restante);

    return () => clearTimeout(timer);
  }, [bloqueadoAte]);

  async function handleLogin(email, senha) {
    setEntrando(true);
    setErro(null);

    try {
      const resultado = await serviceLogin(email, senha);

      if (resultado.ok) {
        setUsuario(resultado.usuario);
        setToken(resultado.token);
        setTentativasRestantes(MAX_TENTATIVAS);
        setBloqueadoAte(null);
        return { ok: true, usuario: resultado.usuario };
      }

      if (typeof resultado.tentativasRestantes === "number") {
        setTentativasRestantes(resultado.tentativasRestantes);
      }
      if (resultado.bloqueadoAte) {
        setBloqueadoAte(resultado.bloqueadoAte);
      }
      setErro(resultado.mensagem || "Não foi possível fazer o login.");
      return {
        ok: false,
        codigo: resultado.codigo,
        mensagem: resultado.mensagem,
      };
    } finally {
      setEntrando(false);
    }
  }

  function handleLogout() {
    serviceLogout();
    setUsuario(null);
    setToken(null);
    setTentativasRestantes(MAX_TENTATIVAS);
    setBloqueadoAte(null);
    setErro(null);
  }

  const valor = {
    usuario,
    token,
    perfil: usuario ? usuario.perfil : null,
    estaAutenticado: !!usuario,
    carregando,
    entrando,
    erro,
    tentativas: Math.max(0, MAX_TENTATIVAS - tentativasRestantes),
    tentativasRestantes,
    bloqueadoAte,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider.");
  }
  return contexto;
}
