import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Aeronave } from '../types';
import { TipoAeronave } from '../types';
import './Aeronaves.css';

export function Aeronaves() {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    modelo: '',
    tipo: TipoAeronave.COMERCIAL,
    capacidade: '',
    alcanceKm: '',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAeronave, setEditingAeronave] = useState<Aeronave | null>(null);
  const [editForm, setEditForm] = useState({
    modelo: '',
    tipo: TipoAeronave.COMERCIAL,
    capacidade: '',
    alcanceKm: '',
  });

  useEffect(() => {
    loadAeronaves();
  }, []);

  const loadAeronaves = async () => {
    try {
      const data = await apiService.listAeronaves();
      setAeronaves(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar aeronaves');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiService.cadastrarAeronave({
        codigo: formData.codigo,
        modelo: formData.modelo,
        tipo: formData.tipo,
        capacidade: parseInt(formData.capacidade),
        alcanceKm: parseFloat(formData.alcanceKm),
      });
      setShowModal(false);
      setFormData({
        codigo: '',
        modelo: '',
        tipo: TipoAeronave.COMERCIAL,
        capacidade: '',
        alcanceKm: '',
      });
      setSuccess('Aeronave cadastrada com sucesso!');
      loadAeronaves();
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar aeronave');
    }
  };

  const handleEdit = (a: Aeronave) => {
    setEditingAeronave(a);
    setEditForm({
      modelo: a.modelo,
      tipo: a.tipo,
      capacidade: String(a.capacidade),
      alcanceKm: String(a.alcanceKm),
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAeronave) return;
    setError('');
    setSuccess('');
    try {
      await apiService.atualizarAeronave(editingAeronave.codigo, {
        modelo: editForm.modelo,
        tipo: editForm.tipo,
        capacidade: parseInt(editForm.capacidade),
        alcanceKm: parseFloat(editForm.alcanceKm),
      });
      setShowEditModal(false);
      setEditingAeronave(null);
      setSuccess('Aeronave atualizada com sucesso!');
      loadAeronaves();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar aeronave');
    }
  };

  const handleDelete = async (codigo: string, modelo: string) => {
    setError('');
    setSuccess('');
    const confirmar = window.confirm(`Excluir a aeronave ${modelo} (${codigo})? Esta ação não poderá ser desfeita.`);
    if (!confirmar) return;
    try {
      await apiService.excluirAeronave(codigo);
      setSuccess('Aeronave excluída com sucesso!');
      loadAeronaves();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir aeronave');
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
        <h2>Aeronaves</h2>
        <button onClick={() => setShowModal(true)} className="add-button">
          + Nova Aeronave
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Cadastrar Nova Aeronave</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Código Único:</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Modelo:</label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tipo:</label>
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo: e.target.value as TipoAeronave })
                  }
                  required
                >
                  <option value={TipoAeronave.COMERCIAL}>Comercial</option>
                  <option value={TipoAeronave.MILITAR}>Militar</option>
                </select>
              </div>
              <div className="form-group">
                <label>Capacidade:</label>
                <input
                  type="number"
                  value={formData.capacidade}
                  onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Alcance (km):</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.alcanceKm}
                  onChange={(e) => setFormData({ ...formData, alcanceKm: e.target.value })}
                  required
                />
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

      <div className="table-container">
        {aeronaves.length === 0 ? (
          <div className="empty-state">Nenhuma aeronave cadastrada ainda.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Modelo</th>
                <th>Tipo</th>
                <th>Capacidade</th>
                <th>Alcance (km)</th>
                <th>Peças</th>
                <th>Etapas</th>
                <th>Testes</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {aeronaves.map((aeronave) => (
                <tr key={aeronave.codigo}>
                  <td>{aeronave.codigo}</td>
                  <td>{aeronave.modelo}</td>
                  <td>
                    <span className={`badge ${aeronave.tipo.toLowerCase()}`}>
                      {aeronave.tipo}
                    </span>
                  </td>
                  <td>{aeronave.capacidade}</td>
                  <td>{aeronave.alcanceKm}</td>
                  <td>{aeronave.pecas.length}</td>
                  <td>{aeronave.etapas.length}</td>
                  <td>{aeronave.testes.length}</td>
                  <td className="actions-cell">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(aeronave)}
                      title="Editar"
                      aria-label="Editar"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/>
                        <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(aeronave.codigo, aeronave.modelo)}
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

      {showEditModal && editingAeronave && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Editar Aeronave</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Código Único:</label>
                <input type="text" value={editingAeronave.codigo} disabled />
              </div>
              <div className="form-group">
                <label>Modelo:</label>
                <input
                  type="text"
                  value={editForm.modelo}
                  onChange={(e) => setEditForm({ ...editForm, modelo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tipo:</label>
                <select
                  value={editForm.tipo}
                  onChange={(e) => setEditForm({ ...editForm, tipo: e.target.value as TipoAeronave })}
                  required
                >
                  <option value={TipoAeronave.COMERCIAL}>Comercial</option>
                  <option value={TipoAeronave.MILITAR}>Militar</option>
                </select>
              </div>
              <div className="form-group">
                <label>Capacidade:</label>
                <input
                  type="number"
                  value={editForm.capacidade}
                  onChange={(e) => setEditForm({ ...editForm, capacidade: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Alcance (km):</label>
                <input
                  type="number"
                  step="0.1"
                  value={editForm.alcanceKm}
                  onChange={(e) => setEditForm({ ...editForm, alcanceKm: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)} className="cancel-button">
                  Cancelar
                </button>
                <button type="submit" className="save-button">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

