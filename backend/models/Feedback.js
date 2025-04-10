// models/Feedback.js
const db = require('../config/database');

class Feedback {
  static async create(feedbackData) {
    const { presentationId, audienceId, rating, comments } = feedbackData;
    
    const [result] = await db.execute(
      'INSERT INTO feedback (presentation_id, audience_id, rating, comments) VALUES (?, ?, ?, ?)',
      [presentationId, audienceId, rating, comments]
    );
    
    return {
      id: result.insertId,
      presentation_id: presentationId,
      audience_id: audienceId,
      rating,
      comments
    };
  }

  static async findByPresentation(presentationId) {
    const [feedbacks] = await db.execute(
      'SELECT * FROM feedback WHERE presentation_id = ?',
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
}

module.exports = Feedback;