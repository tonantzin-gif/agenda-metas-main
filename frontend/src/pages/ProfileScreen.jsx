import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function ProfileScreen({ user, stats, onLogout, onNavigate }) {
  // Estados locales para interceptar y volver dinámicos los datos del perfil
  const [nombreDinamico, setNombreDinamico] = useState(user || "Cargando...");
  const [correoDinamico, setCorreoDinamico] = useState("correo@ejemplo.com");

  useEffect(() => {
    // 1. Jalamos los datos reales guardados en LocalStorage durante el Login exitoso
    const nombreGuardado = localStorage.getItem('usuarioNombre');
    const correoGuardado = localStorage.getItem('usuarioCorreo');

    // 2. Si existen datos en sesión, los priorizamos; si no, usamos las props de control
    if (nombreGuardado) {
      setNombreDinamico(nombreGuardado);
    } else if (user) {
      setNombreDinamico(user);
    } else {
      setNombreDinamico("Usuario GoalFlow");
    }

    if (correoGuardado) {
      setCorreoDinamico(correoGuardado);
    }
  }, [user]);

  // Manejador de salida limpio para la persistencia de datos
  const handleLogoutClick = () => {
    localStorage.clear(); // Limpiamos LocalStorage (nombre, correo, token)
    if (onLogout) {
      onLogout(); // Disparamos la acción global de salida que controla la app
    }
  };

  return (
    <div className="flex flex-col h-full justify-between bg-slate-50">
      <div className="p-6 space-y-6">
        <h2 className="text-3xl font-black text-slate-900 text-center tracking-tight">PERFIL</h2>

        {/* Tarjeta de Datos del Usuario (Diseño de Liz + Tus datos de MariaDB) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center space-y-3 shadow-xs">
          {/* Avatar dinámico: Muestra la inicial en mayúscula de tu usuario real */}
          <div className="w-20 h-20 bg-indigo-50 text-[#5f56d6] rounded-full flex items-center justify-center text-3xl font-black mx-auto shadow-inner">
            {nombreDinamico.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{nombreDinamico}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{correoDinamico}</p>
          </div>
        </div>

        {/* Sección de Estadísticas con la maquetación estética de Liz */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Estadísticas</h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-2xl font-black text-[#5f56d6]">{stats?.active ?? 0}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Metas Activas</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-2xl font-black text-emerald-500">{stats?.completed ?? 0}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Completadas</span>
            </div>
          </div>
        </div>

        {/* Botón de Salida */}
        <button 
          onClick={handleLogoutClick} 
          className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-extrabold text-base rounded-2xl transition-all shadow-md active:scale-[0.98]"
        >
          Cerrar Sesión
        </button>
      </div>
      
      {/* Barra de Navegación inferior con soporte a pestañas de Liz */}
      <Navbar activeTab="perfil" onNavigate={onNavigate} />
    </div>
  );
}