import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { AeronaveProvider } from './context/AeronaveContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Aeronaves } from './components/Aeronaves';
import { Pecas } from './components/Pecas';
import { Etapas } from './components/Etapas';
import { Testes } from './components/Testes';
import { Usuarios } from './components/Usuarios';
import './App.css';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'aeronaves':
        return <Aeronaves />;
      case 'pecas':
        return <Pecas />;
      case 'etapas':
        return <Etapas />;
      case 'testes':
        return <Testes />;
      case 'usuarios':
        return <Usuarios />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AeronaveProvider>
      <div className="app">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="main-content">{renderPage()}</main>
      </div>
    </AeronaveProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
