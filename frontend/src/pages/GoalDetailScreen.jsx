import React, { useState } from "react";
import { API_URL } from "../config";

export default function GoalDetailScreen({ goal, onBack, onUpdateProgress, onTriggerComplete, onTriggerDelete }) {
  // Estados para controlar el modo edición y los valores de los campos
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal?.title || goal?.Titulo || "");
  const [editDescription, setEditDescription] = useState(goal?.description || goal?.Descripcion || "");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Mapa numérico de categorías para satisfacer la regla de llaves foráneas de MariaDB
  const categoriaIdMap = {
    "Estudio": 1,
    "Finanzas": 2,
    "Salud": 3,
    "Personal": 4,
    "General": 1 // Respaldo por si viene de tu registro base
  };

  // Función interna auxiliar para obtener la fecha limpia YYYY-MM-DD sin ISO (evita errores en MariaDB)
  const obtenerFechaLimpiaBD = () => {
    const rawDate = goal?.Fecha_Limite || goal?.dueDate;
    if (!rawDate) return "2026-06-30";
    return rawDate.includes("T") ? rawDate.split("T")[0] : rawDate;
  };

  const handleUpdateMeta = async () => {
    setErrorMsg("");
    
    if (!editTitle.trim()) {
      setErrorMsg("El título de la meta es obligatorio.");
      return;
    }

    // 🕵️‍♀️ EXTRACCIÓN BLINDADA DEL ID DE LA META (QA)
    const idMeta = goal?.ID_Meta || goal?.id || (goal && typeof goal === 'object' ? Object.values(goal)[0] : null);
    
    if (!idMeta || idMeta === "undefined") {
      setErrorMsg("Error de mapeo: No se pudo detectar un ID válido para esta meta.");
      return;
    }

    setLoading(true);

    try {
      console.log(`Enviando petición PUT a la API para la Meta ID: ${idMeta}`);

      // Petición conectada directo a tu controlador de Express en el puerto 3000
      const respuesta = await fetch(`${API_URL}/meta/${idMeta}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Categoria_ID: categoriaIdMap[goal.category || goal.Categoria_Nombre] || 1, 
          Titulo: editTitle,
          Descripcion: editDescription,
          Prioridad: goal.Prioridad || goal.priority || "Media",
          Fecha_Limite: obtenerFechaLimpiaBD() // Envia estrictamente YYYY-MM-DD al backend
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        console.log("¡Meta actualizada con éxito en MariaDB!", datos);
        
        // Sincronizamos las propiedades en caliente
        if (goal.title !== undefined) goal.title = editTitle;
        if (goal.Titulo !== undefined) goal.Titulo = editTitle;
        
        if (goal.description !== undefined) goal.description = editDescription;
        if (goal.Descripcion !== undefined) goal.Descripcion = editDescription;
        
        // Actualizamos la propiedad local para que no conserve el formato viejo
        if (goal.Fecha_Limite) goal.Fecha_Limite = obtenerFechaLimpiaBD();
        if (goal.dueDate) goal.dueDate = obtenerFechaLimpiaBD();

        // Apagamos el formulario de edición
        setIsEditing(false);
      } else {
        setErrorMsg(datos.msg || "El backend rechazó la actualización de la meta.");
      }
    } catch (error) {
      console.error("Error crítico de red en el endpoint PUT:", error);
      setErrorMsg("No se pudo establecer conexión con el backend (Verifica si Node.js está corriendo).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between bg-slate-50 text-slate-800">
      <div className="p-6 space-y-6 overflow-y-auto max-h-[740px] flex-grow">
        
        {/* Cabecera superior de navegación */}
        <div className="flex justify-between items-center">
          <button 
            onClick={onBack} 
            disabled={loading}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-extrabold text-sm active:scale-95 transition-all"
          >
            <span>←</span> Detalle de Meta
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setIsEditing(!isEditing);
                setErrorMsg("");
                setEditTitle(goal?.title || goal?.Titulo || "");
                setEditDescription(goal?.description || goal?.Descripcion || "");
              }}
              disabled={loading}
              className={`w-9 h-9 ${isEditing ? "bg-slate-200 text-slate-700" : "bg-indigo-50 text-[#5f56d6]"} rounded-full flex items-center justify-center hover:scale-105 transition-all text-sm`}
              title={isEditing ? "Cancelar" : "Editar Meta"}
            >
              {isEditing ? "✕" : "✏️"}
            </button>
            
            <button 
              onClick={onTriggerDelete} 
              disabled={loading}
              className="w-9 h-9 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-all text-sm"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Banner dinámico de control de calidad para errores */}
        {errorMsg && (
          <div className="w-full p-3.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-2xl text-center shadow-xs">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Tarjeta de Contenido */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-5">
          
          {isEditing ? (
            /* 📝 RENDERIZADO EN MODO EDICIÓN */
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Título de la Meta</label>
                <input 
                  type="text"
                  value={editTitle}
                  disabled={loading}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#5f56d6] text-slate-800 font-bold transition-all"
                  placeholder="Ej. Terminar la base de datos"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Descripción</label>
                <textarea 
                  value={editDescription}
                  disabled={loading}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#5f56d6] text-slate-600 resize-none leading-relaxed transition-all"
                  placeholder="Detalla los entregables de la meta..."
                />
              </div>
              
              <button
                onClick={handleUpdateMeta}
                disabled={loading}
                className="w-full py-3 bg-[#5f56d6] hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm active:scale-[0.99]"
              >
                {loading ? "Actualizando en MariaDB..." : "💾 Guardar Cambios"}
              </button>
            </div>
          ) : (
            /* 👁️ RENDERIZADO EN MODO LECTURA */
            <>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#5f56d6] uppercase tracking-wider">
                  {goal.category || goal.Categoria_Nombre || "General"}
                </span>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                  {goal.title || goal.Titulo}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold">Fecha límite</span>
                  <span className="font-extrabold text-slate-700 mt-0.5 block">
                    {/* Renderizado sanitizado de fecha */}
                    {goal.dueDate || goal.Fecha_Limite 
                      ? obtenerFechaLimpiaBD().split("-").reverse().join("/") 
                      : "Sin fecha"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Estado</span>
                  <span className={`font-extrabold mt-0.5 block ${goal.status === "Completada" || goal.Estado === "Completada" ? "text-emerald-500" : "text-indigo-600"}`}>
                    {goal.status === "Completada" || goal.Estado === "Completada" ? "✓ Completada" : "En progreso"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400">Descripción</span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {goal.description || goal.Descripcion || "Sin descripción asignada."}
                </p>
              </div>

              {(goal.status !== "Completada" && goal.Estado !== "Completada") && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Progreso</span>
                    <span className="text-[#5f56d6]">{goal.progress || 0}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5" 
                    value={goal.progress || 0} 
                    onChange={(e) => onUpdateProgress(Number(e.target.value))} 
                    className="w-full accent-[#5f56d6]" 
                  />
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Botón inferior de Completar (oculto si se está editando) */}
      {!isEditing && goal.status !== "Completada" && goal.Estado !== "Completada" && (
        <div className="p-5 bg-white border-t border-slate-100">
          <button onClick={onTriggerComplete} className="w-full py-4 bg-emerald-500 text-white font-extrabold text-base rounded-2xl shadow-md transition-all active:scale-[0.99]">
            ✓ Completar Meta
          </button>
        </div>
      )}
    </div>
  );
}