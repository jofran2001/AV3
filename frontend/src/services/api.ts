import type { Aeronave, Funcionario, Teste, Peca } from '../types';
import { TipoAeronave, TipoPeca, StatusPeca, NivelPermissao, TipoTeste, ResultadoTeste } from '../types';

const API_URL = 'http://localhost:3001/api';

class ApiService {
  private sessionId: string | null = null;

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  clearSession() {
    this.sessionId = null;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.sessionId && { Authorization: `Bearer ${this.sessionId}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: { ...this.getHeaders(), ...options.headers },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }

    return data;
  }

  // Auth
  async login(usuario: string, senha: string) {
    const data = await this.request<{ sessionId: string; user: Funcionario }>('/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, senha }),
    });
    this.setSessionId(data.sessionId);
    return data;
  }

  async logout() {
    await this.request('/logout', { method: 'POST' });
    this.clearSession();
  }

  // Aeronaves
  async listAeronaves(): Promise<Aeronave[]> {
    return this.request<Aeronave[]>('/aeronaves');
  }

  async getAeronave(codigo: string): Promise<Aeronave> {
    return this.request<Aeronave>(`/aeronaves/${codigo}`);
  }

  async cadastrarAeronave(aeronave: {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcanceKm: number;
  }) {
    return this.request<{ success: boolean; message: string }>('/aeronaves', {
      method: 'POST',
      body: JSON.stringify(aeronave),
    });
  }

  async atualizarAeronave(
    codigo: string,
    updates: Partial<Pick<Aeronave, 'modelo' | 'tipo' | 'capacidade' | 'alcanceKm'>>
  ) {
    return this.request<{ success: boolean; message: string }>(`/aeronaves/${codigo}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async excluirAeronave(codigo: string) {
    return this.request<{ success: boolean; message: string }>(`/aeronaves/${codigo}`, {
      method: 'DELETE',
    });
  }

  async adicionarPeca(codigo: string, peca: { nome: string; tipo: TipoPeca; fornecedor: string }) {
    return this.request<{ success: boolean; message: string }>(`/aeronaves/${codigo}/pecas`, {
      method: 'POST',
      body: JSON.stringify(peca),
    });
  }

  async listarPecas(codigo: string) {
    return this.request<Peca[]>(`/aeronaves/${codigo}/pecas`);
  }

  async obterPeca(codigo: string, idx: number) {
    return this.request<Peca>(`/aeronaves/${codigo}/pecas/${idx}`);
  }

  async adicionarEtapa(codigo: string, etapa: { nome: string; prazoDias: number }) {
    return this.request<{ success: boolean; message: string }>(`/aeronaves/${codigo}/etapas`, {
      method: 'POST',
      body: JSON.stringify(etapa),
    });
  }

  async registrarTeste(codigo: string, teste: { tipo: TipoTeste; resultado: ResultadoTeste }) {
    return this.request<{ success: boolean; message: string }>(`/aeronaves/${codigo}/testes`, {
      method: 'POST',
      body: JSON.stringify(teste),
    });
  }

  async listarTestes(codigo: string) {
    return this.request<Teste[]>(`/aeronaves/${codigo}/testes`);
  }

  async obterTeste(codigo: string, idx: number) {
    return this.request<Teste>(`/aeronaves/${codigo}/testes/${idx}`);
  }

  async atualizarTeste(
    codigo: string,
    idx: number,
    updates: { tipo?: TipoTeste; resultado?: ResultadoTeste }
  ) {
    return this.request<{ success: boolean; message: string }>(`/aeronaves/${codigo}/testes/${idx}` , {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async excluirTeste(codigo: string, idx: number) {
    return this.request<{ success: boolean; message: string }>(`/aeronaves/${codigo}/testes/${idx}`, {
      method: 'DELETE',
    });
  }

  async atualizarStatusPeca(codigo: string, idx: number, status: StatusPeca) {
    return this.request<{ success: boolean }>(`/aeronaves/${codigo}/pecas/${idx}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async atualizarPeca(
    codigo: string,
    idx: number,
    updates: { nome?: string; tipo?: TipoPeca; fornecedor?: string; status?: StatusPeca }
  ) {
    return this.request<{ success: boolean; message: string }>(`/aeronaves/${codigo}/pecas/${idx}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async excluirPeca(codigo: string, idx: number) {
    return this.request<{ success: boolean; message: string }>(`/aeronaves/${codigo}/pecas/${idx}`, {
      method: 'DELETE',
    });
  }

  async avancarEtapa(codigo: string, idx: number) {
    return this.request<{ success: boolean }>(`/aeronaves/${codigo}/etapas/${idx}/avancar`, {
      method: 'POST',
    });
  }

  async concluirEtapa(codigo: string, idx: number) {
    return this.request<{ success: boolean }>(`/aeronaves/${codigo}/etapas/${idx}/concluir`, {
      method: 'POST',
    });
  }

  async associarFuncionarioEtapa(codigo: string, idx: number, funcionarioId: string) {
    return this.request<{ success: boolean }>(`/aeronaves/${codigo}/etapas/${idx}/funcionario`, {
      method: 'POST',
      body: JSON.stringify({ funcionarioId }),
    });
  }

  async gerarRelatorio(codigo: string) {
    return this.request<{ success: boolean; file: string }>(`/aeronaves/${codigo}/relatorio`, {
      method: 'POST',
    });
  }

  // Usuários
  async listUsers(): Promise<Funcionario[]> {
    return this.request<Funcionario[]>('/users');
  }

  async cadastrarUsuario(usuario: {
    id: string;
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao: NivelPermissao;
  }) {
    return this.request<{ success: boolean; message: string }>('/users', {
      method: 'POST',
      body: JSON.stringify(usuario),
    });
  }

  async atualizarUsuario(id: string, usuario: Partial<Funcionario>) {
    return this.request<{ success: boolean; message: string }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario),
    });
  }

  async excluirUsuario(id: string) {
    return this.request<{ success: boolean; message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

