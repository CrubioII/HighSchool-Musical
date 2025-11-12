import React, { useState } from 'react';
import { useApi } from '../api.js';
import { IconUserCheck } from '../components/icons.jsx';

export default function AdminPanel() {
  const api = useApi();
  const [userId, setUserId] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/api/admin/assign', {
        userId: Number(userId),
        instructorId: Number(instructorId),
      });
      setMessage('Asignación exitosa');
      setUserId('');
      setInstructorId('');
    } catch (err) {
      setError('Error al asignar entrenador');
    }
  };

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <h3>Asignar entrenador a usuario</h3>
          <p>Coordina el acompañamiento seleccionando la dupla ideal entre entrenadores y estudiantes.</p>
        </div>
        <span className="badge">
          <IconUserCheck size={18} /> Administrador
        </span>
      </div>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-grid-two">
          <div>
            <label htmlFor="admin-user">ID del usuario</label>
            <input
              id="admin-user"
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              placeholder="Ejemplo: 102030"
            />
          </div>
          <div>
            <label htmlFor="admin-instructor">ID del instructor</label>
            <input
              id="admin-instructor"
              type="number"
              value={instructorId}
              onChange={(e) => setInstructorId(e.target.value)}
              required
              placeholder="Ejemplo: 409876"
            />
          </div>
        </div>
        <button className="btn btn-primary" type="submit">
          Confirmar asignación
        </button>
      </form>
    </section>
  );
}
