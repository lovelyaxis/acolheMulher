import { createContext, useContext, useEffect, useState } from "react";
import {
  login as serviceLogin,
  logout as serviceLogout,
  estaAutenticado,
  usuarioLogado,
  tokenSessao,
  lerTentativas,
  lerBloqueioAte,
} from "./authService";

const AuthContext = createContext(null);

/**
 * Provedor de autenticação da aplicação.
 * Fornece o estado da sessão (usuário, token, perfil) e as funções
 * login() e logout() para todo o componente via useAuth().
 *
 * A sessão é lida do localStorage ao montar, de modo que o token de
 * sessão persista entre recargas da página enquanto não expirar.
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [tentativas, setTentativas] = useState(0);
  const [bloqueadoAte, setBloqueadoAte] = useState(null);

  useEffect(() => {
    if (estaAutenticado()) {
      setUsuario(usuarioLogado());
      setToken(tokenSessao());
    }
    setTentativas(lerTentativas());
    setBloqueadoAte(lerBloqueioAte());
    setCarregando(false);
  }, []);

  async function handleLogin(email, senha) {
    setCarregando(true);
    setErro(null);
    const resultado = await serviceLogin(email, senha);

    if (resultado.ok) {
      setUsuario(resultado.usuario);
      setToken(resultado.token);
      setTentativas(0);
      setBloqueadoAte(null);
      return { ok: true, usuario: resultado.usuario };
    }

    setTentativas(resultado.tentativas ?? lerTentativas());
    if (resultado.bloqueadoAte) {
      setBloqueadoAte(resultado.bloqueadoAte);
    }
    setErro(resultado.mensagem || "Não foi possível fazer o login.");
    setCarregando(false);
    return { ok: false, codigo: resultado.codigo, mensagem: resultado.mensagem };
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
