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
      'SELECT * FROM presentations WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );
    return presentations;
  }

  // models/Presentation.js
  static async create(presentationData) {
    const { title, location, date, moreinfo, userId } = presentationData;
    
    // Gerar código único para a apresentação
    const uniqueCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    // Garantir que nenhum valor seja undefined
    const sanitizedTitle = title || '';
    const sanitizedLocation = location || '';
    const sanitizedDate = date || '';
    const sanitizedMoreinfo = moreinfo === undefined ? null : moreinfo;
    
    try {
      const [result] = await db.execute(
        'INSERT INTO presentations (title, location, date, moreinfo, user_id, access_code, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [sanitizedTitle, sanitizedLocation, sanitizedDate, sanitizedMoreinfo, userId, uniqueCode, 'scheduled']
      );
      
      return {
        id: result.insertId,
        title: sanitizedTitle,
        location: sanitizedLocation,
        date: sanitizedDate,
        moreinfo: sanitizedMoreinfo,
        user_id: userId,
        access_code: uniqueCode,
        status: 'scheduled'
      };
    } catch (dbError) {
      console.error('Erro no banco de dados:', dbError);
      throw new Error('Erro ao criar apresentação no banco de dados');
    }
  }
  
  static async update(id, presentationData) {
    const { title, location, date, moreinfo } = presentationData;
    
    await db.execute(
      'UPDATE presentations SET title = ?, location = ?, date = ?, moreinfo = ? WHERE id = ?',
      [title, location, date, moreinfo, id]
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