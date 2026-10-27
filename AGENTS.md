# AGENTS.md — AcolheMulher

Instruções para o agente de IA (OpenCode, Goose ou similar) que trabalha neste repositório.

## O que é o projeto

AcolheMulher é uma plataforma web que conecta mulheres em situação de violência à rede de atendimento mais próxima, de forma rápida, sigilosa e acolhedora. É um projeto acadêmico (Projeto Integrador 2) feito em grupo.

**Fonte da verdade:** `REQUISITOS.md`. Leia o requisito citado (RF, RNF ou RN) antes de implementar qualquer coisa. Se o pedido contradizer o documento, avise e pergunte antes de seguir.

## Stack

- Front end: React + Vite, JSX (páginas e componentes), TailwindCSS.
- Back end, banco de dados e hospedagem: **ainda não definidos**. Não escolha nem instale nada disso por conta própria. Enquanto não houver back end, use dados simulados (mocks) em arquivos separados, fáceis de trocar por chamadas reais.

## Estrutura do repositório

- `frontend/`: aplicação React (tem `package.json` próprio). Todo comando do front roda dentro desta pasta.
- `backend/`: servidor e banco de dados (tem configuração própria). Não misture arquivos do front e do back.
- `REQUISITOS.md` e `AGENTS.md` ficam na raiz.

Dentro de `frontend/` (confira a estrutura real antes de criar arquivos):

- `src/pages/`: uma página por arquivo (Home, Login, RedeDeAtendimento, DashboardProfissional, DashboardAdmin, CadastrarUnidade, etc.)
- `src/components/`: componentes reutilizáveis (Header, Footer, botões, cards, formulários)
- `src/mocks/`: dados simulados

Antes de criar um arquivo novo, verifique se já existe um equivalente. Não duplique componentes. Tarefas de tela mexem só em `frontend/`; só mexa em `backend/` se o pedido disser isso.

## Módulo Unidades de atendimento

Mock compartilhado em `frontend/src/mocks/unidades.js`. Toda tela usa este formato:

- `id` (string), `nome`, `tipo`, `endereco`, `bairro`, `cep` (8 dígitos, sem traço), `telefone`, `horario`
- `vagasTotal` e `vagasDisponiveis` (números, apenas em Casa de Acolhimento), `ativa` (boolean), `totalEncaminhamentos` (número, só para simular a RN003)
- `tipo` aceita apenas: "Delegacia da Mulher", "CRAS/CREAS", "Casa de Acolhimento", "Defensoria Pública", "Hospital de Referência"

Regras:
- As páginas nunca importam o mock direto. Elas usam `frontend/src/services/unidadesService.js` (listar, buscar, listar para a visão interna, criar, atualizar, inativar), para trocar por chamadas reais depois.
- Consulta pública (RF003): não mostra vagas nem unidades inativas. As funções públicas do service (`listarUnidades` e `buscarUnidades`) removem os campos de vagas da resposta.
- Consulta interna (RF012): usa `listarUnidadesInternas`, que devolve as vagas (ativas por padrão, com opção de incluir inativas); só para Profissional e Administrador logados.
- Duplicidade (RN004): comparar nome + endereço ignorando maiúsculas, acentos e espaços extras.
- Unidade com `totalEncaminhamentos > 0` só pode ser inativada, nunca excluída (RN003).
- Proteção de rotas: se já existir contexto ou guard de autenticação no projeto, reutilize. Não crie outro.
- Não faça `git commit` nem `git push`. Quem faz isso é o usuário.

## Regras de código

- Componentes funcionais com hooks. Nomes de componentes em PascalCase, um componente por arquivo.
- Estilização apenas com classes do Tailwind. Não crie CSS novo sem necessidade.
- Textos da interface em português do Brasil, com linguagem acolhedora e não julgadora (RNF004).
- Mude somente o que foi pedido. Não refatore, renomeie nem apague arquivos que não fazem parte da tarefa.
- Mantenha as mudanças pequenas: uma tarefa por vez, citando o código do requisito.

## Regras de segurança e sigilo (obrigatórias)

1. **Sair Rápido (RF002, RNF002):** botão fixo e visível em todas as páginas públicas. Ao clicar, redireciona na hora, sem confirmação, para um site neutro externo usando `window.location.replace(...)` (não `href`), para o botão "voltar" não trazer a página de volta.
2. **190 e 180 (RN006):** sempre visíveis e a no máximo um clique de qualquer página pública. Em celular, use links `tel:`.
3. **Anonimato (RN001, RF006, RNF001):** o canal anônimo nunca pede nome, CPF ou telefone como campo obrigatório e não deve guardar nem registrar dados que identifiquem quem enviou (isso inclui IP em logs).
4. **Encaminhamentos (RN002, RF011):** usar apenas um código do caso, nunca o nome da pessoa atendida.
5. **Rotas por perfil:** Usuária (público, sem login), Profissional e Administrador. Páginas internas exigem login e o perfil correto (RF007).
6. **Login:** após 5 tentativas incorretas, bloqueio de 15 minutos (RF007, RN005). Nunca guarde senha em texto puro ou no código.
7. **Exclusão (RN003, RF015):** unidades com encaminhamentos só podem ser inativadas, nunca excluídas.
8. **Dados de exemplo:** use apenas dados fictícios. Nunca coloque dados pessoais reais, mensagens reais de vítimas ou chaves de API no código ou no repositório.

## Acessibilidade e desempenho

- Interface responsiva (celular, tablet e computador).
- Contraste adequado para baixa visão e daltonismo (não use só a cor para passar informação).
- Telas devem carregar em até 3 segundos (RNF003).
- Compatível com Chrome 90+, Firefox 88+ e Edge 90+ (RNF006).

## Como trabalhar

1. Leia o requisito citado em `REQUISITOS.md` e os arquivos relacionados.
2. Diga em poucas linhas o que vai fazer e quais arquivos vai mexer.
3. Implemente só a tarefa pedida.
4. Dentro de `frontend/`, rode `npm run dev` ou `npm run build` para conferir que não quebrou nada.
5. Ao final, liste os arquivos criados ou alterados e o que ainda falta.

Se faltar informação (por exemplo, o formato da API), pergunte em vez de inventar.
