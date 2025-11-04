import { createContext, useContext, useEffect, useState } from 'react';

type AeronaveContextType = {
  selectedAeronave: string;
  setSelectedAeronave: (codigo: string) => void;
};

const AeronaveContext = createContext<AeronaveContextType | undefined>(undefined);

export function AeronaveProvider({ children }: { children: React.ReactNode }) {
  const [selectedAeronave, setSelectedAeronaveState] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('selectedAeronave');
      if (saved) setSelectedAeronaveState(saved);
    } catch {}
  }, []);

  const setSelectedAeronave = (codigo: string) => {
    setSelectedAeronaveState(codigo);
    try {
      localStorage.setItem('selectedAeronave', codigo);
    } catch {}
  };

  return (
    <AeronaveContext.Provider value={{ selectedAeronave, setSelectedAeronave }}>
      {children}
    </AeronaveContext.Provider>
  );
}

export function useAeronave() {
  const ctx = useContext(AeronaveContext);
  if (!ctx) throw new Error('useAeronave deve ser usado dentro de AeronaveProvider');
  return ctx;
}
