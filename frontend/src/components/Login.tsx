import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usuario, senha);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-card">
          <div className="login-header">
            <h1>🛩️ Aerocode</h1>
            <p>Sistema de Produção de Aeronaves</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="usuario">Usuário</label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="login-button">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <div className="login-footer">
            <p className="demo-info">Demo: admin / admin123</p>
          </div>
        </div>
      </div>

      <div className="login-separator" aria-hidden="true" />

      <div className="login-right">
        <h2 className="brand-title">
          Aerocode, o seu sistema de gerenciamento de produção de aeronaves
        </h2>
      </div>
    </div>
  );
}

