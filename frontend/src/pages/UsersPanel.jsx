import React, { useEffect, useState } from 'react';
import { useApi } from '../api.js';
import { IconUsers } from '../components/icons.jsx';

export default function UsersPanel() {
  const api = useApi();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(false);
        setAssignments([]);
      } catch (err) {
        setError('');
      }
    };
    fetch();
  }, [api]);

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <h3>Usuarios asignados</h3>
          <p>Visualiza a las personas que acompañas y comparte retroalimentación personalizada.</p>
        </div>
        <span className="badge">
          <IconUsers size={18} /> Entrenadores
        </span>
      </div>
      {loading ? (
        <div className="empty-state">Cargando...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : assignments.length === 0 ? (
        <div className="empty-state">
          Aún no tienes usuarios asignados en la plataforma. Una vez el administrador realice las
          asignaciones, podrás visualizar sus rutinas y progreso aquí.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Programa</th>
                <th>Última actualización</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.name}</td>
                  <td>{assignment.program}</td>
                  <td>{assignment.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
