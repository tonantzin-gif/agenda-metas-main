import React from 'react';
import Navbar from '../components/Navbar';

export default function Profile({ activeGoalsCount, onAddClick, onLogout }) {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] justify-between relative pb-16">
      
      {/* Cabecera */}
      <div className="px-6 pt-8 pb-4 bg-white border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 tracking-wide uppercase">Perfil</h2>
      </div>

      {/* Contenido Principal */}
      <div className="flex-grow px-6 py-4 overflow-y-auto space-y-6">
        
        {/* Foto y Datos del Usuario */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-50 border-2 border-slate-200 rounded-full flex items-center justify-center shadow-inner relative mb-3">
            <span className="text-4xl">👤</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">Fernanda Abascal</h3>
          <p className="text-xs text-slate-400">user@gmail.com</p>
        </div>

        {/* Sección de Estadísticas */}
        <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-800">Estadísticas</h4>
          
          {/* Metas Activas */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <span className="text-indigo-500 text-sm">🎯</span>
              </div>
              <span className="text-sm text-slate-500 font-medium">Metas Activas</span>
            </div>
            <span className="text-xl font-bold text-slate-800 transition-transform duration-300 scale-110">
              {activeGoalsCount}
            </span>
          </div>

          {/* Metas Completadas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <span className="text-emerald-500 text-sm">✅</span>
              </div>
              <span className="text-sm text-slate-500 font-medium">Metas Completadas</span>
            </div>
            <span className="text-xl font-bold text-slate-800">2</span>
          </div>
        </div>

        {/* Botón Cerrar Sesión */}
        <button 
          onClick={onLogout}
          className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-100"
        >
          🚪 Cerrar Sesión
        </button>
      </div>

      {/* Menú inferior integrado */}
      <Navbar onAddClick={onAddClick} />
    </div>
  );
}
