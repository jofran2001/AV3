# 🛩️ AeroCode - Sistema de Gestão de Produção Aeronáutica

Sistema completo de gerenciamento de produção de aeronaves com interface web moderna.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [MySQL](https://dev.mysql.com/downloads/) (versão 8.0 ou superior)
- [Git](https://git-scm.com/)

## � Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/jofran2001/AV3.git
cd AV3
```

### 2. Configure o Banco de Dados MySQL

#### Inicie o MySQL:
```bash
sudo systemctl start mysql
```

#### Crie o banco de dados:
```bash
sudo mysql
```

Execute os seguintes comandos no MySQL:
```sql
CREATE DATABASE aerocode;
CREATE USER 'aerocode_user'@'localhost' IDENTIFIED BY 'aerocode123';
GRANT ALL PRIVILEGES ON aerocode.* TO 'aerocode_user'@'localhost';
GRANT CREATE, DROP ON *.* TO 'aerocode_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Instale as Dependências

#### Backend (raiz do projeto):
```bash
npm install
```

#### Frontend:
```bash
cd frontend
npm install
cd ..
```

### 4. Configure o Prisma

#### Gere o Prisma Client:
```bash
npx prisma generate
```

#### Execute as migrations:
```bash
npx prisma migrate dev --name init
```

#### Popule o banco com dados iniciais:
```bash
npx prisma db seed
```

✅ Pronto! O banco está configurado com usuários padrão.

---

## ▶️ Executando a Aplicação

### Modo 1: Desenvolvimento (Recomendado)

Você precisa de **2 terminais** abertos:

#### Terminal 1 - Backend:
```bash
npm run server
```
Aguarde a mensagem: `Server running on http://localhost:3001`

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
Aguarde a mensagem com o link do Vite (geralmente `http://localhost:5173`)

### Modo 2: Produção

```bash
# Build do frontend
cd frontend
npm run build
cd ..

# Inicie o servidor
npm run server
```
Acesse: `http://localhost:3001`

---

## 🔐 Acesso ao Sistema

Abra o navegador em: **http://localhost:5173**

### Usuários Criados Automaticamente:

| Usuário | Senha | Nível | Permissões |
|---------|-------|-------|------------|
| **admin** | admin123 | Administrador | Acesso total + gerenciar usuários |
| **eng1** | eng123 | Engenheiro | Criar aeronaves, peças, etapas, testes |
| **op1** | op123 | Operador | Apenas visualizar e registrar testes |

**Faça login com:** `admin` / `admin123`

---

## 📚 Funcionalidades Principais

### ✈️ Gestão de Aeronaves
- Cadastro de aeronaves (código, modelo, tipo, capacidade, alcance)
- Visualização detalhada
- Edição e exclusão (apenas Admin)

### 🔧 Gestão de Peças
- Adicionar peças às aeronaves
- Atualizar status (Em Produção, Aprovada, Reprovada)
- Controle de fornecedores

### 📊 Etapas de Produção
- Criar etapas com prazos
- Associar funcionários
- Controle de progresso (Pendente → Em Andamento → Concluída)

### 🧪 Testes
- Registro de testes (Elétrico, Hidráulico, Aerodinâmico)
- Resultados (Aprovado/Reprovado)

### 📄 Relatórios
- Geração de relatórios em **PDF** profissionais
- Informações completas da aeronave
- Download automático

### 👥 Gestão de Usuários (Admin)
- Criar, editar e excluir usuários
- Controle de permissões
- Auditoria de ações

---

## 🛠️ Comandos Úteis

### Prisma (Banco de Dados)

```bash
# Visualizar dados (interface web)
npx prisma studio

# Resetar banco de dados (CUIDADO!)
npx prisma migrate reset

# Criar nova migration
npx prisma migrate dev --name <nome>

# Repovoar com dados iniciais
npx prisma db seed
```

### TypeScript

```bash
# Verificar erros
npx tsc --noEmit

# Build
npm run build
```

---

## 📁 Estrutura do Projeto

```
AV3/
├── backend/                 # Código do servidor
│   ├── auth/               # Autenticação
│   ├── classes/            # Modelos de dados
│   ├── db/                 # Configuração Prisma
│   ├── middleware/         # Middlewares (timing, etc)
│   ├── services/           # Lógica de negócio
│   └── server.ts           # Servidor Express
├── frontend/               # Interface React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # API client
│   │   └── types.ts       # Tipos TypeScript
│   └── ...
├── prisma/                # Configuração do banco
│   ├── schema.prisma      # Schema do banco
│   └── seed.ts            # Dados iniciais
├── relatorios/            # PDFs gerados
├── .env                   # Configurações (criado automaticamente)
└── package.json
```

---

## 🐛 Problemas Comuns

### Erro: "Cannot connect to MySQL"
**Solução:** Certifique-se que o MySQL está rodando:
```bash
sudo systemctl status mysql
sudo systemctl start mysql
```

### Erro: "Port 3001 already in use"
**Solução:** Mate o processo na porta:
```bash
pkill -f "ts-node backend/server.ts"
```
Ou mude a porta no `backend/server.ts`

### Erro: "P1001: Can't reach database"
**Solução:** Verifique as credenciais no arquivo `.env`:
```
DATABASE_URL="mysql://aerocode_user:aerocode123@localhost:3306/aerocode"
```

### Frontend não carrega
**Solução:** 
1. Verifique se o backend está rodando na porta 3001
2. Limpe o cache: `cd frontend && rm -rf node_modules && npm install`

---

## 📊 Monitoramento de Performance

O sistema inclui medição automática de performance:

### No Console do Servidor:
```bash
[POST] /api/login - 200 - ⏱️ 152ms | 🔧 145ms | 📤 7ms
```
- ⏱️ Tempo total
- 🔧 Processamento
- 📤 Envio

### No Console do Browser (F12):
```
⏱️  Total: 158ms
🔧 Servidor: 145ms
🌐 Rede: 13ms (↑6ms / ↓7ms)
```

📖 Ver mais em: `docs/PERFORMANCE_MONITORING.md`

---

## 📖 Documentação Adicional

- **PRISMA_SETUP.md** - Guia detalhado do Prisma
- **COMECE_AQUI.md** - Guia passo a passo de ativação
- **RELATORIOS_PDF.md** - Documentação de relatórios
- **TIMING_MIDDLEWARE.md** - Documentação de performance
- **USERFLOWS.md** - Fluxos de usuário detalhados
- **USERFLOWS_VISUAL.md** - Diagramas visuais

---

## 🔒 Segurança

⚠️ **AVISO**: Este projeto é para fins educacionais/demonstração.

Para produção, implemente:
- [ ] Hash de senhas (bcrypt)
- [ ] JWT para autenticação
- [ ] HTTPS
- [ ] Rate limiting
- [ ] Validação de entrada
- [ ] CORS configurado corretamente

---

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- MySQL
- PDFKit (geração de PDFs)

### Frontend
- React 18
- TypeScript
- Vite
- CSS3

---

## 📞 Suporte

Problemas ou dúvidas? Veja a documentação em `docs/` ou abra uma issue no GitHub.

---

## 📝 Licença

Este projeto é licenciado sob a licença MIT.

---

**✨ Desenvolvido para gestão eficiente de produção aeronáutica**
