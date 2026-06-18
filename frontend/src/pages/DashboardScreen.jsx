import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";

export default function DashboardScreen({ goals, onSelectGoal, onNavigate }) {
  // Estados locales para controlar la información del usuario autenticado
  const [nombreSaludo, setNombreSaludo] = useState("Cargando...");
  const [progresoReal, setProgresoReal] = useState({
    active: 0,
    completed: 0,
    avgProgress: 0
  });

  useEffect(() => {
    // 1. Recuperar los datos de sesión reales del LocalStorage
    const nombreGuardado = localStorage.getItem('usuarioNombre');
    const idUsuarioLogueado = localStorage.getItem('usuarioId');
    
    if (nombreGuardado) {
      setNombreSaludo(nombreGuardado);
    } else {
      setNombreSaludo("Usuario GoalFlow");
    }

    // 2. Si hay un usuario en sesión, consultamos su progreso real en el backend
    if (idUsuarioLogueado) {
      fetch(`${API_URL}/meta/progreso/${idUsuarioLogueado}`)
        .then((res) => res.json())
        .then((datos) => {
          if (datos.ok) {
            // Limpiamos el string del porcentaje (ej: "88%" -> 88) para el SVG
            const porcentajeNumerico = parseInt(datos.porcentajeProgreso) || 0;
            
            setProgresoReal({
              active: datos.totalMetas - datos.metasCompletadas,
              completed: datos.metasCompletadas,
              avgProgress: porcentajeNumerico
            });
          }
        })
        .catch((err) => console.error("Error al jalar el progreso real:", err));
    }
  }, []);

  return (
    <div className="flex flex-col h-full justify-between bg-slate-50 text-slate-800">
      <div className="p-6 space-y-6 overflow-y-auto max-h-[764px] flex-grow">
        
        {/* Cabecera dinámica con tu Nombre de MariaDB */}
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Hola, {nombreSaludo}</h2>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Sigue así, vas muy bien 😊</p>
        </div>

        {/* Tarjeta de Progreso Circular Conectada a la API */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" stroke="#f1f5f9" strokeWidth="3.2" fill="none" />
              <circle 
                cx="18" 
                cy="18" 
                r="15.915" 
                stroke="#5f56d6" 
                strokeWidth="3.2" 
                strokeDasharray={`${progresoReal.avgProgress}, 100`} 
                strokeLinecap="round" 
                fill="none" 
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute text-xl font-black text-slate-900">{progresoReal.avgProgress}%</div>
          </div>

          <div className="flex-grow space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Estadísticas</span>
            <div className="flex justify-between items-center text-xs text-slate-600 font-bold">
              <span>Metas Activas</span> 
              <span className="bg-indigo-50 text-[#5f56d6] px-2 py-0.5 rounded-full text-[10px]">
                {progresoReal.active}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 font-bold">
              <span>Completadas</span> 
              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px]">
                {progresoReal.completed}
              </span>
            </div>
          </div>
        </div>

        {/* Lista de Metas del Feed Visual */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Mis Metas</h3>
          <div className="space-y-3">
            {goals && goals.map((goal) => (
              <div key={goal.id} onClick={() => onSelectGoal(goal)} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{goal.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">
                      Fecha límite: {
                        goal.dueDate 
                          ? goal.dueDate.includes("T") 
                            ? goal.dueDate.split("T")[0].split("-").reverse().join("/") 
                            : goal.dueDate.split("-").reverse().join("/")
                          : ""
                      }
                    </p>
                  </div>
                  <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-xl">{goal.category}</span>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${goal.status === "Completada" ? "bg-emerald-500" : "bg-[#5f56d6]"} transition-all`} style={{ width: `${goal.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                    <span>{goal.category}</span>
                    <span className={goal.status === "Completada" ? "text-emerald-500" : "text-[#5f56d6]"}>{goal.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Navbar activeTab="inicio" onNavigate={onNavigate} />
    </div>
  );
}