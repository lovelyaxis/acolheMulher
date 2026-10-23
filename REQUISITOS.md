# AcolheMulher (AM) — Documento de Visão e Levantamento de Requisitos

Plataforma de acolhimento e rede de atendimento a mulheres em situação de violência.

| Campo | Descrição |
|---|---|
| Nome do Projeto | AcolheMulher |
| Sigla | AM |
| Versão do Documento | 1.0 |
| Data | 12/09/2026 |
| Cliente | Professor(a) da disciplina Projeto Integrador 2 |
| Equipe | Arthur Mendes, Caua Pereira, Guilherme Amorim, Guilherme Rodrigues e Matheus Vinicius |
| Disciplina | Projeto Integrador 2 |

---

## 1. Visão Geral

### 1.1 Problema a ser resolvido

Mulheres em situação de violência frequentemente não sabem onde buscar ajuda, sentem medo ou vergonha de procurar uma delegacia e têm dificuldade de localizar, em um único lugar, informações claras sobre a rede de proteção disponível na sua região (delegacias especializadas, CRAS, CREAS, casas de acolhimento, defensoria pública).

Dados do Ministério das Mulheres (Painel de Dados do Ligue 180, 2025): cerca de 1,09 milhão de atendimentos no ano (quase 3 mil por dia) e 155.111 denúncias de violência, aumento de 17,4% em relação ao ano anterior. Cerca de 70% das agressões relatadas ocorreram dentro do ambiente doméstico e 66,3% das denúncias foram feitas pela própria vítima. Isso reforça a importância de canais acessíveis, sigilosos e fáceis de encontrar.

### 1.2 Objetivo do sistema

Conectar mulheres em situação de violência à rede de atendimento e proteção mais próxima, de forma rápida, sigilosa e acolhedora.

O sistema centraliza informações sobre a rede de atendimento, permite que qualquer pessoa consulte anonimamente unidades de apoio próximas, conheça seus direitos e canais de denúncia, e permite que profissionais da rede registrem encaminhamentos de forma organizada e segura, sem comprometer o sigilo das pessoas atendidas.

### 1.3 Benefícios esperados

- Reduzir o tempo para encontrar um serviço de apoio próximo.
- Centralizar informações hoje espalhadas entre diferentes órgãos e sites.
- Oferecer um canal de orientação anônimo, reduzindo a barreira inicial para pedir ajuda.
- Padronizar o registro de encaminhamentos entre profissionais da rede.
- Gerar relatórios gerenciais anonimizados para apoiar políticas públicas locais.
- Oferecer um recurso de segurança ("Sair Rápido") pensado para a proteção real da usuária.

---

## 2. Perfis de Usuário

### Usuária / Público
Mulher em situação de violência ou qualquer pessoa buscando informação. Acesso totalmente anônimo, sem login.

- **Pode:** consultar a rede de atendimento por localização; ler conteúdo sobre direitos e legislação; consultar canais de denúncia (190/180/Disque 100); enviar mensagem pelo canal de orientação anônima.
- **Não pode:** acessar áreas internas (dashboards, cadastros, relatórios); visualizar dados de outras usuárias.

### Profissional da Rede
Assistente social, atendente de delegacia, CRAS/CREAS ou outro profissional vinculado à rede.

- **Pode:** registrar encaminhamentos/atendimentos; consultar a rede em visão interna (com dados operacionais); acessar seu próprio dashboard.
- **Não pode:** cadastrar ou remover unidades da rede; gerenciar outros profissionais; acessar relatórios gerenciais completos.

### Administrador
Gestor responsável pela operação do sistema e da rede cadastrada.

- **Pode:** cadastrar, editar e inativar unidades de atendimento; cadastrar e bloquear profissionais; gerar relatórios gerenciais anonimizados; configurar parâmetros do sistema.
- **Não pode:** acessar o conteúdo das mensagens do canal anônimo além do necessário para triagem; reidentificar encaminhamentos anonimizados.

---

## 3. Requisitos Funcionais

### 3.1 Módulo Público (acesso anônimo, sem login)

| Código | Funcionalidade | Descrição |
|---|---|---|
| RF001 | Página inicial (Home) | Seção de boas-vindas com mensagem de acolhimento, botão de busca de atendimento, canais rápidos (190, 180 e chat anônimo), resumo da rede de atendimento e resumo de direitos. O botão "Sair Rápido" deve ficar fixo e visível em todas as páginas públicas. |
| RF002 | Sair Rápido (segurança) | Em qualquer página pública, o botão redireciona imediatamente para um site neutro (ex.: um buscador comum), permitindo fechar a página com rapidez caso alguém se aproxime. |
| RF003 | Consultar rede de atendimento | A usuária informa CEP ou bairro (ou usa a geolocalização do navegador). O sistema exibe uma lista de unidades (Delegacia da Mulher, CRAS/CREAS, Casa de Acolhimento, Defensoria Pública, Hospital de Referência) com nome, endereço, telefone e horário de funcionamento, filtrável por tipo de unidade. |
| RF004 | Consultar direitos e legislação | Conteúdo informativo resumido sobre a Lei Maria da Penha, os tipos de violência (física, psicológica, patrimonial, sexual e moral) e o funcionamento de uma medida protetiva. |
| RF005 | Consultar canais de denúncia | Informações sobre os canais 190 (Emergência Policial), 180 (Central de Atendimento à Mulher) e Disque 100, com botões de ligação direta em dispositivos móveis. |
| RF006 | Canal de orientação anônima | A usuária envia uma mensagem de dúvida ou pede orientação sem se identificar (campo de nome opcional). O sistema não armazena dados que permitam identificar quem enviou — apenas o conteúdo e a categoria do assunto. |

