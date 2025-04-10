// routes/presentations.js
const express = require('express');
const router = express.Router();
const presentationController = require('../controllers/presentationController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, presentationController.createPresentation);
router.get('/', authMiddleware, presentationController.getPresentations);
router.get('/:id', presentationController.getPresentationById);
router.get('/:code/access', presentationController.getPresentationByCode);
router.put('/:id', authMiddleware, presentationController.updatePresentation);
router.delete('/:id', authMiddleware, presentationController.deletePresentation);
router.post('/:id/start', authMiddleware, presentationController.startPresentation);
router.post('/:id/end', authMiddleware, presentationController.endPresentation);
router.get('/:id/qrcode', presentationController.generateQRCode);

module.exports = router;