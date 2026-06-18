import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function CreateGoalModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Limpiar campos al abrir/cerrar el modal
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDueDate('');
      setCategory('Personal');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- VALIDACIONES DE FRONTEND ---
    // 1. Validar que el título no esté vacío
    if (!title.trim()) {
      setError('El título de la meta es obligatorio.');
      return;
    }

    // 2. Validar que se haya seleccionado una fecha
    if (!dueDate) {
      setError('Por favor, selecciona una fecha límite.');
      return;
    }

    // 3. Validar que la fecha sea futura (hoy o posterior)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dueDate + 'T00:00:00');
    if (selectedDate < today) {
      setError('La fecha límite debe ser hoy o un día posterior.');
      return;
    }

    // --- CONEXIÓN CON EL BACKEND (POST /goals) ---
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/meta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Titulo: title.trim(),
          Fecha_Limite: dueDate,
          Categoria_ID: category,
          Creador_ID: 1,
          Responsable_ID: 1,
        }),
      });

      if (!response.ok) {
        // attempt to parse error body if any
        let errBody = null;
        try { errBody = await response.json(); } catch(_) { /* ignore */ }
        throw new Error((errBody && errBody.msg) || 'No se pudo guardar la meta. Intenta de nuevo.');
      }

      const { default: parseJSONSafe, parseJSONSafe: parseJSONSafeNamed } = await import('../utils/parseJSONSafe');
      const data = await parseJSONSafeNamed(response);
      // Notificar al componente padre que la meta se guardó con éxito
      onSave(data);
    } catch (err) {
      // Manejo de errores de red o servidor
      setError(err.message || 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl border-t sm:border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Indicador superior estético para móviles */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden"></div>

        {/* Cabecera */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Nueva Meta 🎯</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <span className="text-xl font-semibold">&times;</span>
          </button>
        </div>

        {/* Banner de Mensajes de Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4 flex items-center gap-2 border border-red-100">
            <span className="font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo: Título */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1.5">¿Cuál es tu objetivo?</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Ejercicio diario, Ahorrar $200" 
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
              disabled={loading}
            />
          </div>

          {/* Campo: Categorías */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-2">Categoría de la meta</label>
            <div className="grid grid-cols-3 gap-2">
              {['Personal', 'Salud', 'Finanzas'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                    category === cat 
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  disabled={loading}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Campo: Fecha Límite */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1.5">Fecha límite</label>
            <input 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white text-slate-800"
              disabled={loading}
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-sm transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-transform active:scale-95"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando...
                </>
              ) : (
                'Crear Meta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
