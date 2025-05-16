// controllers/audienceQuestionController.js
const db = require('../config/database');

exports.createAudienceQuestion = async (req, res) => {
  try {
    const { presentationId, content, audienceId } = req.body;
    
    // Verificar se a apresentação existe e está ativa
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE id = ? AND status = "active"',
      [presentationId]
    );
    
    if (presentations.length === 0) {
      return res.status(404).json({
        message: 'Apresentação não encontrada ou não está ativa'
      });
    }
    
    const [result] = await db.execute(
      'INSERT INTO audience_questions (presentation_id, content, audience_id) VALUES (?, ?, ?)',
      [presentationId, content, audienceId]
    );
    
    res.status(201).json({
      message: 'Pergunta enviada com sucesso',
      questionId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getAudienceQuestionsByPresentation = async (req, res) => {
  try {
    const accessCode = req.params.accessCode;
    
    const [questions] = await db.execute(
      'SELECT audience_questions.* FROM audience_questions INNER JOIN presentations ON audience_questions.presentation_id = presentations.id WHERE presentations.access_code = ? ORDER BY audience_questions.likes DESC, audience_questions.created_at DESC', 
      [accessCode]
    );
    
    res.status(200).json({
      questions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.likeAudienceQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    
    // Verificar se a pergunta existe
    const [questions] = await db.execute(
      'SELECT * FROM audience_questions WHERE id = ?',
      [questionId]
    );
    
    if (questions.length === 0) {
      return res.status(404).json({
        message: 'Pergunta não encontrada'
      });
    }
    
    // Incrementar o número de curtidas
    await db.execute(
      'UPDATE audience_questions SET likes = likes + 1 WHERE id = ?',
      [questionId]
    );
    
    res.status(200).json({
      message: 'Pergunta curtida com sucesso'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.markAsAnswered = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { presenterId } = req.body;
    
    // Verificar se a pergunta existe
    const [questions] = await db.execute(
      'SELECT aq.*, p.user_id FROM audience_questions aq JOIN presentations p ON aq.presentation_id = p.id WHERE aq.id = ?',
      [questionId]
    );
    
    if (questions.length === 0) {
      return res.status(404).json({
        message: 'Pergunta não encontrada'
      });
    }
    
    // Verificar se o usuário é o dono da apresentação
    if (questions[0].user_id != presenterId) {
      return res.status(403).json({
        message: 'Não autorizado a marcar esta pergunta como respondida'
      });
    }
    
    await db.execute(
      'UPDATE audience_questions SET is_answered = TRUE WHERE id = ?',
      [questionId]
    );
    
    res.status(200).json({
      message: 'Pergunta marcada como respondida'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};