### 3.2 Módulo de Autenticação e Acesso

| Código | Funcionalidade | Descrição |
|---|---|---|
| RF007 | Login de profissional/administrador | O usuário informa e-mail e senha. O sistema valida as credenciais e redireciona para a área do perfil (Profissional ou Administrador). Após 5 tentativas incorretas, a conta é bloqueada por 15 minutos. |
| RF008 | Recuperação de senha | O usuário solicita redefinição informando o e-mail cadastrado. O sistema envia um link temporário, válido por 24 horas, para criar uma nova senha. |
| RF009 | Logout | O usuário pode encerrar a sessão a qualquer momento pelo menu do cabeçalho, sendo redirecionado à tela de login. |

### 3.3 Módulo do Profissional da Rede

| Código | Funcionalidade | Descrição |
|---|---|---|
| RF010 | Dashboard do profissional | Resumo dos atendimentos do dia e dos encaminhamentos pendentes do profissional autenticado. |
| RF011 | Registrar encaminhamento | Formulário com tipo de atendimento, unidade de destino, observações e um código de identificação anônimo do caso — sem dados que identifiquem diretamente a pessoa atendida, preservando o sigilo. |
| RF012 | Consultar rede de atendimento (interna) | Lista completa de unidades com informações adicionais de uso interno, como vagas disponíveis em casas de acolhimento. |

### 3.4 Módulo do Administrador

| Código | Funcionalidade | Descrição |
|---|---|---|
| RF013 | Dashboard administrativo | Indicadores gerais: total de unidades cadastradas, profissionais ativos e atendimentos registrados no mês. |
| RF014 | Cadastrar unidade de atendimento | Formulário com Nome (obrigatório), Tipo (lista suspensa), Endereço, Telefone, Horário de funcionamento e Capacidade/vagas (quando aplicável). |
| RF015 | Editar/inativar unidade | Atualizar os dados de uma unidade. Unidades com encaminhamentos vinculados não podem ser excluídas, apenas inativadas, preservando o histórico para relatórios. |
| RF016 | Gestão de profissionais | Cadastrar, editar e bloquear/desbloquear contas de profissionais da rede. |
| RF017 | Relatórios gerenciais | Relatórios anonimizados de atendimentos por período (últimos 30 dias, 90 dias, 1 ano), exportáveis em PDF ou Excel, sem exposição de dados que identifiquem vítimas. |

---

## 4. Requisitos Não Funcionais

| Código | Tipo | Descrição |
|---|---|---|
| RNF001 | Segurança e sigilo | O canal de orientação anônima não armazena dados que identifiquem quem enviou a mensagem. Senhas de profissionais/administradores são armazenadas com hash. Toda comunicação entre navegador e servidor é feita via HTTPS. |
| RNF002 | Botão de saída rápida | Disponível e sempre visível em todas as páginas públicas; redireciona imediatamente para uma página neutra externa ao sistema, sem exigir confirmação. |
| RNF003 | Desempenho | Qualquer tela deve carregar em no máximo 3 segundos, considerando uma conexão de 10 Mbps. |
| RNF004 | Usabilidade e acessibilidade | Interface responsiva (computador, tablet e celular); contraste de cores adequado a pessoas com baixa visão ou daltonismo; linguagem acolhedora e não julgadora em todos os textos. |
| RNF005 | Disponibilidade | Sistema disponível 24h por dia, 7 dias por semana, exceto manutenções programadas, anunciadas com 48h de antecedência. |
| RNF006 | Compatibilidade | Funcionamento correto no Google Chrome (90+), Mozilla Firefox (88+) e Microsoft Edge (90+). |
| RNF007 | Backup | Backup automático do banco de dados todos os dias às 02h00, mantendo os 30 dias mais recentes. |

---

## 5. Regras de Negócio

| Código | Regra | Descrição |
|---|---|---|
| RN001 | Anonimato garantido | O canal de orientação anônima nunca solicita nome, CPF ou telefone como campo obrigatório. |
| RN002 | Encaminhamento sem identificação direta | Os registros de encaminhamento usam apenas um código do caso, nunca o nome completo da pessoa atendida, para fins de relatório. |
| RN003 | Exclusão segura | Unidades com encaminhamentos vinculados não podem ser excluídas, apenas inativadas. |
| RN004 | Cadastro único | Não é permitido cadastrar dois profissionais com o mesmo e-mail, nem duas unidades com nome e endereço idênticos. |
| RN005 | Bloqueio de acesso | Após 5 tentativas de login incorretas, a conta do profissional/administrador é bloqueada automaticamente por 15 minutos. |
| RN006 | Prioridade de emergência | Os canais 190 e 180 devem estar sempre visíveis e acessíveis em no máximo um clique a partir de qualquer página pública. |

---

## 6. Restrições Tecnológicas

| Aspecto | Definição |
|---|---|
| Front end | React + Vite, JSX, TailwindCSS (o protótipo inicial foi feito em HTML5/CSS3/JavaScript puro) |
| Back end / linguagem | A definir pela equipe |
| Banco de dados | A definir pela equipe |
| Hospedagem | A definir pela equipe |

Fonte dos dados da seção 1.1: Ministério das Mulheres / Agência Brasil — Painel de Dados do Ligue 180 (2025).
