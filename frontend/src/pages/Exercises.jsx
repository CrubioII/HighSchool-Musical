import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../api.js';

/**
 * ExercisesPage displays a list of exercises stored in MongoDB. Trainers
 * and administrators can create new exercises and edit or delete existing
 * ones. Students and collaborators have read‑only access.
 */
export default function ExercisesPage() {
  const api = useApi();
  const { role } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Form state for creating/updating exercises
  const [form, setForm] = useState({
    id: null,
    name: '',
    type: 'cardio',
    description: '',
    duration: 30,
    difficulty: 'principiante',
    videos: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load exercises on mount
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/exercises');
        setExercises(res.data);
        setError('');
      } catch (err) {
        setError('Error al cargar ejercicios');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
    // adding api to deps will reattach interceptors continuously; avoid
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      type: 'cardio',
      description: '',
      duration: 30,
      difficulty: 'principiante',
      videos: '',
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        type: form.type,
        description: form.description,
        duration: Number(form.duration),
        difficulty: form.difficulty,
        videos: form.videos
          .split(',')
          .map((v) => v.trim())
          .filter((v) => v.length > 0),
      };
      if (isEditing && form.id) {
        // Update existing
        await api.put(`/api/exercises/${form.id}`, payload);
      } else {
        // Create new
        await api.post('/api/exercises', payload);
      }
      // Refresh list and reset form
      const res = await api.get('/api/exercises');
      setExercises(res.data);
      resetForm();
      setError('');
    } catch (err) {
      setError('Error al guardar ejercicio');
    }
  };

  const handleEdit = (exercise) => {
    setIsEditing(true);
    setForm({
      id: exercise._id,
      name: exercise.name,
      type: exercise.type,
      description: exercise.description,
      duration: exercise.duration,
      difficulty: exercise.difficulty,
      videos: (exercise.videos || []).join(', '),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este ejercicio?')) return;
    try {
      await api.delete(`/api/exercises/${id}`);
      setExercises((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError('Error al eliminar ejercicio');
    }
  };

  return (
    <div>
      <h3>Ejercicios</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          {error && <p className="error">{error}</p>}
          {/* List of exercises */}
          <table className="exercise-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Dificultad</th>
                <th>Duración (min)</th>
                <th>Videos</th>
                {['trainer', 'admin'].includes(role) && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {exercises.map((ex) => (
                <tr key={ex._id}>
                  <td>{ex.name}</td>
                  <td>{ex.type}</td>
                  <td>{ex.difficulty}</td>
                  <td>{ex.duration}</td>
                  <td>{(ex.videos || []).length}</td>
                  {['trainer', 'admin'].includes(role) && (
                    <td>
                      <button onClick={() => handleEdit(ex)}>Editar</button>{' '}
                      <button onClick={() => handleDelete(ex._id)}>Eliminar</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Form to create or edit exercise (only for trainer/admin) */}
          {['trainer', 'admin'].includes(role) && (
            <div className="exercise-form">
              <h4>{isEditing ? 'Editar ejercicio' : 'Crear ejercicio'}</h4>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Nombre</label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Tipo</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="cardio">Cardio</option>
                    <option value="fuerza">Fuerza</option>
                    <option value="movilidad">Movilidad</option>
                  </select>
                </div>
                <div>
                  <label>Dificultad</label>
                  <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
                <div>
                  <label>Duración (minutos)</label>
                  <input
                    name="duration"
                    type="number"
                    min="1"
                    value={form.duration}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Descripción</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                <div>
                  <label>Videos (URL separadas por coma)</label>
                  <input name="videos" type="text" value={form.videos} onChange={handleChange} />
                </div>
                <button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</button>
                {isEditing && <button type="button" onClick={resetForm}>Cancelar</button>}
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}