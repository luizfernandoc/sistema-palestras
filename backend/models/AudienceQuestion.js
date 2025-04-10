// models/AudienceQuestion.js
const db = require('../config/database');

class AudienceQuestion {
  static async findById(id) {
    const [questions] = await db.execute(
      'SELECT * FROM audience_questions WHERE id = ?',
      [id]
    );
    return questions.length ? questions[0] : null;
  }

  static async findByPresentation(presentationId) {
    const [questions] = await db.execute(
      'SELECT * FROM audience_questions WHERE presentation_id = ? ORDER BY likes DESC, created_at DESC',
      [presentationId]
    );
    return questions;
  }

  static async create(questionData) {
    const { presentationId, content, audienceId } = questionData;
    
    const [result] = await db.execute(
      'INSERT INTO audience_questions (presentation_id, content, audience_id) VALUES (?, ?, ?)',
      [presentationId, content, audienceId]
    );
    
    return {
      id: result.insertId,
      presentation_id: presentationId,
      content,
      audience_id: audienceId,
      likes: 0,
      is_answered: false
    };
  }

  static async like(id) {
    await db.execute(
      'UPDATE audience_questions SET likes = likes + 1 WHERE id = ?',
      [id]
    );
    
    return this.findById(id);
  }

  static async markAsAnswered(id) {
    await db.execute(
      'UPDATE audience_questions SET is_answered = TRUE WHERE id = ?',
      [id]
    );
    
    return this.findById(id);
  }
}

module.exports = AudienceQuestion;