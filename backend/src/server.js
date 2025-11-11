const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectMongo = require('./db/mongo');
const { pool } = require('./db/postgres');

// Load environment variables from .env
dotenv.config();

// Import route modules
const authRoutes = require('./routes/authRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const routineRoutes = require('./routes/routineRoutes');
const progressRoutes = require('./routes/progressRoutes');
const statsRoutes = require('./routes/statsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

// Initialize express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Health check endpoint
app.get('/api/health', (_, res) => res.json({ status: 'OK' }));

// Global error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

async function start() {
  // Connect to MongoDB
  await connectMongo();
  // Check PostgreSQL connection by running a simple query
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected');
  } catch (err) {
    console.error('Error al conectar a PostgreSQL', err);
    process.exit(1);
  }
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
}

// Start the application
start().catch((err) => {
  console.error('Error al iniciar la aplicación', err);
});