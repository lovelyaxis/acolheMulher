# Documentação de Instalação, Configuração e Backup — AcolheMulher

Este documento explica como configurar o banco de dados MySQL, o Prisma, as migrations, o Seed e a estratégia de backup do projeto AcolheMulher.

## 1. Como instalar e configurar o MySQL

### 1.1 Instalação (Windows)

1. Baixe o MySQL Installer em: https://dev.mysql.com/downloads/installer/
2. Escolha a opção "Full" ou "Server Only" durante a instalação.
3. Durante a configuração, defina:
   - **Tipo de servidor:** Development Computer
   - **Porta TCP/IP:** 3306
   - **Método de autenticação:** Legacy (MySQL 5.x) ou Strong (MySQL 8.x) — ambos funcionam
   - **Senha do root:** anote esta senha; ela será usada no `.env`
4. Conclua a instalação e inicie o serviço MySQL.

### 1.2 Verificar se o MySQL está rodando

Abra o prompt de comando e execute:

```powershell
mysql --version
```

Se o comando não for encontrado, adicione o MySQL ao PATH:
- Geralmente em: `C:\Program Files\MySQL\MySQL Server 8.x\bin`

### 1.3 Criar o banco de dados

Acesse o MySQL como root:

```powershell
mysql -u root -p
```

No prompt do MySQL, crie o banco:

```sql
CREATE DATABASE acolhemulher CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

> O banco deve se chamar exatamente `acolhemulher`.

---

## 2. Como configurar o arquivo .env

O arquivo `.env` fica em `backend/.env`. Copie o exemplo e preencha com seus dados reais:

```powershell
cd backend
copy .env.example .env
```

Edite o `backend/.env`:

```
DATABASE_URL="mysql://root:SUA_SENHA_AQUI@localhost:3306/acolhemulher"
```

Substitua `SUA_SENHA_AQUI` pela senha do root definida na instalação do MySQL.

> ⚠️ Nunca commite o arquivo `.env` com senhas reais. Ele está no `.gitignore`.
> Use `.env.example` como referência para novos integrantes.

---

## 3. Como executar as migrations

Dentro da pasta `backend/`:

```powershell
# 1. Instalar dependências (se ainda não instalado)
npm install

# 2. Gerar o Prisma Client
npx prisma generate

# 3. Executar a migration inicial (cria as 4 tabelas, chaves, índices, restrições)
npx prisma migrate dev --name inicial
```

Após a migration, o banco terá as tabelas:
- `usuario`
- `unidade`
- `encaminhamento`
- `orientacaoAnonima`

Para aplicar migrations em produção (sem criar novas):

```powershell
npx prisma migrate deploy
```

---

## 4. Como executar o Seed

O Seed popula o banco com dados fictícios para demonstração:

```powershell
cd backend
node prisma/seed.js
```

O Seed cadastra:
- 1 administrador: `admin@acolhemulher.com.br` / `Admin2026!`
- 2 profissionais: `ana@acolhemulher.com.br` / `Acolhe2026!` e `carla@acolhemulher.com.br` / `Acolhe2026!`
- 7 unidades de atendimento (incluindo 1 inativa)
- 4 encaminhamentos demonstrativos
- 0 mensagens de orientação anônima (tabela intencionalmente vazia)

O Seed é **idempotente**: pode ser executado várias vezes sem criar duplicatas.

> As senhas são hasheadas com `bcrypt` (10 salt rounds), o mesmo algoritmo que o backend usará para autenticação. Não reutilizamos o SHA-256 do mock do navegador.

---

## 5. Como visualizar as tabelas

### 5.1 Prisma Studio (recomendado)

```powershell
cd backend
npx prisma studio
```

Isso abre uma interface web em `http://localhost:5555` onde você pode visualizar e editar todas as tabelas.

### 5.2 MySQL Workbench

1. Abra o MySQL Workbench.
2. Conecte-se ao servidor local (localhost:3306).
3. Expanda o banco `acolhemulher`.
4. Consulte as tabelas com comandos SQL, por exemplo:

```sql
SELECT * FROM usuario;
SELECT * FROM unidade;
SELECT * FROM encaminhamento;
SELECT * FROM orientacaoAnonima;
```

### 5.3 Linha de comando (mysql CLI)

```powershell
mysql -u root -p acolhemulher -e "SELECT * FROM usuario;"
```

---

## 6. Como restaurar o banco a partir de um backup

### 6.1 Fazer backup manual (mysqldump)

