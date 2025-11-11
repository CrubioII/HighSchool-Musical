const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/postgres');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Handles user login. It verifies the provided username and password against
 * credentials stored in the PostgreSQL database. Upon successful authentication
 * it issues a JWT containing the user's id and role. The password should be
 * stored hashed in the database. For demonstration purposes we assume a table
 * `gym_app.app_user` with columns (id, username, password_hash, role).
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
  }
  try {
    const result = await db.query(
      'SELECT id, username, password_hash, role FROM gym_app.app_user WHERE username = $1',
      [username]
    );
    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });
    res.json({ token });
  } catch (err) {
    console.error('Error en login', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};