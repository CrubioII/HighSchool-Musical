import React, { useState } from 'react';
import { useApi } from '../api.js';

/**
 * AdminPanel provides a simple interface for the well‑being chief (admin) to
 * assign or reassign a trainer to a user. It posts to the backend
 * /api/admin/assign endpoint with the selected user and instructor IDs.
 */
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
    <div>
      <h3>Asignar entrenador a usuario</h3>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="admin-form">
        <div>
          <label>ID del usuario</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>ID del instructor</label>
          <input
            type="number"
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Asignar</button>
      </form>
    </div>
  );
}