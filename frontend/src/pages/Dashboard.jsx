import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ExercisesPage from './Exercises.jsx';
import RoutinesPage from './Routines.jsx';
import UsersPanel from './UsersPanel.jsx';
import AdminPanel from './AdminPanel.jsx';
import ProgressPage from './Progress.jsx';

// Placeholder components for demonstration; these can be expanded with
// additional functionality and charts.
function Home() {
  const { role } = useAuth();
  return <p>Bienvenido/a al portal de bienestar. Tu rol es <strong>{role}</strong>.</p>;
}

export default function DashboardPage() {
  const { role, logout } = useAuth();
  return (
    <div className="dashboard">
      <header>
        <h2>Panel de control</h2>
        <button onClick={logout}>Cerrar sesión</button>
      </header>
      <nav>
        <ul>
          <li>
            <Link to="">Inicio</Link>
          </li>
          <li>
            <Link to="exercises">Ejercicios</Link>
          </li>
          <li>
            <Link to="routines">Rutinas</Link>
          </li>
          <li>
            <Link to="progress">Progreso</Link>
          </li>
          {role === 'trainer' && (
            <li>
              <Link to="users">Usuarios asignados</Link>
            </li>
          )}
          {role === 'admin' && (
            <li>
              <Link to="admin">Administración</Link>
            </li>
          )}
        </ul>
      </nav>
      <main>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="exercises" element={<ExercisesPage />} />
          <Route path="routines" element={<RoutinesPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="users" element={<UsersPanel />} />
          <Route path="admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  );
}