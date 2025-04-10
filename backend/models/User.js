// models/User.js
const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async findByEmail(email) {
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return users.length ? users[0] : null;
  }

  static async findById(id) {
    const [users] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return users.length ? users[0] : null;
  }

  static async create(userData) {
    const { name, email, password, role = 'presenter' } = userData;
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    
    return {
      id: result.insertId,
      name,
      email,
      role
    };
  }

  static async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password);
  }
}

module.exports = User;