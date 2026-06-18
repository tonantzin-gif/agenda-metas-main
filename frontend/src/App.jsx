import React, { useState, useEffect } from "react";
import LoginScreen from "./pages/Login";
import RegisterScreen from "./pages/RegisterScreen";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen";
import DashboardScreen from "./pages/DashboardScreen";
import NewGoalScreen from "./pages/NewGoalScreen";
import ProfileScreen from "./pages/ProfileScreen";
import GoalDetailScreen from "./pages/GoalDetailScreen";
import { goalsService } from "./api"; // Conexión a la base de datos

export default function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarMetasDesdeBD = async () => {
    const idUsuarioLogueado = localStorage.getItem("usuarioId");
    if (!idUsuarioLogueado) return;

    try {
      setLoading(true);
      const datos = await goalsService.getAll();
      let listaMetas = Array.isArray(datos) ? datos : (datos.metas || []);

      const metasMapeadas = listaMetas
        .filter(m => parseInt(m.Creador_ID) === parseInt(idUsuarioLogueado))
        .map((m) => ({
          id: m.ID_Meta,
          title: m.Titulo,
          description: m.Descripcion || "",
          dueDate: m.Fecha_Limite,
          progress: m.Porcentaje_Actual || 0, 
          status: m.Estatus || "En progreso",
          category: m.Categoria_ID === 1 ? "General" : m.Categoria_ID === 4 ? "Personal" : m.Categoria_ID === 3 ? "Salud" : "Estudio"
        }));
      setGoals(metasMapeadas);
    } catch (error) {
      console.error("Error al cargar metas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (screen === "dashboard") cargarMetasDesdeBD();
  }, [screen]);

  const stats = {
    active: goals.filter(g => g.status !== "Terminado").length,
    completed: goals.filter(g => g.status === "Terminado").length,
    avgProgress: goals.length > 0 ? Math.round(goals.reduce((acc, curr) => acc + curr.progress, 0) / goals.length) : 0
  };

  const handleUpdateProgress = async (newProgress) => {
    if (!selectedGoal) return;
    const idMeta = selectedGoal.id;
    const nuevoEstatus = newProgress === 100 ? "Terminado" : "En progreso";

    setGoals(prev => prev.map(g => g.id === idMeta ? { ...g, progress: newProgress, status: nuevoEstatus } : g));
    setSelectedGoal(prev => ({ ...prev, progress: newProgress, status: nuevoEstatus }));

    try {
      await goalsService.updateEstatus(idMeta, nuevoEstatus, newProgress);
    } catch (error) {
      console.error("Error al persistir:", error);
      cargarMetasDesdeBD();
    }
  };

  const handleCompleteGoal = async () => {
    if (!selectedGoal) return;
    
    // Extraemos el ID sin importar cómo venga estructurado
    const idMeta = selectedGoal.id || selectedGoal.ID_Meta;

    // 1. ACTUALIZACIÓN INMEDIATA (La UI responde al instante)
    setGoals(prev => prev.map(g => 
      (g.id === idMeta || g.ID_Meta === idMeta) 
        ? { ...g, progress: 100, status: "Terminado" } 
        : g
    ));
    
    // 2. Te saca de ahí y te manda al dashboard inmediatamente
    setScreen("dashboard");

    // 3. Trabaja en segundo plano con la base de datos
    try {
      console.log(`🎯 Enviando petición para completar meta: ${idMeta}`);
      await goalsService.updateEstatus(idMeta, "Terminado", 100);
      
      // Sincroniza los datos limpios por debajo del agua
      cargarMetasDesdeBD();
    } catch (error) {
      console.error("❌ Error de red al intentar completar la meta en el servidor:", error);
    }
  };
  const handleDeleteGoal = async () => {
    if (!selectedGoal) return;
    try {
      await goalsService.delete(selectedGoal.id);
      await cargarMetasDesdeBD();
      setScreen("dashboard");
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // 🔥 ESTAS FUNCIONES FALTABAN POR MI ERROR DE CORTE 🔥
  const handleSaveGoal = () => {
    cargarMetasDesdeBD();
    setScreen("dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser("");
    setGoals([]);
    setScreen("login");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[412px] h-[844px] bg-white rounded-[40px] shadow-2xl overflow-hidden relative">
        {loading && <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 animate-pulse z-50" />}
        
        {screen === "login" && (
          <LoginScreen 
            onLogin={(u) => { setUser(u); setScreen("dashboard"); }} 
            onNavigateRegister={() => setScreen("register")} 
            onNavigateForgot={() => setScreen("forgot")} 
          />
        )}

        {screen === "register" && (
          <RegisterScreen 
            onRegister={(u) => { setUser(u); setScreen("dashboard"); }} 
            onNavigateLogin={() => setScreen("login")} 
          />
        )}

        {screen === "forgot" && (
          <ForgotPasswordScreen 
            onNavigateLogin={() => setScreen("login")} 
          />
        )}

        {screen === "dashboard" && (
          <DashboardScreen 
            user={user} 
            goals={goals} 
            stats={stats} 
            onSelectGoal={(g) => { setSelectedGoal(g); setScreen("detail"); }} 
            onNavigate={setScreen} 
          />
        )}

        {/* 🔥 AQUÍ ESTÁ DE REGRESO LA PANTALLA DE NUEVA META 🔥 */}
        {screen === "new-goal" && (
          <NewGoalScreen 
            onSave={handleSaveGoal} 
            onCancel={() => setScreen("dashboard")} 
          />
        )}

        {screen === "profile" && (
          <ProfileScreen 
            user={user} 
            stats={stats} 
            onLogout={handleLogout} 
            onNavigate={setScreen} 
          />
        )}

        {screen === "detail" && selectedGoal && (
          <GoalDetailScreen 
            goal={selectedGoal} 
            onBack={() => setScreen("dashboard")} 
            onUpdateProgress={handleUpdateProgress} 
            onTriggerComplete={handleCompleteGoal} 
            onTriggerDelete={handleDeleteGoal} 
          />
        )}
      </div>
    </div>
  );
}