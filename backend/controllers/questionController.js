// controllers/questionController.js
const db = require('../config/database');

exports.createQuestion = async (req, res) => {
  try {
    const { presentationId, content, type, options, scheduledTime } = req.body;
    const userId = req.userData.userId;
    
    // Verificar se a apresentação pertence ao usuário
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE id = ? AND user_id = ?',
      [presentationId, userId]
    );
    
    if (presentations.length === 0) {
      return res.status(404).json({
        message: 'Apresentação não encontrada ou não autorizada'
      });
    }
    
    // Converter opções para JSON se for múltipla escolha
    let optionsJson = null;
    if (type === 'multiple_choice' && options) {
      optionsJson = JSON.stringify(options);
    }
    
    const [result] = await db.execute(
      'INSERT INTO questions (presentation_id, content, type, options, scheduled_time) VALUES (?, ?, ?, ?, ?)',
      [presentationId, content, type, optionsJson, scheduledTime]
    );
    
    res.status(201).json({
      message: 'Pergunta criada com sucesso',
      questionId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getQuestionsByPresentation = async (req, res) => {
  try {
    const presentationId = req.params.id;
    
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

exports.getQuestionById = async (req, res) => {
  try {
    const questionId = req.params.id;
    
    const [questions] = await db.execute(
      'SELECT * FROM questions WHERE id = ?',
      [questionId]
    );
    
    if (questions.length === 0) {
      return res.status(404).json({
        message: 'Pergunta não encontrada'
      });
    }
    
    // Converter opções de JSON para objeto
    const question = questions[0];
    if (question.options) {
      question.options = JSON.parse(question.options);
    }
    
    res.status(200).json({
      question
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { content, type, options, scheduledTime } = req.body;
    const userId = req.userData.userId;
    
    // Verificar se a pergunta pertence a uma apresentação do usuário
    const [questions] = await db.execute(
      'SELECT q.* FROM questions q JOIN presentations p ON q.presentation_id = p.id WHERE q.id = ? AND p.user_id = ?',
      [questionId, userId]
    );
    
    if (questions.length === 0) {
      return res.status(404).json({
        message: 'Pergunta não encontrada ou não autorizada'
      });
    }
    
    // Converter opções para JSON se for múltipla escolha
    let optionsJson = null;
    if (type === 'multiple_choice' && options) {
      optionsJson = JSON.stringify(options);
    }
    
    await db.execute(
      'UPDATE questions SET content = ?, type = ?, options = ?, scheduled_time = ? WHERE id = ?',
      [content, type, optionsJson, scheduledTime, questionId]
    );
    
    res.status(200).json({
      message: 'Pergunta atualizada com sucesso'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.userData.userId;
    
    // Verificar se a pergunta pertence a uma apresentação do usuário
    const [questions] = await db.execute(
      'SELECT q.* FROM questions q JOIN presentations p ON q.presentation_id = p.id WHERE q.id = ? AND p.user_id = ?',
      [questionId, userId]
    );
    
    if (questions.length === 0) {
      return res.status(404).json({
        message: 'Pergunta não encontrada ou não autorizada'
      });
    }
    
    await db.execute(
      'DELETE FROM questions WHERE id = ?',
      [questionId]
    );
    
    res.status(200).json({
      message: 'Pergunta excluída com sucesso'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.activateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.userData.userId;
    
    // Verificar se a pergunta pertence a uma apresentação do usuário
    const [questions] = await db.execute(
      'SELECT q.*, p.id as presentation_id FROM questions q JOIN presentations p ON q.presentation_id = p.id WHERE q.id = ? AND p.user_id = ?',
      [questionId, userId]
    );
    
    if (questions.length === 0) {
      return res.status(404).json({
        message: 'Pergunta não encontrada ou não autorizada'
      });
    }
    
    const presentationId = questions[0].presentation_id;
    
    // Desativar todas as perguntas ativas da apresentação
    await db.execute(
      'UPDATE questions SET is_active = FALSE WHERE presentation_id = ?',
      [presentationId]
    );
    
    // Ativar a pergunta selecionada
    await db.execute(
      'UPDATE questions SET is_active = TRUE WHERE id = ?',
      [questionId]
    );
    
    res.status(200).json({
      message: 'Pergunta ativada com sucesso'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.deactivateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.userData.userId;
    
    // Verificar se a pergunta pertence a uma apresentação do usuário
    const [questions] = await db.execute(
      'SELECT q.* FROM questions q JOIN presentations p ON q.presentation_id = p.id WHERE q.id = ? AND p.user_id = ?',
      [questionId, userId]
    );
    
    if (questions.length === 0) {
      return res.status(404).json({
        message: 'Pergunta não encontrada ou não autorizada'
      });
    }
    
    // Desativar a pergunta
    await db.execute(
      'UPDATE questions SET is_active = FALSE WHERE id = ?',
      [questionId]
    );
    
    res.status(200).json({
      message: 'Pergunta desativada com sucesso'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getQuestionAnswers = async (req, res) => {
  try {
    const questionId = req.params.id;
    
    const [answers] = await db.execute(
      'SELECT * FROM answers WHERE question_id = ?',
      [questionId]
    );
    
    res.status(200).json({
      answers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.createStudentQuestion = async (req, res) => {
  try {
    const { access_code, text, student_name } = req.body;
    
    // Verificar se a apresentação existe
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE access_code = ?',
      [access_code]
    );
    
    if (presentations.length === 0) {
      return res.status(404).json({
        message: 'Apresentação não encontrada'
      });
    }
    
    const presentationId = presentations[0].id;
    
    // Inserir a pergunta do estudante
    const [result] = await db.execute(
      'INSERT INTO student_questions (presentation_id, text, student_name, created_at) VALUES (?, ?, ?, NOW())',
      [presentationId, text, student_name]
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

exports.getQuestionsByAccessCode = async (req, res) => {
  try {
    const accessCode = req.params.code;
    
    // Verificar se a apresentação existe
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE access_code = ?',
      [accessCode]
    );
    
    if (presentations.length === 0) {
      return res.status(404).json({
        message: 'Apresentação não encontrada'
      });
    }
    
    const presentationId = presentations[0].id;
    
    // Buscar as perguntas dos estudantes
    const [questions] = await db.execute(
      'SELECT * FROM student_questions WHERE presentation_id = ? ORDER BY created_at DESC',
      [presentationId]
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