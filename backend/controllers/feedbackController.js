// Alterei tudo luiz 18/05
const Feedback = require('../models/Feedback');
const db = require('../config/database');

// GET - retorna todas as perguntas de feedback
const getFeedbackQuestions = async (req, res) => {
  try {
    const questions = await Feedback.getQuestions();
    res.status(200).json({ questions });
  } catch (error) {
    console.error('Erro ao buscar perguntas de feedback:', error);
    res.status(500).json({ error: 'Erro ao buscar perguntas de feedback.' });
  }
};

// POST - salva as respostas de um aluno para uma palestra
const submitFeedback = async (req, res) => {
  const { presentationId, answers } = req.body;

  if (!presentationId || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Dados inválidos. Envie presentationId e array de answers.' });
  }

  try {
    // Inserir cada resposta individualmente usando o modelo
    const insertPromises = answers.map(async (rating, index) => {
      const questionId = index + 1; // Assumindo que os IDs das perguntas são sequenciais
      await Feedback.create({
        presentationId,
        questionId,
        rating
      });
    });

    await Promise.all(insertPromises);
    
    res.status(201).json({ message: 'Feedback enviado com sucesso.' });
  } catch (error) {
    console.error('Erro ao salvar feedback:', error);
    res.status(500).json({ error: 'Erro ao salvar feedback.' });
  }
};

module.exports = {
  getFeedbackQuestions,
  submitFeedback,
};