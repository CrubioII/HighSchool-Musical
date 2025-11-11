import React, { useEffect, useState } from 'react';
import { useApi } from '../api.js';

/**
 * UsersPanel is a placeholder for trainers to view users assigned to them.
 * In a real implementation, this would fetch assignments from the backend
 * and display routine summaries and progress for each user. Currently it
 * displays a static message.
 */
export default function UsersPanel() {
  const api = useApi();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: implement endpoint to fetch trainer assignments
    // Placeholder: show message only
    const fetch = async () => {
      try {
        setLoading(false);
      } catch (err) {
        setError('');
      }
    };
    fetch();
  }, [api]);

  return (
    <div>
      <h3>Usuarios asignados</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <p>Funcionalidad en construcción. Aquí se mostrarán los usuarios asignados al entrenador.</p>
      )}
    </div>
  );
}