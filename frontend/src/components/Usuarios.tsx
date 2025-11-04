import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Funcionario } from '../types';
import { NivelPermissao } from '../types';
import './Usuarios.css';

export function Usuarios() {
  const [users, setUsers] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Funcionario | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    telefone: '',
    endereco: '',
    usuario: '',
    senha: '',
    nivelPermissao: NivelPermissao.OPERADOR,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await apiService.listUsers();
      setUsers(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiService.cadastrarUsuario(formData);
      setSuccess('Usuário cadastrado com sucesso!');
      setShowModal(false);
      resetForm();
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar usuário');
    }
  };

  const handleEdit = (user: Funcionario) => {
    setEditingUser(user);
    setFormData({
      id: user.id,
      nome: user.nome,
      telefone: user.telefone,
      endereco: user.endereco,
      usuario: user.usuario,
      senha: '',
      nivelPermissao: user.nivelPermissao,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiService.atualizarUsuario(editingUser!.id, formData);
      setSuccess('Usuário atualizado com sucesso!');
      setShowEditModal(false);
      resetForm();
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar usuário');
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await apiService.excluirUsuario(userId);
      setSuccess('Usuário excluído com sucesso!');
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir usuário');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      nome: '',
      telefone: '',
      endereco: '',
      usuario: '',
      senha: '',
      nivelPermissao: NivelPermissao.OPERADOR,
    });
    setEditingUser(null);
  };

  const getPermissaoLabel = (nivel: NivelPermissao) => {
    switch (nivel) {
      case NivelPermissao.ADMINISTRADOR:
        return 'Administrador';
      case NivelPermissao.ENGENHEIRO:
        return 'Engenheiro';
      case NivelPermissao.OPERADOR:
        return 'Operador';
    }
  };

  const getPermissaoBadgeClass = (nivel: NivelPermissao) => {
    switch (nivel) {
      case NivelPermissao.ADMINISTRADOR:
        return 'administrador';
      case NivelPermissao.ENGENHEIRO:
        return 'engenheiro';
      case NivelPermissao.OPERADOR:
        return 'operador';
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Gerenciar Usuários</h2>
        <button onClick={() => setShowModal(true)} className="add-button">
          + Novo Usuário
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      {/* Modal de Cadastro */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Cadastrar Novo Usuário</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ID:</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nome:</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Telefone:</label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Endereço:</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Usuário:</label>
                <input
                  type="text"
                  value={formData.usuario}
                  onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Senha:</label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nível de Permissão:</label>
                <select
                  value={formData.nivelPermissao}
                  onChange={(e) =>
                    setFormData({ ...formData, nivelPermissao: e.target.value as NivelPermissao })
                  }
                  required
                >
                  <option value={NivelPermissao.OPERADOR}>Operador</option>
                  <option value={NivelPermissao.ENGENHEIRO}>Engenheiro</option>
                  <option value={NivelPermissao.ADMINISTRADOR}>Administrador</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-button">
                  Cancelar
                </button>
                <button type="submit" className="save-button">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Editar Usuário</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>ID:</label>
                <input type="text" value={editingUser?.id} disabled />
              </div>
              <div className="form-group">
                <label>Nome:</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Telefone:</label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Endereço:</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Usuário:</label>
                <input
                  type="text"
                  value={formData.usuario}
                  onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nova Senha (deixe vazio para manter):</label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Nível de Permissão:</label>
                <select
                  value={formData.nivelPermissao}
                  onChange={(e) =>
                    setFormData({ ...formData, nivelPermissao: e.target.value as NivelPermissao })
                  }
                  required
                >
                  <option value={NivelPermissao.OPERADOR}>Operador</option>
                  <option value={NivelPermissao.ENGENHEIRO}>Engenheiro</option>
                  <option value={NivelPermissao.ADMINISTRADOR}>Administrador</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="cancel-button"
                >
                  Cancelar
                </button>
                <button type="submit" className="save-button">
                  Atualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        {users.length === 0 ? (
          <div className="empty-state">Nenhum usuário cadastrado.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Usuário</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Permissão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nome}</td>
                  <td>{user.usuario}</td>
                  <td>{user.telefone}</td>
                  <td>{user.endereco}</td>
                  <td>
                    <span className={`badge ${getPermissaoBadgeClass(user.nivelPermissao)}`}>
                      {getPermissaoLabel(user.nivelPermissao)}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      onClick={() => handleEdit(user)}
                      className="edit-button"
                      title="Editar"
                      aria-label="Editar"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/>
                        <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.nome)}
                      className="delete-button"
                      title="Excluir"
                      aria-label="Excluir"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 7h12l-1 14H7L6 7z" fill="currentColor"/>
                        <path d="M9 4h6v2H9V4z" fill="currentColor"/>
                        <path d="M4 6h16v2H4V6z" fill="currentColor"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

