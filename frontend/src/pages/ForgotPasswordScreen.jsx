import React, { useState } from "react";

export default function ForgotPasswordScreen({ onNavigateLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("El correo es obligatorio.");
      return;
    }
    if (!email.includes("@")) {
      setError("Incluye un '@' en la dirección de correo electrónico. A 'ysf' le falta una '@'.");
      return;
    }
    setError("");
    setSuccess(true);
  };

  return (
    <div className="p-7 flex flex-col h-full justify-between">
      <div className="space-y-8 mt-12">
        <button onClick={onNavigateLogin} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm">
          <span>←</span> Recuperar Contraseña
        </button>

        <p className="text-sm text-slate-500 leading-relaxed">
          Ingresa tu correo electrónico para recibir las instrucciones de restablecimiento de tu contraseña.
        </p>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2">
            <span className="text-3xl block">📧</span>
            <p className="text-sm font-bold text-emerald-800">Instrucciones Enviadas</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 block">Correo electrónico</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className={`w-full px-5 py-4 bg-white border ${
                  error ? "border-[#f59e0b] ring-2 ring-amber-50" : "border-slate-200"
                } rounded-2xl text-sm focus:outline-none focus:border-[#5f56d6] transition-all`}
              />
              {error && <span className="text-xs font-semibold text-[#f59e0b] flex items-center gap-1.5 mt-1">⚠️ {error}</span>}
            </div>
            <button type="submit" className="w-full py-4 bg-[#5f56d6] text-white font-extrabold text-base rounded-2xl shadow-lg">Enviar Instrucciones</button>
          </form>
        )}
      </div>
    </div>
  );
}