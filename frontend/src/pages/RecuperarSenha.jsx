import { useState } from "react";
import { Link } from "react-router-dom";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setEnviado(true);
  }

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", padding: "24px", fontFamily: "sans-serif" }}>
      <h2>Recuperar Senha</h2>
      {enviado ? (
        <div>
          <p>Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá as instruções para redefinir sua senha.</p>
          <Link to="/login">Voltar para o Login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p>Informe o e-mail cadastrado para receber o link de recuperação.</p>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "12px" }}
          />
          <button type="submit" style={{ width: "100%", padding: "10px", cursor: "pointer" }}>
            Enviar
          </button>
          <div style={{ marginTop: "16px" }}>
            <Link to="/login">Voltar para o Login</Link>
          </div>
        </form>
      )}
    </div>
  );
}