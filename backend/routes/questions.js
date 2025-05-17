
// routes/questions.js
const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/auth');

// Rotas existentes
router.post('/', authMiddleware, questionController.createQuestion);
router.get('/presentation/:id', questionController.getQuestionsByPresentation);
router.get('/:id', questionController.getQuestionById);
router.put('/:id', authMiddleware, questionController.updateQuestion);
router.delete('/:id', authMiddleware, questionController.deleteQuestion);
router.post('/:id/activate', authMiddleware, questionController.activateQuestion);
router.post('/:id/deactivate', authMiddleware, questionController.deactivateQuestion);
router.get('/:id/answers', questionController.getQuestionAnswers);

// Novas rotas para estudantes
router.post('/student', questionController.createStudentQuestion);
router.get('/access/:code', questionController.getQuestionsByAccessCode);

module.exports = router;