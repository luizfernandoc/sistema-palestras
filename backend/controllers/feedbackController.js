const db = require('../config/database'); // ajuste conforme o caminho do seu config

// GET - retorna todas as perguntas de feedback
const getFeedbackQuestions = async (req, res) => {
  try {
    const [questions] = await db.query('SELECT id, question FROM feedback_questions');
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
    const values = answers.map((answer, index) => [presentationId, index + 1, answer]); // index + 1 = id da pergunta
    await db.query('INSERT INTO feedback_responses (presentation_id, question_id, rating) VALUES ?', [values]);
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
