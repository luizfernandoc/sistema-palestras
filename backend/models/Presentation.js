// models/Presentation.js
const db = require('../config/database');
const crypto = require('crypto');

class Presentation {
  static async findById(id) {
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE id = ?',
      [id]
    );
    return presentations.length ? presentations[0] : null;
  }

  static async findByCode(accessCode) {
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE access_code = ?',
      [accessCode]
    );
    return presentations.length ? presentations[0] : null;
  }

  static async findByUser(userId) {
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE user_id = ? ORDER BY date DESC, time DESC',
      [userId]
    );
    return presentations;
  }

  static async create(presentationData) {
    const { title, description, date, time, location, theme, userId } = presentationData;
    
    // Gerar código único para a apresentação
    const uniqueCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    const [result] = await db.execute(
      'INSERT INTO presentations (title, description, date, time, location, theme, user_id, access_code, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, date, time, location, theme, userId, uniqueCode, 'scheduled']
    );
    
    return {
      id: result.insertId,
      title,
      description,
      date,
      time,
      location,
      theme,
      user_id: userId,
      access_code: uniqueCode,
      status: 'scheduled'
    };
  }

  static async update(id, presentationData) {
    const { title, description, date, time, location, theme } = presentationData;
    
    await db.execute(
      'UPDATE presentations SET title = ?, description = ?, date = ?, time = ?, location = ?, theme = ? WHERE id = ?',
      [title, description, date, time, location, theme, id]
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    await db.execute(
      'DELETE FROM presentations WHERE id = ?',
      [id]
    );
    return true;
  }

  static async start(id) {
    await db.execute(
      'UPDATE presentations SET status = ?, start_time = NOW() WHERE id = ?',
      ['active', id]
    );
    return this.findById(id);
  }

  static async end(id) {
    await db.execute(
      'UPDATE presentations SET status = ?, end_time = NOW() WHERE id = ?',
      ['completed', id]
    );
    return this.findById(id);
  }
}

module.exports = Presentation;