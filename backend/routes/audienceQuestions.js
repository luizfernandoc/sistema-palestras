// routes/audienceQuestions.js
const express = require('express');
const router = express.Router();

// Temporário: controlador ainda não implementado
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Rota de perguntas da audiência funcionando' });
});

module.exports = router;