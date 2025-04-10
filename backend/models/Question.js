// models/Question.js
const db = require('../config/database');

class Question {
  static async findById(id) {
    const [questions] = await db.execute(
      'SELECT * FROM questions WHERE id = ?',
      [id]
    );
    
    if (questions.length === 0) return null;
    
    const question = questions[0];
    if (question.options) {
      question.options = JSON.parse(question.options);
    }
    
    return question;
  }

  static async findByPresentation(presentationId) {
    const [questions] = await db.execute(
      'SELECT * FROM questions WHERE presentation_id = ? ORDER BY scheduled_time',
      [presentationId]
    );
    
    // Converter opções de JSON para objeto
    questions.forEach(question => {
      if (question.options) {
        question.options = JSON.parse(question.options);
      }
    });
    
    return questions;
  }

  static async create(questionData) {
    const { presentationId, content, type, options, scheduledTime } = questionData;
    
    // Converter opções para JSON se for múltipla escolha
    let optionsJson = null;
    if (type === 'multiple_choice' && options) {
      optionsJson = JSON.stringify(options);
    }
    
    const [result] = await db.execute(
      'INSERT INTO questions (presentation_id, content, type, options, scheduled_time) VALUES (?, ?, ?, ?, ?)',
      [presentationId, content, type, optionsJson, scheduledTime]
    );
    
    return this.findById(result.insertId);
  }

  static async update(id, questionData) {
    const { content, type, options, scheduledTime } = questionData;
    
    // Converter opções para JSON se for múltipla escolha
    let optionsJson = null;
    if (type === 'multiple_choice' && options) {
      optionsJson = JSON.stringify(options);
    }
    
    await db.execute(
      'UPDATE questions SET content = ?, type = ?, options = ?, scheduled_time = ? WHERE id = ?',
      [content, type, optionsJson, scheduledTime, id]
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    await db.execute(
      'DELETE FROM questions WHERE id = ?',
      [id]
    );
    return true;
  }

  static async activate(id, presentationId) {
    // Desativar todas as perguntas ativas da apresentação
    await db.execute(
      'UPDATE questions SET is_active = FALSE WHERE presentation_id = ?',
      [presentationId]
    );
    
    // Ativar a pergunta selecionada
    await db.execute(
      'UPDATE questions SET is_active = TRUE WHERE id = ?',
      [id]
    );
    
    return this.findById(id);
  }

  static async deactivate(id) {
    await db.execute(
      'UPDATE questions SET is_active = FALSE WHERE id = ?',
      [id]
    );
    
    return this.findById(id);
  }

  static async getAnswers(questionId) {
    const [answers] = await db.execute(
      'SELECT * FROM answers WHERE question_id = ?',
      [questionId]
    );
    
    return answers;
  }
}

module.exports = Question;