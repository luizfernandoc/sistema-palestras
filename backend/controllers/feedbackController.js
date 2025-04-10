// controllers/feedbackController.js
const db = require('../config/database');

exports.createFeedback = async (req, res) => {
  try {
    const { presentationId, audienceId, rating, comments } = req.body;
    
    // Verificar se a apresentação existe
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE id = ?',
      [presentationId]
    );
    
    if (presentations.length === 0) {
      return res.status(404).json({
        message: 'Apresentação não encontrada'
      });
    }
    
    const [result] = await db.execute(
      'INSERT INTO feedback (presentation_id, audience_id, rating, comments) VALUES (?, ?, ?, ?)',
      [presentationId, audienceId, rating, comments]
    );
    
    res.status(201).json({
      message: 'Feedback enviado com sucesso',
      feedbackId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getFeedbackByPresentation = async (req, res) => {
  try {
    const presentationId = req.params.id;
    
    // Verificar se a apresentação existe
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE id = ?',
      [presentationId]
    );
    
    if (presentations.length === 0) {
      return res.status(404).json({
        message: 'Apresentação não encontrada'
      });
    }
    
    // Obter todos os feedbacks da apresentação
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
    
    res.status(200).json({
      feedbacks,
      averageRating,
      totalFeedbacks: feedbacks.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};