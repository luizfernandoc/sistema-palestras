// c:\Users\luizf\Desktop\Nova_pasta_(7)\sistema-palestras\backend\models\Feedback.js

const db = require('../config/database');

class Feedback {
  static async create(feedbackData) {
    const { presentationId, questionId, rating } = feedbackData;
    
    const [result] = await db.execute(
      'INSERT INTO feedback_answers (presentation_id, question_id, rating, created_at) VALUES (?, ?, ?, NOW())',
      [presentationId, questionId, rating]
    );
    
    return {
      id: result.insertId,
      presentation_id: presentationId,
      question_id: questionId,
      rating,
      created_at: new Date()
    };
  }

  static async findByPresentation(presentationId) {
    const [feedbacks] = await db.execute(
      'SELECT * FROM feedback_answers WHERE presentation_id = ?',
      [presentationId]
    );
    
    // Calcular média das avaliações
    let averageRating = 0;
    if (feedbacks.length > 0) {
      const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
      averageRating = totalRating / feedbacks.length;
    }
    
    return {
      feedbacks,
      averageRating,
      totalFeedbacks: feedbacks.length
    };
  }

  static async getQuestions() {
    const [questions] = await db.execute('SELECT id, question FROM feedback_questions');
    return questions;
  }
}

module.exports = Feedback;