import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { IconLock, IconUser } from '../components/icons.jsx';
import logoBienestar from '../assets/logo-bienestar.svg';
import logoIcesi from '../assets/logo-icesi.svg';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Usuario o contraseña incorrectos. Intenta nuevamente.');
    }
  };

  return (
    <div className="login-page">
      <aside className="login-hero">
        <div className="hero-content">
          <div>
            <img src={logoIcesi} alt="Universidad ICESI" width={180} />
            <h2>Llega más lejos con el bienestar universitario ICESI.</h2>
            <p>
              Accede a tus rutinas personalizadas, sigue tu progreso y mantente en contacto
              con tu equipo de bienestar y entrenadores certificados.
            </p>
          </div>
          <div className="hero-card">
            <strong>Somos comunidad saludable</strong>
            <p>
              Participa en actividades deportivas, culturales y de salud integral pensadas para
              potenciar tu experiencia universitaria.
            </p>
            <div className="pill-list">
              <span className="pill">Deporte</span>
              <span className="pill">Hábitos saludables</span>
              <span className="pill">Acompañamiento</span>
            </div>
          </div>
        </div>
      </aside>

      <section className="login-panel">
        <div className="login-panel-inner">
          <header>
            <img src={logoBienestar} alt="ICESI Bienestar" width={160} />
            <h1>Portal Bienestar ICESI</h1>
            <p>Inicia sesión con tu usuario institucional</p>
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
                  placeholder="Tu contraseña segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button className="primary-btn" type="submit">
              Ingresar
            </button>
          </form>

          <div className="form-footer">
            <p>¿Olvidaste tu contraseña? Comunícate con la mesa de servicio ICESI.</p>
            <p>
              <a href="mailto:soporte@icesi.edu.co">soporte@icesi.edu.co</a> · (602) 555 1234
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
