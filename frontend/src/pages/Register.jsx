import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { IconLock, IconUser } from '../components/icons.jsx';
import logoBienestar from '../assets/logo-bienestar.svg';
import logoIcesi from '../assets/logo-icesi.svg';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Estudiante' },
  { value: 'colaborador', label: 'Colaborador' },
  { value: 'trainer', label: 'Entrenador' },
  { value: 'admin', label: 'Administrador' },
];

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLE_OPTIONS[0].value);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(username, password, role);
      navigate('/');
    } catch (err) {
      const message = err?.response?.data?.message || 'No se pudo completar el registro. Intenta nuevamente.';
      setError(message);
    }
  };

  return (
    <div className="login-page">
      <aside className="login-hero">
        <div className="hero-content">
          <div>
            <img src={logoIcesi} alt="Universidad ICESI" width={180} />
            <h2>Únete a la comunidad de bienestar ICESI.</h2>
            <p>
              Crea tu cuenta para acceder a rutinas personalizadas, registrar tu progreso y
              mantenerte en contacto con el equipo de bienestar.
            </p>
          </div>
          <div className="hero-card">
            <strong>Experiencias a tu medida</strong>
            <p>
              Selecciona tu rol para recibir contenidos y acompañamiento de acuerdo con tus
              necesidades dentro de la universidad.
            </p>
            <div className="pill-list">
              <span className="pill">Bienestar</span>
              <span className="pill">Acompañamiento</span>
              <span className="pill">Comunidad</span>
            </div>
          </div>
        </div>
      </aside>

      <section className="login-panel">
        <div className="login-panel-inner">
          <header>
            <img src={logoBienestar} alt="ICESI Bienestar" width={160} />
            <h1>Crear cuenta</h1>
            <p>Completa la información para registrarte en el portal.</p>
          </header>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div>
              <label className="label-text" htmlFor="username">
                Usuario
              </label>
              <div className="input-field">
                <IconUser size={20} />
                <input
                  id="username"
                  type="text"
                  placeholder="ej. 1098123456"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label-text" htmlFor="password">
                Contraseña
              </label>
              <div className="input-field">
                <IconLock size={20} />
                <input
                  id="password"
                  type="password"
                  placeholder="Crea una contraseña segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label-text" htmlFor="role">
                Rol en el portal
              </label>
              <div className="input-field">
                <IconUser size={20} />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className="primary-btn" type="submit">
              Registrarme
            </button>
          </form>

          <div className="form-footer">
            <p>¿Ya tienes cuenta? Ingresa con tus credenciales.</p>
            <p>
              <Link to="/login">Ir al login</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
