import React, { useState } from 'react';

interface EntryModalProps {
  onStart: (group: string, factory: string) => void;
}

const GROUPS = ["Grupo A", "Grupo B", "Grupo C", "Grupo D"];
const FACTORIES = [
  "Lácteos del Sur (Línea de Envasado)",
  "Motores A-Zul (Brazo Robótico)",
  "Vinos Sierra Morena (Encapsuladora)",
  "PACSA (Línea de Pesado)",
  "Logística Sur-Ex (Transportador Almacenaje)"
];

export const EntryModal: React.FC<EntryModalProps> = ({ onStart }) => {
  const [group, setGroup] = useState("");
  const [factory, setFactory] = useState("");

  const handleStart = () => {
    if (group && factory) {
      onStart(group, factory);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl text-center w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Inicio de la Simulación</h2>
        <p className="mb-6 text-gray-600">Selecciona tu grupo y la estación de trabajo asignada.</p>
        
        <div className="text-left mb-4">
          <label htmlFor="student-group-select" className="block font-semibold text-gray-700 mb-1">Grupo:</label>
          <div className="relative">
            <select 
              id="student-group-select" 
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white appearance-none"
            >
              <option value="">-- Selecciona tu grupo --</option>
              {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div className="text-left mb-6">
          <label htmlFor="factory-select" className="block font-semibold text-gray-700 mb-1">Fábrica / Estación:</label>
          <div className="relative">
            <select 
              id="factory-select" 
              value={factory}
              onChange={(e) => setFactory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white appearance-none"
            >
              <option value="">-- Selecciona una fábrica --</option>
              {FACTORIES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <button 
          onClick={handleStart}
          disabled={!group || !factory}
          className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md active:transform active:scale-95"
        >
          Comenzar Simulación
        </button>
      </div>
    </div>
  );
};
