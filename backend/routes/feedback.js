const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Rota para pegar as perguntas
router.get('/', feedbackController.getFeedbackQuestions);

// Rota para enviar respostas
router.post('/', feedbackController.submitFeedback);

module.exports = router;