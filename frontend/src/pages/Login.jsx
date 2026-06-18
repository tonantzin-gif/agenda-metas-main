import React, { useState } from 'react';
import { API_URL } from '../config';

export default function Login({ onLogin, onNavigateRegister, onNavigateForgot }) {
  // Estados locales para manejar inputs y mensajes de error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Función asíncrona conectada a tu API en el puerto 3000
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(''); 

    try {
      const respuesta = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          Correo: email, 
          Contrasena: password 
        })
      });

      const datos = await respuesta.json();

      if (respuesta.ok && datos.ok) {
        console.log('¡Conexión exitosa a MariaDB!', datos);
        
        // 🌟 MAPEO CORRECTO EN BASE A TU AUTHCONTROLLER:
        const idReal = datos.usuario?.id;
        const nombreReal = datos.usuario?.nombre || 'Usuario';
        const correoReal = datos.usuario?.correo || email;

        if (idReal) {
          // Guardamos las llaves exactas en LocalStorage
          localStorage.setItem('usuarioId', idReal.toString());
          localStorage.setItem('usuarioNombre', nombreReal);
          localStorage.setItem('usuarioCorreo', correoReal);
          localStorage.setItem('user', JSON.stringify({ role: 'admin' })); // Para compatibilidad de sesión

          if (datos.token) {
            localStorage.setItem('token', datos.token);
          }

          // Entrar al Dashboard enviando el nombre dinámico a App.jsx
          onLogin(nombreReal); 
        } else {
          setErrorMsg('Error al recuperar los datos de sesión del servidor.');
        }
      } else {
        setErrorMsg(datos.msg || 'Credenciales incorrectas.');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setErrorMsg('No se pudo establecer conexión con el servidor backend.');
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] justify-center px-6">
      <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center">
        
        {/* Logo GoalFlow */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white text-xs font-bold">GF</span>
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">GoalFlow</span>
        </div>
        <p className="text-xs text-slate-400 mb-6">Bienvenido de nuevo</p>

        {/* Mensaje de error condicional */}
        {errorMsg && (
          <div className="w-full p-3 mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl font-medium text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Input: Correo */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">Correo electrónico</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                ✉️
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800"
                placeholder="tu@correo.com"
                required
              />
            </div>
          </div>

          {/* Input: Contraseña */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-500">Contraseña</label>
              <button 
                type="button"
                onClick={onNavigateForgot}
                className="text-xs text-indigo-600 font-medium hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                ¿Olvidaste contraseña?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                🔒
              </span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Botón Iniciar Sesión */}
          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-6">
          ¿No tienes cuenta?{' '}
          <button 
            type="button"
            onClick={onNavigateRegister}
            className="text-indigo-600 font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </div>
  );
}