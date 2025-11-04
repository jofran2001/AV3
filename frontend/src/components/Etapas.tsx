import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Aeronave, Etapa } from '../types';
import { StatusEtapa } from '../types';
import { useAeronave } from '../context/AeronaveContext';
import './Etapas.css';

export function Etapas() {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const { selectedAeronave, setSelectedAeronave } = useAeronave();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    prazoDias: '',
  });

  useEffect(() => {
    loadAeronaves();
    loadUsers();
  }, []);

  const loadAeronaves = async () => {
    try {
      const data = await apiService.listAeronaves();
      setAeronaves(data);
      if (data.length > 0) {
        const exists = data.some(a => a.codigo === selectedAeronave);
        if (!selectedAeronave || !exists) setSelectedAeronave(data[0].codigo);
      }
      setError('');
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar aeronaves');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await apiService.listUsers();
      setUsers(data);
    } catch (err) {
      // Ignorar se não for admin
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiService.adicionarEtapa(selectedAeronave, {
        nome: formData.nome,
        prazoDias: parseInt(formData.prazoDias)
      });
      setSuccess('Etapa adicionada com sucesso!');
      setShowModal(false);
      setFormData({ nome: '', prazoDias: '' });
      loadAeronaves();
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar etapa');
    }
  };

  const handleAvancarEtapa = async (etapaIndex: number) => {
    setError('');
    setSuccess('');
    try {
      await apiService.avancarEtapa(selectedAeronave, etapaIndex);
      setSuccess('Etapa avançada para ANDAMENTO!');
      loadAeronaves();
    } catch (err: any) {
      setError(err.message || 'Erro ao avançar etapa');
    }
  };

  const handleConcluirEtapa = async (etapaIndex: number) => {
    setError('');
    setSuccess('');
    try {
      await apiService.concluirEtapa(selectedAeronave, etapaIndex);
      setSuccess('Etapa concluída!');
      loadAeronaves();
    } catch (err: any) {
      setError(err.message || 'Erro ao concluir etapa');
    }
  };

  const handleAssociarFuncionario = async (etapaIndex: number, funcionarioId: string) => {
    setError('');
    setSuccess('');
    try {
      await apiService.associarFuncionarioEtapa(selectedAeronave, etapaIndex, funcionarioId);
      setSuccess('Funcionário associado!');
      loadAeronaves();
    } catch (err: any) {
      setError(err.message || 'Erro ao associar funcionário');
    }
  };

  const currentAeronave = aeronaves.find((a) => a.codigo === selectedAeronave);

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
        <h2>Gerenciar Etapas</h2>
        <button onClick={() => setShowModal(true)} className="add-button">
          + Nova Etapa
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="filter-section">
        <label htmlFor="aeronave-select">Aeronave:</label>
        <select
          id="aeronave-select"
          value={selectedAeronave}
          onChange={(e) => setSelectedAeronave(e.target.value)}
          className="aeronave-select"
        >
          {aeronaves.map((aeronave) => (
            <option key={aeronave.codigo} value={aeronave.codigo}>
              {aeronave.modelo} ({aeronave.codigo})
            </option>
          ))}
        </select>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Adicionar Nova Etapa</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome da Etapa:</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Prazo (dias):</label>
                <input
                  type="number"
                  value={formData.prazoDias}
                  onChange={(e) => setFormData({ ...formData, prazoDias: e.target.value })}
                  required
                  min="1"
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

      {currentAeronave && (
        <div className="etapas-container">
          {currentAeronave.etapas.length === 0 ? (
            <div className="empty-state">Nenhuma etapa cadastrada para esta aeronave.</div>
          ) : (
            <div className="etapas-list">
              {currentAeronave.etapas.map((etapa: Etapa, index: number) => (
                <div key={index} className="etapa-card">
                  <div className="etapa-header">
                    <div>
                      <h3>{etapa.nome}</h3>
                      <span className="etapa-number">Etapa {index + 1}</span>
                    </div>
                    <span className={`status-badge ${etapa.status.toLowerCase()}`}>
                      {etapa.status}
                    </span>
                  </div>
                  <div className="etapa-info">
                    <div className="info-row">
                      <span className="info-label">Prazo:</span>
                      <span>{etapa.prazoDias} dias</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Funcionários:</span>
                      <span>
                        {etapa.funcionarios.length > 0
                          ? etapa.funcionarios.join(', ')
                          : 'Nenhum'}
                      </span>
                    </div>
                  </div>
                  <div className="etapa-actions">
                    <select
                      onChange={(e) => {
                        if (e.target.value === 'avancar') {
                          handleAvancarEtapa(index);
                          e.target.value = '';
                        } else if (e.target.value === 'concluir') {
                          handleConcluirEtapa(index);
                          e.target.value = '';
                        }
                      }}
                      className="action-select"
                      disabled={etapa.status === StatusEtapa.CONCLUIDA}
                    >
                      <option value="">Ações...</option>
                      {etapa.status === StatusEtapa.PENDENTE && (
                        <option value="avancar">Avançar para ANDAMENTO</option>
                      )}
                      {etapa.status === StatusEtapa.ANDAMENTO && (
                        <option value="concluir">Concluir</option>
                      )}
                    </select>
                    {users.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssociarFuncionario(index, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="funcionario-select"
                      >
                        <option value="">Associar Funcionário...</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.nome}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

