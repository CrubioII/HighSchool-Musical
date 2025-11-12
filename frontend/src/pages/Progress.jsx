import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../api.js';
import { IconActivity, IconClipboard, IconTrendingUp } from '../components/icons.jsx';

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
      setError('');
    } catch (err) {
      setError('Error al registrar progreso');
    }
  };

  return (
    <div className="page-stack">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h3>Seguimiento de progreso</h3>
            <p>Registra tus resultados y consulta el historial de entrenamientos.</p>
          </div>
          <span className="badge">
            <IconTrendingUp size={18} /> Registro activo
          </span>
        </div>
        {loading ? (
          <div className="empty-state">Cargando información...</div>
        ) : (
          <>
            {error && <div className="alert alert-error">{error}</div>}
            {(role === 'student' || role === 'colaborador') && (
              <div className="page-section" style={{ marginBottom: '2rem', boxShadow: 'none' }}>
                <h4 style={{ marginTop: 0 }}>Registrar progreso</h4>
                <form onSubmit={handleSubmit} className="form-grid">
                  <div className="form-grid-two">
                    <div>
                      <label>Rutina</label>
                      <select
                        value={form.routineId}
                        onChange={(e) => {
                          const routineId = e.target.value;
                          setForm((prev) => ({ ...prev, routineId, exerciseId: '' }));
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
                  </div>
                  <div className="form-grid-two">
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
                  </div>
                  <div>
                    <label>Comentarios</label>
                    <textarea
                      value={form.comments}
                      onChange={(e) => setForm((prev) => ({ ...prev, comments: e.target.value }))}
                      rows="3"
                    />
                  </div>
                  <button className="btn btn-primary" type="submit">
                    <IconClipboard size={18} /> Registrar
                  </button>
                </form>
              </div>
            )}
            <h4>Historial de progreso</h4>
            {logs.length === 0 ? (
              <div className="empty-state">No hay registros.</div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
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
              </div>
            )}
          </>
        )}
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h3>Consejos rápidos</h3>
        </div>
        <div className="grid-cards">
          <article className="card">
            <h4>
              <IconActivity size={18} /> Calentamiento activo
            </h4>
            <p>Dedica 5 minutos a movilidad articular para mejorar el rendimiento de cada sesión.</p>
          </article>
          <article className="card">
            <h4>
              <IconTrendingUp size={18} /> Progresión consciente
            </h4>
            <p>Aumenta la intensidad gradualmente y registra notas para que tu entrenador pueda apoyarte.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
