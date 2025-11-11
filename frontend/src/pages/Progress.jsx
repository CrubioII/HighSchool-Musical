import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../api.js';

/**
 * ProgressPage allows a user to record their progress on routines and view
 * existing logs. Students and collaborators can select one of their
 * routines and exercises, specify performance metrics and submit a log.
 */
export default function ProgressPage() {
  const api = useApi();
  const { role } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    routineId: '',
    exerciseId: '',
    repetitions: 0,
    duration: 0,
    effortLevel: 'medio',
    comments: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [routRes, exRes, logRes] = await Promise.all([
          api.get('/api/routines'),
          api.get('/api/exercises'),
          api.get('/api/progress'),
        ]);
        // Only user's own routines are returned by API if role is student/colaborador
        setRoutines(routRes.data);
        setExercises(exRes.data);
        setLogs(logRes.data);
        setError('');
      } catch (err) {
        setError('Error al cargar rutinas o registros');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshLogs = async () => {
    const res = await api.get('/api/progress');
    setLogs(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.routineId || !form.exerciseId) {
        setError('Debe seleccionar rutina y ejercicio');
        return;
      }
      const payload = {
        routineId: form.routineId,
        exerciseId: form.exerciseId,
        repetitions: Number(form.repetitions),
        duration: Number(form.duration),
        effortLevel: form.effortLevel,
        comments: form.comments,
      };
      await api.post('/api/progress', payload);
      setForm({
        routineId: '',
        exerciseId: '',
        repetitions: 0,
        duration: 0,
        effortLevel: 'medio',
        comments: '',
      });
      await refreshLogs();
    } catch (err) {
      setError('Error al registrar progreso');
    }
  };

  return (
    <div>
      <h3>Progreso de rutinas</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          {error && <p className="error">{error}</p>}
          {(role === 'student' || role === 'colaborador') && (
            <div className="progress-form">
              <h4>Registrar progreso</h4>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Rutina</label>
                  <select
                    value={form.routineId}
                    onChange={(e) => {
                      const routineId = e.target.value;
                      setForm((prev) => ({ ...prev, routineId }));
                      // Reset exerciseId when routine changes
                      setForm((prev) => ({ ...prev, exerciseId: '' }));
                    }}
                  >
                    <option value="">Seleccione</option>
                    {routines
                      .filter((rt) => !rt.isPredefined)
                      .map((rt) => (
                        <option key={rt._id} value={rt._id}>
                          {rt.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label>Ejercicio</label>
                  <select
                    value={form.exerciseId}
                    onChange={(e) => setForm((prev) => ({ ...prev, exerciseId: e.target.value }))}
                    disabled={!form.routineId}
                  >
                    <option value="">Seleccione</option>
                    {exercises.map((ex) => (
                      <option key={ex._id} value={ex._id}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Repeticiones</label>
                  <input
                    type="number"
                    min="0"
                    value={form.repetitions}
                    onChange={(e) => setForm((prev) => ({ ...prev, repetitions: e.target.value }))}
                  />
                </div>
                <div>
                  <label>Duración (min)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.duration}
                    onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                  />
                </div>
                <div>
                  <label>Esfuerzo</label>
                  <select
                    value={form.effortLevel}
                    onChange={(e) => setForm((prev) => ({ ...prev, effortLevel: e.target.value }))}
                  >
                    <option value="bajo">Bajo</option>
                    <option value="medio">Medio</option>
                    <option value="alto">Alto</option>
                  </select>
                </div>
                <div>
                  <label>Comentarios</label>
                  <textarea
                    value={form.comments}
                    onChange={(e) => setForm((prev) => ({ ...prev, comments: e.target.value }))}
                  />
                </div>
                <button type="submit">Registrar</button>
              </form>
            </div>
          )}
          <h4>Historial de progreso</h4>
          {logs.length === 0 ? (
            <p>No hay registros.</p>
          ) : (
            <table className="progress-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Rutina</th>
                  <th>Ejercicio</th>
                  <th>Reps</th>
                  <th>Duración</th>
                  <th>Esfuerzo</th>
                  <th>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>{new Date(log.date).toLocaleString()}</td>
                    <td>{routines.find((rt) => rt._id === log.routineId)?.name || '-'}</td>
                    <td>{exercises.find((ex) => ex._id === log.exerciseId)?.name || '-'}</td>
                    <td>{log.repetitions}</td>
                    <td>{log.duration}</td>
                    <td>{log.effortLevel}</td>
                    <td>{log.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}