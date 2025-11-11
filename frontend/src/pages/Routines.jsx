import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../api.js';

/**
 * RoutinesPage allows users to view their routines and adopt predefined ones.
 * Trainers can create predefined routines and normal users can create their
 * own routines by selecting exercises and specifying parameters. This page
 * demonstrates basic CRUD operations and adoption logic.
 */
export default function RoutinesPage() {
  const api = useApi();
  const { role } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Form state for creating new routine
  const [routineForm, setRoutineForm] = useState({
    name: '',
    description: '',
    isPredefined: false,
    items: [], // list of { exerciseId, order, sets, reps, duration, rest }
  });
  const [showCreate, setShowCreate] = useState(false);

  // Load routines and exercises on mount
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
    // When adding a new item, default exerciseId to empty string if there are no exercises
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
      // Validate that all items have an exercise selected
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
    <div>
      <h3>Rutinas</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          {error && <p className="error">{error}</p>}
          <button onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? 'Cancelar' : 'Crear nueva rutina'}
          </button>
          {showCreate && (
            <div className="routine-form">
              <h4>Nueva rutina</h4>
              <form onSubmit={handleCreateRoutine}>
                <div>
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={routineForm.name}
                    onChange={(e) => setRoutineForm({ ...routineForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>Descripción</label>
                  <textarea
                    value={routineForm.description}
                    onChange={(e) => setRoutineForm({ ...routineForm, description: e.target.value })}
                  />
                </div>
                {/* Trainers can mark as predefined */}
                {role === 'trainer' || role === 'admin' ? (
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={routineForm.isPredefined}
                        onChange={(e) =>
                          setRoutineForm({ ...routineForm, isPredefined: e.target.checked })
                        }
                      />
                      Marcar como rutina prediseñada
                    </label>
                  </div>
                ) : null}
                <h5>Ejercicios</h5>
                {routineForm.items.map((item, idx) => (
                  <div key={idx} className="routine-item">
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
                    <input
                      type="number"
                      min="1"
                      placeholder="Orden"
                      value={item.order}
                      onChange={(e) => handleItemChange(idx, 'order', e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Sets"
                      value={item.sets}
                      onChange={(e) => handleItemChange(idx, 'sets', e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Reps"
                      value={item.reps}
                      onChange={(e) => handleItemChange(idx, 'reps', e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Duración (min)"
                      value={item.duration}
                      onChange={(e) => handleItemChange(idx, 'duration', e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Descanso (min)"
                      value={item.rest}
                      onChange={(e) => handleItemChange(idx, 'rest', e.target.value)}
                    />
                  </div>
                ))}
                <button type="button" onClick={handleAddItem}>
                  Añadir ejercicio
                </button>
                <button type="submit">Guardar rutina</button>
              </form>
            </div>
          )}
          <h4>Listado de rutinas</h4>
          {routines.length === 0 ? (
            <p>No tienes rutinas creadas o disponibles.</p>
          ) : (
            <table className="routine-table">
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
                    <td>{rt.isPredefined ? 'Prediseñada' : 'Personal'}</td>
                    <td>
                      {rt.isPredefined && role !== 'trainer' && role !== 'admin' ? (
                        <button onClick={() => handleAdopt(rt._id)}>Adoptar</button>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
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