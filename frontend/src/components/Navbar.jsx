import React from "react";

export default function Navbar({ activeTab, onNavigate }) {
  return (
    <div className="h-20 bg-white border-t border-slate-100 flex items-center justify-between px-12 shrink-0 relative">
      <button onClick={() => onNavigate("dashboard")} className={`flex flex-col items-center gap-1 ${activeTab === "inicio" ? "text-[#5f56d6]" : "text-slate-400"}`}>
        <span className="text-xl">🏠</span>
        <span className="text-[11px] font-extrabold">Inicio</span>
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 -top-5">
        <button onClick={() => onNavigate("new-goal")} className="w-14 h-14 bg-[#5f56d6] text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-100">+</button>
      </div>

      <button onClick={() => onNavigate("profile")} className={`flex flex-col items-center gap-1 ${activeTab === "perfil" ? "text-[#5f56d6]" : "text-slate-400"}`}>
        <span className="text-xl">👤</span>
        <span className="text-[11px] font-extrabold">Perfil</span>
      </button>
    </div>
  );
}