```powershell
mysqldump -u root -p acolhemulher > backup_acolhemulher_$(date +%Y%m%d_%H%M%S).sql
```

### 6.2 Restaurar backup

```powershell
mysql -u root -p acolhemulher < arquivo_backup.sql
```

### 6.3 Recriar do zero (migrations + seed)

Se precisar recriar o banco do zero:

```powershell
# Drop e recria o banco
mysql -u root -p -e "DROP DATABASE acolhemulher; CREATE DATABASE acolhemulher CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Executa migrations
cd backend
npx prisma migrate dev --name inicial

# Executa seed
node prisma/seed.js
```

---

## 7. Estratégia de backup (RNF007)

O requisito **RNF007** prevê:
- Backup automático do banco de dados todos os dias às 02h00
- Retenção dos últimos 30 dias

### 7.1 Script de backup (Windows)

Crie o arquivo `backend/scripts/backup-db.bat`:

```batch
@echo off
setlocal

set BACKUP_DIR=C:\backups\acolhemulher
set MYSQL_USER=root
set MYSQL_PASS=SUA_SENHA_AQUI
set DB_NAME=acolhemulher

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

set DATE_STR=%date:~10,4%%date:~7,2%%date:~4,2%
set TIME_STR=%time:~0,2%%time:~3,2%
if "%TIME_STR:~0,1%"==" " set TIME_STR=0%TIME_STR:~1,1%

set BACKUP_FILE="%BACKUP_DIR%\backup_%DATE_STR%_%TIME_STR%.sql"

mysqldump -u %MYSQL_USER% -p%MYSQL_PASS% %DB_NAME% > %BACKUP_FILE%

:: Remover backups com mais de 30 dias
forfiles /p "%BACKUP_DIR%" /m *.sql /d -30 /c "cmd /c del @path"

echo Backup concluído: %BACKUP_FILE%
```

### 7.2 Agendamento automático (Task Scheduler)

Para executar diariamente às 02h00 no Windows:

1. Abra o **Agendador de Tarefas** (Task Scheduler).
2. Clique em "Criar Tarefa Básica".
3. Nome: `Backup AcolheMulher`.
4. Gatilho: Diariamente, às 02:00.
5. Ação: Iniciar um programa → `C:\caminho\para\acolheMulher\backend\scripts\backup-db.bat`.
6. Conclua e verifique na biblioteca de tarefas.

### 7.3 Em ambiente de hospedagem (Linux/Docker)

Se o sistema for hospedado em Linux ou Docker, use um `cron job`:

```bash
# Edite o crontab:
crontab -e

# Adicione a linha:
0 2 * * * /usr/bin/mysqldump -u root -pSUA_SENHA acolhemulher > /backups/acolhemulher/backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql

# E para limpeza de backups antigos (mais de 30 dias):
0 3 * * * find /backups/acolhemulher/ -name "*.sql" -mtime +30 -delete
```

> A execução automática deve ser configurada no ambiente de hospedagem. Não basta criar apenas o script ou o comando manual.

---

## 8. Resumo de comandos

| Comando | Descrição |
|---------|-----------|
| `npm install` | Instala dependências do backend |
| `npx prisma generate` | Gera o Prisma Client |
| `npx prisma migrate dev --name inicial` | Executa migrations |
| `npx prisma studio` | Abre interface visual do banco |
| `node prisma/seed.js` | Popula dados fictícios |
| `npx prisma migrate deploy` | Aplica migrations em produção |

---

## 9. Estrutura do backend

```
backend/
├── .env                  # Variáveis de ambiente (não commitar)
├── .env.example          # Exemplo de .env (commitar)
├── .gitignore            # Arquivos ignorados pelo git
├── package.json          # Dependências e scripts
├── prisma/
│   ├── schema.prisma     # Modelo de dados (fonte oficial)
│   └── seed.js           # Seed de dados fictícios
└── node_modules/
```

---

## 10. Critério de conclusão

Qualquer integrante da equipe deve conseguir:
1. Clonar o projeto
2. Instalar o MySQL e criar o banco `acolhemulher`
3. Copiar `.env.example` para `.env` e preencher a senha
4. Rodar `npm install` no backend
5. Rodar `npx prisma generate`
6. Rodar `npx prisma migrate dev --name inicial`
7. Rodar `node prisma/seed.js`
8. Consultar os registros via Prisma Studio ou MySQL Workbench

Sem precisar criar tabelas manualmente.
