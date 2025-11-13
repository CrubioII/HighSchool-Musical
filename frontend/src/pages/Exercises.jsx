import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../api.js';
import { IconEdit, IconPlus, IconRefresh, IconTrash } from '../components/icons.jsx';

export default function ExercisesPage() {
  const api = useApi();
  const { role } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
        await api.put(`/api/exercises/${form.id}`, payload);
      } else {
        await api.post('/api/exercises', payload);
      }
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
    <div className="page-stack">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h3>Biblioteca de ejercicios</h3>
            <p>Consulta los ejercicios disponibles y su nivel de dificultad.</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => resetForm()}>
            <IconRefresh size={18} /> Limpiar formulario
          </button>
        </div>
        {loading ? (
          <div className="empty-state">Cargando ejercicios...</div>
        ) : (
          <>
            {error && <div className="alert alert-error">{error}</div>}
            {exercises.length === 0 ? (
              <div className="empty-state">No hay ejercicios registrados aún.</div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
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
                        <td>
                          <span className="badge">{(ex.videos || []).length} recursos</span>
                        </td>
                        {['trainer', 'admin'].includes(role) && (
                          <td>
                            <div className="pill-list">
                              <button className="btn btn-secondary" type="button" onClick={() => handleEdit(ex)}>
                                <IconEdit size={18} /> Editar
                              </button>
                              <button className="btn btn-danger" type="button" onClick={() => handleDelete(ex._id)}>
                                <IconTrash size={18} /> Eliminar
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>

      {['trainer', 'admin'].includes(role) && (
        <section className="page-section">
          <div className="section-heading">
            <h3>{isEditing ? 'Editar ejercicio' : 'Crear nuevo ejercicio'}</h3>
            {!isEditing && (
              <span className="badge">Aporta variedad a tus rutinas</span>
            )}
          </div>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-grid-two">
              <div>
                <label htmlFor="exercise-name">Nombre</label>
                <input
                  id="exercise-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="exercise-type">Tipo</label>
                <select id="exercise-type" name="type" value={form.type} onChange={handleChange}>
                  <option value="cardio">Cardio</option>
                  <option value="fuerza">Fuerza</option>
                  <option value="movilidad">Movilidad</option>
                </select>
              </div>
            </div>
            <div className="form-grid-two">
              <div>
                <label htmlFor="exercise-difficulty">Dificultad</label>
                <select
                  id="exercise-difficulty"
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
              <div>
                <label htmlFor="exercise-duration">Duración (minutos)</label>
                <input
                  id="exercise-duration"
                  name="duration"
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="exercise-description">Descripción</label>
              <textarea
                id="exercise-description"
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="exercise-videos">Videos (URL separadas por coma)</label>
              <input
                id="exercise-videos"
                name="videos"
                type="text"
                value={form.videos}
                onChange={handleChange}
              />
            </div>
            <div className="pill-list">
              <button className="btn btn-primary" type="submit">
                <IconPlus size={18} /> {isEditing ? 'Actualizar ejercicio' : 'Crear ejercicio'}
              </button>
              {isEditing && (
                <button className="btn btn-neutral" type="button" onClick={resetForm}>
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
