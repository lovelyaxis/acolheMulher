import { createContext, useContext, useEffect, useState } from "react";
import {
  login as serviceLogin,
  logout as serviceLogout,
  estaAutenticado,
  usuarioLogado,
  tokenSessao,
  verificarSessao,
} from "./authService";

const AuthContext = createContext(null);

/**
 * Provedor de autenticação da aplicação.
 * Fornece o estado da sessão (usuário, token, perfil) e as funções
 * login() e logout() para todo o componente via useAuth().
 *
 * O token é emitido pelo back-end. Ao abrir a página, a sessão guardada
 * é conferida no servidor (GET /api/auth/me).
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [tentativas, setTentativas] = useState(0);
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

  async function handleLogin(email, senha) {
    setCarregando(true);
    setErro(null);

    try {
      const resultado = await serviceLogin(email, senha);

      if (resultado.ok) {
        setUsuario(resultado.usuario);
        setToken(resultado.token);
        setTentativas(0);
        setBloqueadoAte(null);
        return { ok: true, usuario: resultado.usuario };
      }

      setTentativas(resultado.tentativas ?? 0);
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
      setCarregando(false);
    }
  }

  function handleLogout() {
    serviceLogout();
    setUsuario(null);
    setToken(null);
    setTentativas(0);
    setBloqueadoAte(null);
    setErro(null);
  }

  const valor = {
    usuario,
    token,
    perfil: usuario ? usuario.perfil : null,
    estaAutenticado: !!usuario,
    carregando,
    erro,
    tentativas,
    tentativasRestantes: Math.max(0, 5 - tentativas),
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