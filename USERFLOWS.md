# Userflows - Aerocode

Documentação completa dos fluxos de usuário para cada tipo de perfil no sistema Aerocode.

---

## 📋 Índice

1. [ADMINISTRADOR](#administrador)
2. [ENGENHEIRO](#engenheiro)
3. [OPERADOR](#operador)

---

## 👤 ADMINISTRADOR

### Userflow 1: Cadastrar Novo Funcionário

**Objetivo:** Adicionar um novo usuário ao sistema com permissões específicas.

**Passos:**
1. ✅ Usuário acessa `http://localhost:5173`
2. ✅ Visualiza tela de **Login** com campos "Usuário" e "Senha"
3. ✅ Informa credenciais: `admin` / `admin123`
4. ✅ Clica em **"Entrar"**
5. ✅ Sistema autentica e redireciona para **Dashboard**
6. ✅ Navbar exibe: "Administrador" no canto superior direito
7. ✅ Usuário visualiza links: Dashboard, Aeronaves, Peças, Etapas, Testes, **Usuários**
8. ✅ Clica no link **"Usuários"** na navbar
9. ✅ Tela de **Gerenciamento de Usuários** carrega
10. ✅ Visualiza lista de usuários cadastrados (tabela)
11. ✅ Clica no botão **"+ Novo Usuário"** (canto superior direito)
12. ✅ Modal de **"Cadastrar Novo Usuário"** abre
13. ✅ Preenche campos:
    - **ID:** `eng01`
    - **Nome:** `João Silva`
    - **Telefone:** `(11) 98765-4321`
    - **Endereço:** `Rua Exemplo, 123`
    - **Usuário:** `joao.silva`
    - **Senha:** `senha123`
    - **Nível de Permissão:** `Engenheiro`
14. ✅ Clica em **"Salvar"**
15. ✅ Sistema valida e salva novo usuário
16. ✅ Mensagem verde **"Usuário cadastrado com sucesso!"** exibida
17. ✅ Modal fecha automaticamente
18. ✅ Tabela de usuários atualiza mostrando novo registro
19. ✅ Novo usuário pode fazer login imediatamente

**Pontos de Decisão:**
- Se campos obrigatórios estiverem vazios → Erro de validação
- Se ID já existir → Erro "Código já existe"

---

### Userflow 2: Editar Funcionário Existente

**Objetivo:** Atualizar informações de um funcionário cadastrado.

**Passos:**
1. ✅ Login como administrador
2. ✅ Navega para **"Usuários"**
3. ✅ Visualiza lista de usuários
4. ✅ Localiza o usuário desejado na tabela
5. ✅ Clica no botão **"Editar"** na linha do usuário
6. ✅ Modal **"Editar Usuário"** abre com dados pré-preenchidos
7. ✅ Campo ID está **desabilitado** (não pode ser alterado)
8. ✅ Usuário modifica:
    - **Nome:** `João Silva Pereira` (novo)
    - **Telefone:** `(11) 98765-9999` (novo)
    - **Senha:** deixa vazio (mantém a atual)
9. ✅ Clica em **"Atualizar"**
10. ✅ Sistema salva alterações
11. ✅ Mensagem **"Usuário atualizado com sucesso!"** exibida
12. ✅ Tabela atualiza com dados modificados

**Pontos de Decisão:**
- Se preencher senha nova → Senha é alterada
- Se deixar senha vazia → Mantém senha atual

---

### Userflow 3: Cadastrar Nova Aeronave

**Objetivo:** Registrar uma nova aeronave no sistema de produção.

**Passos:**
1. ✅ Login como administrador
2. ✅ Navega para **"Aeronaves"**
3. ✅ Visualiza tabela de aeronaves existentes
4. ✅ Clica em **"+ Nova Aeronave"**
5. ✅ Modal abre com formulário
6. ✅ Preenche:
    - **Código Único:** `A320-BR001`
    - **Modelo:** `Airbus A320`
    - **Tipo:** `Comercial`
    - **Capacidade:** `180`
    - **Alcance (km):** `6150`
7. ✅ Clica em **"Salvar"**
8. ✅ Aeronave cadastrada com sucesso
9. ✅ Aparece na tabela imediatamente
10. ✅ Pode adicionar peças, etapas e testes a ela

**Pontos de Decisão:**
- Se código já existir → Erro

---

### Userflow 4: Adicionar Peça a uma Aeronave

**Objetivo:** Registrar uma peça na aeronave e acompanhar seu status.

**Passos:**
1. ✅ Login como administrador
2. ✅ Navega para **"Peças"**
3. ✅ Seletor de aeronave carrega (primeira aeronave selecionada por padrão)
4. ✅ Se necessário, seleciona outra aeronave no dropdown
5. ✅ Clica em **"+ Nova Peça"**
6. ✅ Modal abre
7. ✅ Preenche:
    - **Nome da Peça:** `Asa Direita`
    - **Tipo:** `Nacional`
    - **Fornecedor:** `Indústrias ABC`
8. ✅ Clica em **"Salvar"**
9. ✅ Peça adicionada com status **"EM_PRODUCAO"** automaticamente
10. ✅ Card da peça aparece no grid
11. ✅ Para atualizar status, seleciona novo status no dropdown do card
12. ✅ Status muda visualmente (cores diferentes)

**Status Possíveis:**
- 🔵 **EM_PRODUCAO** (Amarelo)
- 🔵 **EM_TRANSPORTE** (Azul)
- ✅ **PRONTA** (Verde)

---

### Userflow 5: Criar e Gerenciar Etapas de Produção

**Objetivo:** Definir etapas de produção e controlar seu progresso.

**Passos:**
1. ✅ Login como administrador
2. ✅ Navega para **"Etapas"**
3. ✅ Seleciona aeronave no dropdown
4. ✅ Clica em **"+ Nova Etapa"**
5. ✅ Preenche modal:
    - **Nome:** `Montagem da Fuselagem`
    - **Prazo (dias):** `30`
6. ✅ Clica em **"Salvar"**
7. ✅ Etapa criada com status **"PENDENTE"**
8. ✅ Aparece na lista de etapas
9. ✅ Para avançar: seleciona "Avançar para ANDAMENTO" no dropdown
10. ✅ Status muda para **"ANDAMENTO"**
11. ✅ Para concluir: seleciona "Concluir" no dropdown
12. ✅ Status muda para **"CONCLUIDA"** (verde)
13. ✅ Para associar funcionário: seleciona no dropdown "Associar Funcionário"
14. ✅ Funcionário aparece na lista de associados

**Regras de Negócio:**
- Só avança etapa se a anterior estiver concluída (exceto primeira)
- Etapas concluídas ficam desabilitadas

---

### Userflow 6: Registrar Teste

**Objetivo:** Documentar testes realizados na aeronave.

**Passos:**
1. ✅ Login como administrador
2. ✅ Navega para **"Testes"**
3. ✅ Seleciona aeronave
4. ✅ Visualiza estatísticas no topo (total, aprovados, reprovados)
5. ✅ Clica em **"+ Novo Teste"**
6. ✅ Modal abre
7. ✅ Preenche:
    - **Tipo:** `Hidráulico`
    - **Resultado:** `Aprovado`
8. ✅ Clica em **"Salvar"**
9. ✅ Teste aparece no grid com badge colorido
10. ✅ Estatísticas atualizam automaticamente

---

### Userflow 7: Excluir Usuário

**Objetivo:** Remover usuário do sistema.

**Passos:**
1. ✅ Login como administrador
2. ✅ Navega para **"Usuários"**
3. ✅ Localiza usuário na tabela
4. ✅ Clica em **"Excluir"** (botão vermelho)
5. ✅ Sistema exibe confirmação: "Tem certeza que deseja excluir o usuário [Nome]?"
6. ✅ Usuário clica em **"OK"** no diálogo
7. ✅ Sistema valida (não pode excluir último admin)
8. ✅ Usuário removido
9. ✅ Mensagem de sucesso exibida
10. ✅ Tabela atualiza

---

## 🔧 ENGENHEIRO

### Userflow 1: Visualizar Dashboard

**Objetivo:** Acompanhar status geral da produção.

**Passos:**
1. ✅ Login com credenciais de engenheiro
2. ✅ Redireciona para **Dashboard** automaticamente
3. ✅ Visualiza 4 cards de estatísticas:
    - Total de Aeronaves
    - Aeronaves Concluídas
    - Em Andamento
    - Testes Realizados
4. ✅ Grid de aeronaves mostra todas as aeronaves
5. ✅ Cada card exibe:
    - Modelo, Código
    - Tipo, Capacidade, Alcance
    - Quantidade de peças, etapas, testes

**Restrições:**
- ❌ Não vê link "Usuários" na navbar

---

### Userflow 2: Cadastrar Nova Aeronave

**Objetivo:** Registrar nova aeronave no sistema.

**Passos:**
1. ✅ Login como engenheiro
2. ✅ Clica em **"Aeronaves"** na navbar
3. ✅ Clica em **"+ Nova Aeronave"**
4. ✅ Preenche formulário
5. ✅ Salva
6. ✅ Aeronave cadastrada

**Mesmo fluxo que Admin, sem diferenças.**

---

### Userflow 3: Adicionar Peça e Atualizar Status

**Objetivo:** Gerenciar peças da aeronave.

**Passos:**
1. ✅ Login como engenheiro
2. ✅ Navega para **"Peças"**
3. ✅ Seleciona aeronave
4. ✅ Vê lista de peças existentes (se houver)
5. ✅ Adiciona nova peça via modal
6. ✅ Atualiza status de peças existentes
7. ✅ Visualiza badges de nacional/importada
8. ✅ Monitora progresso

---

### Userflow 4: Configurar Etapas de Produção

**Objetivo:** Definir etapas e acompanhar progresso.

**Passos:**
1. ✅ Login como engenheiro
2. ✅ Navega para **"Etapas"**
3. ✅ Cria nova etapa
4. ✅ Avança etapas conforme produção progride
5. ✅ Conclui etapas
6. ✅ Associa funcionários (se carregados)
7. ✅ Visualiza timeline sequencial

---

### Userflow 5: Registrar Testes

**Objetivo:** Documentar testes realizados.

**Passos:**
1. ✅ Login como engenheiro
2. ✅ Navega para **"Testes"**
3. ✅ Vê estatísticas (total, aprovados, reprovados)
4. ✅ Adiciona novo teste
5. ✅ Visualiza histórico de todos os testes
6. ✅ Identifica facilmente resultados por cores

---

## ⚙️ OPERADOR

### Userflow 1: Acesso Limitado ao Sistema

**Objetivo:** Entrar no sistema com permissões reduzidas.

**Passos:**
1. ✅ Login com credenciais de operador
2. ✅ Dashboard carrega
3. ✅ **Navbar mostra apenas:** Dashboard, **Testes**
4. ✅ Não vê links: Aeronaves, Peças, Etapas, Usuários

**Restrições:**
- ❌ Não pode cadastrar aeronaves
- ❌ Não pode gerenciar peças
- ❌ Não pode gerenciar etapas
- ✅ Pode visualizar dashboard
- ✅ **Pode apenas registrar testes**

---

### Userflow 2: Registrar Teste de Aeronave

**Objetivo:** Única ação permitida - documentar testes.

**Passos:**
1. ✅ Login como operador
2. ✅ Navega para **"Testes"** (única ação disponível)
3. ✅ Seleciona aeronave no dropdown
4. ✅ Vê estatísticas no topo
5. ✅ Clica em **"+ Novo Teste"**
6. ✅ Modal abre
7. ✅ Preenche:
    - **Tipo:** `Elétrico`
    - **Resultado:** `Aprovado`
8. ✅ Salva
9. ✅ Teste registrado
10. ✅ Estatísticas atualizam

**Tentativa de Acesso Negado:**
- ❌ Se tentar acessar `/aeronaves` diretamente → Não aparece na navbar
- ❌ Sem botões para outras ações

---

### Userflow 3: Visualizar Dashboard Somente Leitura

**Objetivo:** Acompanhar produção sem poder modificar.

**Passos:**
1. ✅ Login como operador
2. ✅ Visualiza dashboard com:
    - Estatísticas gerais
    - Lista de aeronaves
    - Detalhes de cada aeronave
3. ✅ Pode clicar em "Atualizar" para recarregar dados
4. ✅ Todos os dados são **somente leitura**

---

## 🔐 Comparação de Acesso por Perfil

### ADMINISTRADOR
| Funcionalidade | Acesso |
|----------------|--------|
| Dashboard | ✅ Visualizar |
| Aeronaves | ✅ Criar, Visualizar |
| Peças | ✅ Criar, Visualizar, Atualizar |
| Etapas | ✅ Criar, Visualizar, Avançar |
| Testes | ✅ Criar, Visualizar |
| **Usuários** | ✅ **Criar, Editar, Excluir** |

### ENGENHEIRO
| Funcionalidade | Acesso |
|----------------|--------|
| Dashboard | ✅ Visualizar |
| Aeronaves | ✅ Criar, Visualizar |
| Peças | ✅ Criar, Visualizar, Atualizar |
| Etapas | ✅ Criar, Visualizar, Avançar |
| Testes | ✅ Criar, Visualizar |
| Usuários | ❌ Sem Acesso |

### OPERADOR
| Funcionalidade | Acesso |
|----------------|--------|
| Dashboard | ✅ Visualizar |
| Aeronaves | ❌ Sem Acesso |
| Peças | ❌ Sem Acesso |
| Etapas | ❌ Sem Acesso |
| Testes | ✅ **Criar, Visualizar** |
| Usuários | ❌ Sem Acesso |

---

## 🎯 Casos de Uso Especiais

### Caso 1: Login Inválido
**Fluxo:**
1. Usuário tenta login com credenciais erradas
2. Erro vermelho: "Credenciais inválidas"
3. Permanece na tela de login
4. Pode tentar novamente

### Caso 2: Logout
**Fluxo:**
1. Usuário autenticado clica em **"Sair"** na navbar
2. Sistema limpa sessão
3. Redireciona para tela de login
4. Precisa autenticar novamente

### Caso 3: Sessão Expirada
**Fluxo:**
1. Requisição retorna 401 (não autenticado)
2. Sistema automaticamente redireciona para login
3. Usuário precisa fazer login novamente

### Caso 4: Tentativa de Acesso a Funcionalidade Proibida
**Fluxo:**
1. OPERADOR tenta acessar `/usuarios` diretamente
2. Navbar não mostra o link
3. Se acessar via URL, API retorna 403
4. Erro exibido: "Permissão negada"

---

## 📊 Diagrama de Navegação

```
                    ┌─────────────┐
                    │    LOGIN    │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
    │  ADMIN    │   │ ENGENHEIRO│   │ OPERADOR  │
    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
          │               │               │
    ┌─────▼──────────┬────▼─────┬────┬───▼──────┐
    │   DASHBOARD    │           │    │          │
    ├────────────────┤           │    │          │
    │   AERONAVES    │           │    │          │
    ├────────────────┤           │    │          │
    │     PEÇAS      │           │    │          │
    ├────────────────┤           │    │          │
    │    ETAPAS      │           │    │          │
    ├────────────────┤           │    │          │
    │    TESTES      │───────────┼────┼──────────┤
    ├────────────────┤           │    │          │
    │   USUÁRIOS     │           │    │          │
    │  (SOMENTE      │           │    │          │
    │   ADMIN)       │           │    │          │
    └────────────────┘           │    │          │
                                 │    │          │
                            ┌────▼────▼──────────▼───┐
                            │   SEM ACESSO          │
                            └────────────────────────┘
```

---

## ✅ Checklist de Testes de Userflow

### ADMINISTRADOR
- [ ] Login com admin/admin123
- [ ] Vê todos os 6 links na navbar
- [ ] Cadastra novo usuário
- [ ] Edita usuário existente
- [ ] Exclui usuário
- [ ] Cadastra aeronave
- [ ] Adiciona peça
- [ ] Cria etapa
- [ ] Registra teste
- [ ] Logout funciona

### ENGENHEIRO
- [ ] Login
- [ ] Vê 5 links na navbar (sem Usuários)
- [ ] Cadastra aeronave
- [ ] Gerencia peças
- [ ] Gerencia etapas
- [ ] Registra testes
- [ ] Não acessa Usuários

### OPERADOR
- [ ] Login
- [ ] Vê apenas 2 links (Dashboard, Testes)
- [ ] Visualiza dashboard
- [ ] Registra testes
- [ ] Não vê outras telas
- [ ] Tentativa de acesso negada

---


