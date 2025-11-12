import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ExercisesPage from './Exercises.jsx';
import RoutinesPage from './Routines.jsx';
import UsersPanel from './UsersPanel.jsx';
import AdminPanel from './AdminPanel.jsx';
import ProgressPage from './Progress.jsx';
import logoBienestar from '../assets/logo-bienestar.svg';
import {
  IconActivity,
  IconBarChart,
  IconCheckCircle,
  IconHome,
  IconLayers,
  IconLogOut,
  IconUsers,
} from '../components/icons.jsx';

function Home() {
  const { role } = useAuth();
  const highlights = [
    {
      title: 'Rutinas inteligentes',
      description:
        'Recibe planes personalizados basados en tus objetivos y mantente al día con recordatorios automáticos.',
    },
    {
      title: 'Seguimiento integral',
      description:
        'Registra el avance de tus entrenamientos, niveles de esfuerzo y comentarios para tu entrenador.',
    },
    {
      title: 'Comunidad activa',
      description:
        'Accede a eventos, talleres y acompañamiento del equipo de bienestar para potenciar tu experiencia.',
    },
  ];

  return (
    <div className="page-section">
      <div className="section-heading">
        <div>
          <h3>Bienvenido/a al ecosistema de bienestar</h3>
          <p>Tu rol actual: <strong className="badge">{role}</strong></p>
        </div>
      </div>
      <div className="grid-cards">
        {highlights.map((item) => (
          <article key={item.title} className="card">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
      <div className="highlight-card" style={{ marginTop: '2rem' }}>
        <h3>Potencia tus hábitos saludables</h3>
        <p>
          Explora las secciones laterales para crear rutinas, consultar ejercicios guiados, registrar tu
          progreso o gestionar usuarios asignados. Todo desde un mismo panel moderno y accesible.
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { role, logout } = useAuth();

  const navigation = [
    { to: '', label: 'Inicio', icon: <IconHome size={20} />, roles: ['student', 'colaborador', 'trainer', 'admin'] },
    {
      to: 'exercises',
      label: 'Ejercicios',
      icon: <IconActivity size={20} />,
      roles: ['student', 'colaborador', 'trainer', 'admin'],
    },
    { to: 'routines', label: 'Rutinas', icon: <IconLayers size={20} />, roles: ['student', 'colaborador', 'trainer', 'admin'] },
    { to: 'progress', label: 'Progreso', icon: <IconBarChart size={20} />, roles: ['student', 'colaborador', 'trainer', 'admin'] },
    { to: 'users', label: 'Usuarios', icon: <IconUsers size={20} />, roles: ['trainer'] },
    { to: 'admin', label: 'Administración', icon: <IconCheckCircle size={20} />, roles: ['admin'] },
  ];

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logoBienestar} alt="Bienestar ICESI" />
          <p className="sidebar-subtext">Cuidamos de tu bienestar físico, emocional y social.</p>
        </div>
        <nav className="sidebar-nav">
          {navigation
            .filter((item) => item.roles.includes(role))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ''}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
        </nav>
        <div className="sidebar-footer">
          <p>Universidad ICESI · Bienestar Universitario</p>
          <p>Campus Pance · Cali - Colombia</p>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="topbar">
          <div>
            <h2>Panel de bienestar</h2>
            <p>Gestiona actividades, rutinas y acompañamiento institucional</p>
          </div>
          <button className="logout-btn" onClick={logout}>
            <IconLogOut size={20} /> Cerrar sesión
          </button>
        </header>
        <div className="dashboard-content">
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="exercises" element={<ExercisesPage />} />
            <Route path="routines" element={<RoutinesPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="users" element={<UsersPanel />} />
            <Route path="admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
