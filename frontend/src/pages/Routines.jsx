import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../api.js';
import { IconCalendarPlus, IconCheckCircle, IconPlus } from '../components/icons.jsx';

export default function RoutinesPage() {
  const api = useApi();
  const { role } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [routineForm, setRoutineForm] = useState({
    name: '',
    description: '',
    isPredefined: false,
    items: [],
  });
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [routRes, exRes] = await Promise.all([
          api.get('/api/routines'),
          api.get('/api/exercises'),
        ]);
        setRoutines(routRes.data);
        setExercises(exRes.data);
      } catch (err) {
        setError('Error al cargar rutinas o ejercicios');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshRoutines = async () => {
    const res = await api.get('/api/routines');
    setRoutines(res.data);
  };

  const handleAddItem = () => {
    setRoutineForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          exerciseId: exercises.length > 0 ? exercises[0]._id : '',
          order: prev.items.length + 1,
          sets: 0,
          reps: 0,
          duration: 0,
          rest: 0,
        },
      ],
    }));
  };

  const handleItemChange = (index, field, value) => {
    setRoutineForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const handleCreateRoutine = async (e) => {
    e.preventDefault();
    try {
      if (routineForm.items.some((it) => !it.exerciseId)) {
        setError('Todos los ejercicios deben seleccionarse');
        return;
      }
      const payload = {
        name: routineForm.name,
        description: routineForm.description,
        isPredefined: routineForm.isPredefined,
        exercises: routineForm.items.map((item) => ({
          exerciseId: item.exerciseId,
          order: Number(item.order),
          sets: Number(item.sets),
          reps: Number(item.reps),
          duration: Number(item.duration),
          rest: Number(item.rest),
        })),
      };
      await api.post('/api/routines', payload);
      setShowCreate(false);
      setRoutineForm({ name: '', description: '', isPredefined: false, items: [] });
      await refreshRoutines();
      setError('');
    } catch (err) {
      setError('Error al crear rutina');
    }
  };

  const handleAdopt = async (routineId) => {
    try {
      await api.post(`/api/routines/${routineId}/adopt`);
      await refreshRoutines();
    } catch (err) {
      setError('Error al adoptar rutina');
    }
  };

  return (
    <div className="page-stack">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h3>Gestión de rutinas</h3>
            <p>Crea planes personalizados y comparte rutinas prediseñadas.</p>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => setShowCreate((prev) => !prev)}>
            <IconCalendarPlus size={18} /> {showCreate ? 'Cerrar formulario' : 'Nueva rutina'}
          </button>
        </div>
        {loading ? (
          <div className="empty-state">Cargando rutinas y ejercicios...</div>
        ) : (
          <>
            {error && <div className="alert alert-error">{error}</div>}
            {showCreate && (
              <div className="page-section" style={{ marginBottom: '2rem', boxShadow: 'none' }}>
                <h4 style={{ marginTop: 0 }}>Nueva rutina</h4>
                <form onSubmit={handleCreateRoutine} className="form-grid">
                  <div className="form-grid-two">
                    <div>
                      <label htmlFor="routine-name">Nombre</label>
                      <input
                        id="routine-name"
                        type="text"
                        value={routineForm.name}
                        onChange={(e) => setRoutineForm({ ...routineForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="routine-type">Tipo</label>
                      <div className="pill-list">
                        <span className="badge">{routineForm.isPredefined ? 'Prediseñada' : 'Personal'}</span>
                        {(role === 'trainer' || role === 'admin') && (
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={() =>
                              setRoutineForm((prev) => ({ ...prev, isPredefined: !prev.isPredefined }))
                            }
                          >
                            <IconCheckCircle size={18} /> Marcar como {routineForm.isPredefined ? 'personal' : 'prediseñada'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="routine-description">Descripción</label>
                    <textarea
                      id="routine-description"
                      value={routineForm.description}
                      onChange={(e) => setRoutineForm({ ...routineForm, description: e.target.value })}
                    />
                  </div>
                  <h5>Ejercicios</h5>
                  {routineForm.items.map((item, idx) => (
                    <div key={idx} className="form-grid-two" style={{ alignItems: 'end' }}>
                      <div>
                        <label>Ejercicio</label>
                        <select
                          value={item.exerciseId}
                          onChange={(e) => handleItemChange(idx, 'exerciseId', e.target.value)}
                        >
                          {exercises.map((ex) => (
                            <option key={ex._id} value={ex._id}>
                              {ex.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label>Orden</label>
                        <input
                          type="number"
                          min="1"
                          value={item.order}
                          onChange={(e) => handleItemChange(idx, 'order', e.target.value)}
                        />
                      </div>
                      <div>
                        <label>Sets</label>
                        <input
                          type="number"
                          min="0"
                          value={item.sets}
                          onChange={(e) => handleItemChange(idx, 'sets', e.target.value)}
                        />
                      </div>
                      <div>
                        <label>Repeticiones</label>
                        <input
                          type="number"
                          min="0"
                          value={item.reps}
                          onChange={(e) => handleItemChange(idx, 'reps', e.target.value)}
                        />
                      </div>
                      <div>
                        <label>Duración (min)</label>
                        <input
                          type="number"
                          min="0"
                          value={item.duration}
                          onChange={(e) => handleItemChange(idx, 'duration', e.target.value)}
                        />
                      </div>
                      <div>
                        <label>Descanso (min)</label>
                        <input
                          type="number"
                          min="0"
                          value={item.rest}
                          onChange={(e) => handleItemChange(idx, 'rest', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-secondary" type="button" onClick={handleAddItem}>
                    <IconPlus size={18} /> Añadir ejercicio
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Guardar rutina
                  </button>
                </form>
              </div>
            )}
            <h4 style={{ marginTop: showCreate ? '1rem' : 0 }}>Listado de rutinas</h4>
            {routines.length === 0 ? (
              <div className="empty-state">No tienes rutinas creadas o disponibles.</div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Ejercicios</th>
                      <th>Tipo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routines.map((rt) => (
                      <tr key={rt._id}>
                        <td>{rt.name}</td>
                        <td>{rt.description}</td>
                        <td>{(rt.exercises || []).length}</td>
                        <td>
                          <span className="badge">{rt.isPredefined ? 'Prediseñada' : 'Personal'}</span>
                        </td>
                        <td>
                          {rt.isPredefined && role !== 'trainer' && role !== 'admin' ? (
                            <button className="btn btn-secondary" onClick={() => handleAdopt(rt._id)}>
                              Adoptar
                            </button>
                          ) : (
                            <span className="badge" style={{ background: 'rgba(15,23,42,0.08)' }}>Sin acciones</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
