import express, { Request, Response } from 'express';
import cors from 'cors';
import { AuthService } from './auth/authService.prisma';
import { ProductionService } from './services/productionService.prisma';
import { Aeronave, Peca, Etapa, Teste, Funcionario } from './classes/models';
import { NivelPermissao, TipoAeronave, TipoPeca, StatusPeca, StatusEtapa, TipoTeste, ResultadoTeste } from './enums';
import { timingMiddleware } from './middleware/timingMiddleware';
import { timingHeadersMiddleware } from './middleware/timingHeadersMiddleware';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(timingHeadersMiddleware); 
app.use(timingMiddleware);

const authService = new AuthService();
const prodService = new ProductionService();

const sessions: { [key: string]: Funcionario } = {};

app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { usuario, senha } = req.body;
    const user = await authService.authenticate(usuario, senha);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const sessionId = Math.random().toString(36).substring(7);
    sessions[sessionId] = user;
    res.json({ sessionId, user: { ...user, senha: undefined } });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

function requireAuth(req: Request, res: Response, next: () => void) {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  (req as any).user = sessions[sessionId];
  next();
}

app.post('/api/logout', requireAuth, (req: Request, res: Response) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (sessionId) {
    delete sessions[sessionId];
  }
  res.json({ success: true });
});

app.get('/api/aeronaves', requireAuth, async (req: Request, res: Response) => {
  try {
    const aeronaves = await prodService.listAeronaves();
    res.json(aeronaves);
  } catch (e: any) {
    res.status(500).json({ error: e.message }); 
  }
});

app.get('/api/aeronaves/:codigo', requireAuth, async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;
    const a = await prodService.getAeronave(codigo); 
    if (!a) {
      return res.status(404).json({ error: 'Aeronave não encontrada' });
    }
    res.json(a);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/aeronaves', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (![NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO].includes(user.nivelPermissao)) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    const { codigo, modelo, tipo, capacidade, alcanceKm } = req.body;
    const a = new Aeronave(codigo, modelo, tipo, capacidade, alcanceKm);
    await prodService.cadastrarAeronave(a);
    res.json({ success: true, message: 'Aeronave cadastrada' });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); 
  }
});

