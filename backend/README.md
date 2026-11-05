# AcolheMulher — Backend

API do projeto acadêmico AcolheMulher, desenvolvida com Node.js e Express.

O objetivo do backend é disponibilizar funcionalidades para o registro de encaminhamentos, consulta de unidades de atendimento, indicadores do dashboard profissional e recebimento de orientações anônimas.

## 1. Tecnologias utilizadas

- Node.js
- Express 5
- CORS
- JavaScript
- Testes automatizados com `node:test`

## 2. Requisitos para executar

Antes de iniciar, é necessário ter instalado:

- Node.js
- npm (instalado junto com o Node.js)

## 3. Instalação

Abra o terminal na pasta `backend` e execute:

```bash
npm install
```

Esse comando instala as dependências necessárias para executar a API.

## 4. Como iniciar o servidor

Para iniciar o backend, execute:

```bash
npm start
```

Por padrão, a API ficará disponível em:

`http://localhost:3000`

Para verificar se está funcionando, acesse:

`http://localhost:3000/api`

A resposta esperada é uma mensagem informando que a API AcolheMulher está funcionando.

## 5. Configuração da porta

O servidor utiliza a variável de ambiente `PORT`.

Caso ela não seja definida, a porta padrão será `3000`.

Não é necessário criar um arquivo `.env` para executar a configuração padrão.

## 6. Rotas da API

### Consultas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api` | Verifica se a API está funcionando. |
| GET | `/api/usuarios` | Lista usuários fictícios. |
| GET | `/api/unidades` | Lista unidades de atendimento. |
| GET | `/api/encaminhamentos?profissionalId=ID` | Lista encaminhamentos do profissional informado. |
| GET | `/api/dashboard-profissional?profissionalId=ID` | Retorna indicadores do dashboard profissional. |

### Canal de orientação anônima

**Método:** POST

**Rota:** `/api/orientacoes-anonimas`

Exemplo de corpo da requisição:

```json
{
  "mensagem": "Gostaria de receber informações sobre meus direitos.",
  "categoria": "direitos"
}
```

Categorias aceitas:

- `direitos`
- `violencia`
- `atendimento`
- `outros`

A mensagem é obrigatória e deve ter no máximo 2000 caracteres.

O sistema armazena somente a mensagem e a categoria, sem exigir nome ou outros dados pessoais.

### Registro de encaminhamentos

**Método:** POST

**Rota:** `/api/encaminhamentos`

Exemplo de corpo da requisição:

```json
{
  "codigoCaso": "CASO-001",
  "tipoAtendimento": "Apoio psicológico",
  "unidadeDestinoId": "ID_DA_UNIDADE",
  "observacoes": "Encaminhamento para atendimento especializado.",
  "profissionalId": "ID_DO_PROFISSIONAL"
}
```

Os valores `ID_DA_UNIDADE` e `ID_DO_PROFISSIONAL` devem ser substituídos por identificadores existentes nos dados fictícios do projeto.

O registro exige um código de caso válido, tipo de atendimento, unidade de destino ativa e profissional cadastrado.

Não é permitido enviar dados pessoais como nome, CPF ou telefone da pessoa atendida.

## 7. Testes automatizados

Para executar os testes, utilize:

```bash
npm test
```

Os testes verificam funcionalidades como:

- Funcionamento da API.
- Recebimento de orientações anônimas.
- Rejeição de mensagens vazias.
- Registro de encaminhamentos válidos.
- Rejeição de encaminhamentos com dados pessoais.
- Retorno dos indicadores do dashboard profissional.

## 8. Dados utilizados

O projeto utiliza dados fictícios armazenados em:

`data/mockData.js`

Esses dados incluem usuários, unidades de atendimento, encaminhamentos e orientações anônimas.

**Importante:** nesta versão acadêmica, os registros são armazenados em memória. Portanto, os novos dados cadastrados são perdidos quando o servidor é reiniciado.

## 9. Observações sobre segurança

- O canal de orientação anônima não exige identificação da pessoa.
- O backend não armazena IP ou conteúdo das mensagens em logs.
- O registro de encaminhamentos não permite campos de identificação pessoal.
- São realizadas validações dos dados recebidos pela API.

Esta versão é um protótipo acadêmico e não deve ser considerada um sistema pronto para utilização em produção.