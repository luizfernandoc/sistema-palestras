// routes/audienceQuestions.js
const express = require('express');
const router = express.Router();
const audienceQuestionController = require('../controllers/audienceQuestionController');

// Temporário: controlador ainda não implementado
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Rota de perguntas da audiência funcionando' });
});

router.post('/create', audienceQuestionController.createAudienceQuestion);
router.put('/like/:id', audienceQuestionController.likeAudienceQuestion);
router.get('/questions/:accessCode', audienceQuestionController.getAudienceQuestionsByPresentation);

module.exports = router;