import React, { useState, useEffect } from "react";
import { API_URL } from "../config";

export default function NewGoalScreen({ onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Categorías fijas de respaldo para asegurar la UI si el backend no responde
  const categoriasRespaldo = [
    { ID_Categoria: 1, Nombre_Categoria: "Estudio" },
    { ID_Categoria: 2, Nombre_Categoria: "Finanzas" },
    { ID_Categoria: 3, Nombre_Categoria: "Salud" },
    { ID_Categoria: 4, Nombre_Categoria: "Personal" }
  ];

  // Inicializamos el estado directo con el respaldo para que NUNCA aparezca en blanco
  const [categoriasDb, setCategoriasDb] = useState(categoriasRespaldo); 
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);

  // Diccionario para asignar los emojis correspondientes a las tarjetas visuales
  const emojisCategoria = {
    "Estudio": "📘",
    "Finanzas": "💲",
    "Salud": "❤️",
    "Personal": "⭐"
  };

  // 2. Intentamos sincronizar los IDs con el backend al cargar la pantalla
  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/categorias`);
        if (respuesta.ok) {
          const datos = await respuesta.json();
          if (datos && datos.length > 0) {
            setCategoriasDb(datos);
            setSelectedCategoryId(datos[0].ID_Categoria || datos[0].id);
            return;
          }
        }
        // Si responde un error de ruta (ej. Cannot GET), mantenemos el respaldo seguro
        setCategoriasDb(categoriasRespaldo);
      } catch (error) {
        console.log("Usando categorías locales de respaldo.");
        setCategoriasDb(categoriasRespaldo);
      }
    };

    obtenerCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validaciones del cliente
    if (!title || !dueDate) {
      setErrorMsg("El nombre de la meta y la fecha límite son obligatorios.");
      return;
    }

    // Recuperar la sesión del usuario del almacenamiento local
    const idUsuarioLogueado = localStorage.getItem("usuarioId");
    if (!idUsuarioLogueado) {
      setErrorMsg("Sesión expirada. Por favor, vuelve a iniciar sesión.");
      return;
    }

    setLoading(true);
    const fechaHoy = new Date().toISOString().split('T')[0];

    try {
      // Petición POST estructurada para MariaDB
      const respuesta = await fetch(`${API_URL}/meta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Creador_ID: parseInt(idUsuarioLogueado),
          Responsable_ID: parseInt(idUsuarioLogueado),
          Categoria_ID: selectedCategoryId, // Envía el ID numérico correcto (1, 2, 3, 4, etc.)
          Titulo: title,
          Descripcion: description,
          Prioridad: "Media", // Valor por defecto estándar
          Fecha_Inicio: fechaHoy,
          Fecha_Limite: dueDate
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        console.log("¡Meta guardada con éxito en la Base de Datos!", datos);
        
        if (onSave) {
          // Buscamos el nombre de la categoría seleccionada para mantener el flujo de la UI global
          const catEncontrada = mapCategoriasNombre(selectedCategoryId);
          onSave({ title, description, dueDate, category: catEncontrada }); 
        }
      } else {
        setErrorMsg(datos.msg || datos.message || "No se pudo guardar la meta.");
      }
    } catch (error) {
      console.error("Error al conectar con la API de metas:", error);
      setErrorMsg("No se pudo establecer conexión con el backend.");
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para recuperar el nombre textual de la categoría seleccionada
  const mapCategoriasNombre = (id) => {
    const encontrada = categoriasDb.find(c => (c.ID_Categoria || c.id) === id);
    return encontrada ? (encontrada.Nombre_Categoria || encontrada.Nombre) : "Estudio";
  };

  return (
    <div className="flex flex-col h-full justify-between bg-white text-slate-800">
      <div className="p-6 space-y-5 overflow-y-auto">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={onCancel} 
            disabled={loading}
            className="text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-700 active:scale-95 transition-all"
          >
            ←
          </button>
          <h2 className="text-xl font-black text-slate-900">Nueva Meta</h2>
        </div>

        {/* Banner de errores dinámico */}
        {errorMsg && (
          <div className="w-full p-3.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-2xl text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Nombre de la Meta</label>
            <input 
              type="text" 
              value={title} 
              disabled={loading}
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="¿Cuál es tu meta?" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-[#5f56d6] text-slate-800" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Descripción</label>
            <textarea 
              value={description} 
              disabled={loading}
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe tu meta..." 
              rows="3" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-[#5f56d6] resize-none text-slate-800" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Fecha Límite</label>
            <input 
              type="date" 
              value={dueDate} 
              disabled={loading}
              onChange={(e) => setDueDate(e.target.value)} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-[#5f56d6] text-slate-700" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">Categoría</label>
            <div className="grid grid-cols-2 gap-3">
              {categoriasDb.map((cat) => {
                const idCat = cat.ID_Categoria || cat.id;
                const nombreCat = cat.Nombre_Categoria || cat.Nombre;
                return (
                  <button 
                    key={idCat} 
                    type="button" 
                    disabled={loading}
                    onClick={() => setSelectedCategoryId(idCat)} 
                    className={`p-3.5 rounded-2xl border flex flex-col items-center gap-0.5 transition-all ${
                      selectedCategoryId === idCat 
                        ? "border-[#5f56d6] bg-white ring-2 ring-indigo-50" 
                        : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-base">
                      {emojisCategoria[nombreCat] || "⭐"}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{nombreCat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </div>
      
      <div className="p-5 border-t border-slate-50 bg-white">
        <button 
          type="submit"
          onClick={handleSubmit} 
          disabled={loading}
          className={`w-full py-4 ${loading ? "bg-indigo-400" : "bg-[#5f56d6] hover:bg-indigo-700"} text-white font-extrabold text-base rounded-2xl shadow-md transition-all active:scale-[0.99]`}
        >
          {loading ? "Guardando en Base de Datos..." : "Guardar Meta"}
        </button>
      </div>
    </div>
  );
}