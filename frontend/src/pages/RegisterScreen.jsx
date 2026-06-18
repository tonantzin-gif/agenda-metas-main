import React, { useState } from "react";
import { API_URL } from "../config";

export default function RegisterScreen({ onRegister, onNavigateLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Estado para evitar clics duplicados

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // 1. Validaciones locales obligatorias del lado del cliente
    if (!name) newErrors.name = "El nombre completo es obligatorio.";
    if (!email) newErrors.email = "El correo es obligatorio.";
    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener mínimo 8 caracteres.";
    }
    if (password !== confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Detiene la ejecución si hay errores visuales
    }

    // Limpiamos errores previos y activamos el estado de carga
    setErrors({});
    setLoading(true);

    try {
      // 2. Conexión Real con tu API de Node.js en el puerto 3000
      // REVISIÓN DE QA: Ajusta las llaves 'Nombre', 'Correo', 'Contrasena' según lo que reciba tu backend
      const respuesta = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: name,
          Correo: email,
          Contrasena: password,
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        console.log("¡Usuario registrado con éxito en MariaDB!", datos);
        
        // Opcional: Puedes guardar sus datos en sesión o mandarlo directo al login
        alert("¡Cuenta creada con éxito! Ya puedes iniciar sesión.");
        
        // 3. Redirige automáticamente al flujo de Login
        onNavigateLogin(); 
      } else {
        // Si el backend rechaza la petición (ej. el correo ya está registrado)
        setErrors({ server: datos.msg || datos.message || "No se pudo completar el registro." });
      }
    } catch (error) {
      console.error("Error al conectar con el servidor de registro:", error);
      setErrors({ server: "No hay conexión con el servidor backend." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between p-7 bg-[#f8fafc]">
      <div className="space-y-6 mt-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Crear Cuenta</h1>
          <p className="text-sm text-slate-500 font-medium">Comienza a alcanzar tus metas hoy</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Alerta Global de Error de Servidor o Correo Duplicado */}
          {errors.server && (
            <div className="w-full p-3.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-2xl text-center">
              ⚠️ {errors.server}
            </div>
          )}

          {/* Input: Nombre Completo */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Nombre Completo</label>
            <input 
              type="text" 
              value={name} 
              disabled={loading}
              onChange={(e) => setName(e.target.value)} 
              placeholder="Tu nombre completo" 
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-[#5f56d6] transition-all text-slate-800" 
            />
            {errors.name && <span className="text-xs font-semibold text-[#f59e0b] flex items-center gap-1 mt-1">⚠️ {errors.name}</span>}
          </div>

          {/* Input: Correo Electrónico */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="correo@ejemplo.com" 
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-[#5f56d6] transition-all text-slate-800" 
            />
            {errors.email && <span className="text-xs font-semibold text-[#f59e0b] flex items-center gap-1 mt-1">⚠️ {errors.email}</span>}
          </div>

          {/* Input: Contraseña */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Contraseña (mínimo 8 caracteres)</label>
            <input 
              type="password" 
              value={password} 
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Mínimo 8 caracteres" 
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-[#5f56d6] transition-all text-slate-800" 
            />
            {errors.password && <span className="text-xs font-semibold text-[#f59e0b] flex items-center gap-1 mt-1">⚠️ {errors.password}</span>}
          </div>

          {/* Input: Confirmar Contraseña */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Confirmar Contraseña</label>
            <input 
              type="password" 
              value={confirmPassword} 
              disabled={loading}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Repite tu contraseña" 
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-[#5f56d6] transition-all text-slate-800" 
            />
            {errors.confirmPassword && <span className="text-xs font-semibold text-[#f59e0b] flex items-center gap-1 mt-1">⚠️ {errors.confirmPassword}</span>}
          </div>

          {/* Botón de Envío Dinámico */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 ${loading ? "bg-indigo-400" : "bg-[#5f56d6] hover:bg-indigo-700"} text-white font-extrabold text-base rounded-2xl transition-all shadow-lg`}
          >
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>
      </div>

      <div className="text-center py-4">
        <p className="text-sm text-slate-400 font-medium">
          ¿Ya tienes cuenta? <button onClick={onNavigateLogin} className="font-bold text-[#5f56d6] hover:underline bg-transparent border-none p-0 cursor-pointer">Ya tengo cuenta</button>
        </p>
      </div>
    </div>
  );
}