// Atualizar aeronave
app.put('/api/aeronaves/:codigo', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (![NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO].includes(user.nivelPermissao)) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    const { codigo } = req.params;
    const { modelo, tipo, capacidade, alcanceKm } = req.body;
    await prodService.atualizarAeronave(codigo, { modelo, tipo, capacidade, alcanceKm }); // Adicionado await
    res.json({ success: true, message: 'Aeronave atualizada' });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Excluir aeronave
app.delete('/api/aeronaves/:codigo', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (user.nivelPermissao !== NivelPermissao.ADMINISTRADOR) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    const { codigo } = req.params;
    await prodService.excluirAeronave(codigo); // Adicionado await
    res.json({ success: true, message: 'Aeronave excluída' });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Adicionar peça
app.post('/api/aeronaves/:codigo/pecas', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (![NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO].includes(user.nivelPermissao)) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    const { codigo } = req.params;
    const { nome, tipo, fornecedor } = req.body;
    const p = new Peca(nome, tipo, fornecedor);
    p.status = StatusPeca.EM_PRODUCAO;
    await prodService.adicionarPeca(codigo, p); // Adicionado await
    res.json({ success: true, message: 'Peça adicionada' });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Listar peças
app.get('/api/aeronaves/:codigo/pecas', requireAuth, async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;
    const pecas = await prodService.listarPecas(codigo); // Adicionado await
    res.json(pecas);
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Obter peça específica
app.get('/api/aeronaves/:codigo/pecas/:idx', requireAuth, async (req: Request, res: Response) => {
  try {
    const { codigo, idx } = req.params;
    const peca = await prodService.obterPeca(codigo, parseInt(idx)); // Adicionado await
    if (!peca) {
      return res.status(404).json({ error: 'Peça inválida ou não encontrada' });
    }
    res.json(peca);
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Adicionar etapa
app.post('/api/aeronaves/:codigo/etapas', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (![NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO].includes(user.nivelPermissao)) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    const { codigo } = req.params;
    const { nome, prazoDias } = req.body;
    const e = new Etapa(nome, prazoDias);
    await prodService.adicionarEtapa(codigo, e); // Adicionado await
    res.json({ success: true, message: 'Etapa adicionada' });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Registrar teste
app.post('/api/aeronaves/:codigo/testes', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (![NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR].includes(user.nivelPermissao)) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    const { codigo } = req.params;
    const { tipo, resultado } = req.body;
    const t = new Teste(tipo, resultado);
    await prodService.registrarTeste(codigo, t); // Adicionado await
    res.json({ success: true, message: 'Teste registrado' });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Listar testes da aeronave
app.get('/api/aeronaves/:codigo/testes', requireAuth, async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;
    const testes = await prodService.listarTestes(codigo); // Adicionado await
    res.json(testes);
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Obter teste específico
app.get('/api/aeronaves/:codigo/testes/:idx', requireAuth, async (req: Request, res: Response) => {
  try {
    const { codigo, idx } = req.params;
    const teste = await prodService.obterTeste(codigo, parseInt(idx)); // Adicionado await
    if (!teste) {
      return res.status(404).json({ error: 'Teste inválido ou não encontrado' });
    }
    res.json(teste);
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Atualizar teste
app.put('/api/aeronaves/:codigo/testes/:idx', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (![NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO].includes(user.nivelPermissao)) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    const { codigo, idx } = req.params;
    const { tipo, resultado } = req.body;
    await prodService.atualizarTeste(codigo, parseInt(idx), { tipo, resultado }); // Adicionado await
    res.json({ success: true, message: 'Teste atualizado' });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Excluir teste
app.delete('/api/aeronaves/:codigo/testes/:idx', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (![NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO].includes(user.nivelPermissao)) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    const { codigo, idx } = req.params;
    await prodService.excluirTeste(codigo, parseInt(idx)); // Adicionado await
    res.json({ success: true, message: 'Teste excluído' });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Atualizar status peça
app.put('/api/aeronaves/:codigo/pecas/:idx/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const { codigo, idx } = req.params;
    const { status } = req.body;
    await prodService.atualizarStatusPeca(codigo, parseInt(idx), status); // Adicionado await
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Atualizar peça (campos gerais)
app.put('/api/aeronaves/:codigo/pecas/:idx', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (![NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO].includes(user.nivelPermissao)) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    const { codigo, idx } = req.params;
    const { nome, tipo, fornecedor, status } = req.body;
    await prodService.atualizarPeca(codigo, parseInt(idx), { nome, tipo, fornecedor, status }); // Adicionado await
    res.json({ success: true, message: 'Peça atualizada' });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Excluir peça
app.delete('/api/aeronaves/:codigo/pecas/:idx', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (![NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO].includes(user.nivelPermissao)) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    const { codigo, idx } = req.params;
    await prodService.excluirPeca(codigo, parseInt(idx)); // Adicionado await
    res.json({ success: true, message: 'Peça excluída' });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Avançar etapa
app.post('/api/aeronaves/:codigo/etapas/:idx/avancar', requireAuth, async (req: Request, res: Response) => {
  try {
    const { codigo, idx } = req.params;
    await prodService.avancarEtapa(codigo, parseInt(idx)); // Adicionado await
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Concluir etapa
app.post('/api/aeronaves/:codigo/etapas/:idx/concluir', requireAuth, async (req: Request, res: Response) => {
  try {
    const { codigo, idx } = req.params;
    await prodService.concluirEtapa(codigo, parseInt(idx)); // Adicionado await
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Associar funcionário à etapa
app.post('/api/aeronaves/:codigo/etapas/:idx/funcionario', requireAuth, async (req: Request, res: Response) => {
  try {
    const { codigo, idx } = req.params;
    const { funcionarioId } = req.body;
    await prodService.associarFuncionarioEtapa(codigo, parseInt(idx), funcionarioId); // Adicionado await
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Gerar e baixar relatório em PDF
app.post('/api/aeronaves/:codigo/relatorio', requireAuth, async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;
    const pdfPath = await prodService.gerarRelatorio(codigo);
    
    // Configura headers manualmente antes dos middlewares
    const fs = await import('fs');
    const path = await import('path');
    
    const fileName = `relatorio_${codigo}.pdf`;
    const stat = fs.statSync(pdfPath);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', stat.size);
    
    // Envia o arquivo como stream
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
    
    // Trata erros no stream
    fileStream.on('error', (err) => {
      console.error('Erro ao ler arquivo PDF:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erro ao enviar relatório' });
      }
    });
    
  } catch (e: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: e.message });
    }
  }
});

// Listar usuários
app.get('/api/users', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (user.nivelPermissao !== NivelPermissao.ADMINISTRADOR) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    const users = await authService.listUsers(); // Adicionado await
    res.json(users.map(u => ({ ...u, senha: undefined })));
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Cadastrar usuário
app.post('/api/users', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (user.nivelPermissao !== NivelPermissao.ADMINISTRADOR) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    const { id, nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;
    const f = new Funcionario(id, nome, telefone, endereco, usuario, senha, nivelPermissao);
    await authService.registerByActor(f, user.id); // Adicionado await
    res.json({ success: true, message: 'Usuário cadastrado' });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Atualizar usuário
app.put('/api/users/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const existing = await authService.getUserById(id); // Adicionado await
    if (!existing) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const { nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;
    const novaSenha = senha && senha.length > 0 ? senha : existing.senha;
    const updated = new Funcionario(id, nome, telefone, endereco, usuario, novaSenha, nivelPermissao);
    await authService.updateUser(updated, user.id); // Adicionado await
    res.json({ success: true, message: 'Usuário atualizado' });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

// Excluir usuário
app.delete('/api/users/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    await authService.deleteUser(id, user.id); // Adicionado await
    res.json({ success: true, message: 'Usuário excluído' });
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // Catch padronizado
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});