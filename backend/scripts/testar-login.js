const [primeiro, segundo] = process.argv.slice(2);
const BASE = "http://localhost:3000/api/auth";

async function main() {
  let resposta;

  if (primeiro === "me") {
    resposta = await fetch(`${BASE}/me`, {
      headers: { Authorization: `Bearer ${segundo}` }
    });
  } else {
    resposta = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: primeiro, senha: segundo })
    });
  }

  console.log("Status:", resposta.status);
  console.log(await resposta.json());
}

main().catch(erro =>
  console.error("Não consegui conectar ao servidor:", erro.message)
);