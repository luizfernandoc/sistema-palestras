// controllers/presentationController.js
const Presentation = require('../models/Presentation');
//add luiz 18/05
const Feedback = require('../models/Feedback');

const db = require('../config/database');

// controllers/presentationController.js
exports.createPresentation = async (req, res) => {
  try {
    const { title, location, date, moreinfo } = req.body;
    
    // Verificar se req.userData existe e contém userId
    if (!req.userData || !req.userData.userId) {
      console.error('Dados do usuário não encontrados no token');
      return res.status(401).json({
        message: 'Autenticação falhou: dados do usuário não encontrados'
      });
    }
    
    const userId = req.userData.userId;
    console.log('Criando apresentação para o usuário:', userId);
    console.log('Dados recebidos:', { title, location, date, moreinfo });
    
    const presentation = await Presentation.create({
      title,
      location,
      date,
      moreinfo,
      userId
    });
    
    res.status(201).json({
      message: 'Apresentação criada com sucesso',
      presentationId: presentation.id,
      accessCode: presentation.access_code
    });
  } catch (error) {
    console.error('Erro ao criar apresentação:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getPresentations = async (req, res) => {
  try {
    const userId = req.userData.userId;
    
    const presentations = await Presentation.findByUser(userId);
    
    res.status(200).json({
      presentations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getPresentationById = async (req, res) => {
  try {
    const presentationId = req.params.id;
    
    const presentation = await Presentation.findById(presentationId);
    
    if (!presentation) {
      return res.status(404).json({
        message: 'Apresentação não encontrada'
      });
    }
    
    res.status(200).json({
      presentation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getPresentationByCode = async (req, res) => {
  try {
    const accessCode = req.params.code;
    
    const presentation = await Presentation.findByCode(accessCode);
    
    if (!presentation) {
      return res.status(404).json({
        message: 'Apresentação não encontrada'
      });
    }
    
    // Verificar se a apresentação está ativa
    if (presentation.status !== 'active') {
      return res.status(403).json({
        message: 'Esta apresentação não está ativa no momento'
      });
    }
    
    res.status(200).json({
      presentation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.updatePresentation = async (req, res) => {
  try {
    const presentationId = req.params.id;
    const { title, location, date, moreinfo } = req.body;
    const userId = req.userData.userId;
    
    // Verificar se a apresentação pertence ao usuário
    const presentation = await Presentation.findById(presentationId);
    
    if (!presentation || presentation.user_id !== userId) {
      return res.status(404).json({
        message: 'Apresentação não encontrada ou não autorizada'
      });
    }
    
    const updatedPresentation = await Presentation.update(presentationId, {
      title,
      location,
      date,
      moreinfo
    });
    
    res.status(200).json({
      message: 'Apresentação atualizada com sucesso',
      presentation: updatedPresentation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.deletePresentation = async (req, res) => {
  try {
    const presentationId = req.params.id;
    const userId = req.userData.userId;
    
    // Verificar se a apresentação pertence ao usuário
    const presentation = await Presentation.findById(presentationId);
    
    if (!presentation || presentation.user_id !== userId) {
      return res.status(404).json({
        message: 'Apresentação não encontrada ou não autorizada'
      });
    }
    
    await Presentation.delete(presentationId);
    
    res.status(200).json({
      message: 'Apresentação excluída com sucesso'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.startPresentation = async (req, res) => {
  try {
    const presentationId = req.params.id;
    const userId = req.userData.userId;
    
    // Verificar se a apresentação pertence ao usuário
    const presentation = await Presentation.findById(presentationId);
    
    if (!presentation || presentation.user_id !== userId) {
      return res.status(404).json({
        message: 'Apresentação não encontrada ou não autorizada'
      });
    }
    
    const updatedPresentation = await Presentation.start(presentationId);
    
    res.status(200).json({
      message: 'Apresentação iniciada com sucesso',
      presentation: updatedPresentation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.endPresentation = async (req, res) => {
  try {
    const presentationId = req.params.id;
    const userId = req.userData.userId;
    
    // Verificar se a apresentação pertence ao usuário
    const presentation = await Presentation.findById(presentationId);
    
    if (!presentation || presentation.user_id !== userId) {
      return res.status(404).json({
        message: 'Apresentação não encontrada ou não autorizada'
      });
    }
    
    const updatedPresentation = await Presentation.end(presentationId);
    
    res.status(200).json({
      message: 'Apresentação encerrada com sucesso',
      presentation: updatedPresentation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.generateQRCode = async (req, res) => {
  try {
    const presentationId = req.params.id;
    const QRCode = require('qrcode');
    
    // Buscar o código de acesso da apresentação
    const presentation = await Presentation.findById(presentationId);
    
    if (!presentation) {
      return res.status(404).json({
        message: 'Apresentação não encontrada'
      });
    }
    
    const accessCode = presentation.access_code;
    
    // URL para acesso à apresentação
    const accessUrl = `${process.env.FRONTEND_URL}/audience/join/${accessCode}`;
    
    // Gerar QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(accessUrl);
    
    res.status(200).json({
      qrCode: qrCodeDataUrl,
      accessCode,
      accessUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getPresentationByAccessCode = async (req, res) => {
  try {
    const accessCode = req.params.code;
    
    console.log('Buscando apresentação com código:', accessCode);
    
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE access_code = ?',
      [accessCode]
    );
    
    console.log('Apresentações encontradas:', presentations);
    
    if (presentations.length === 0) {
      return res.status(404).json({
        message: 'Apresentação não encontrada'
      });
    }
    
    res.status(200).json({
      presentation: presentations[0]
    });
  } catch (error) {
    console.error('Erro ao buscar apresentação por código de acesso:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

// luiz 18/05
// Método para obter todos os feedbacks de uma apresentação
const getPresentationFeedback = async (req, res) => {
  const { id } = req.params;

  try {
    const feedbackData = await Feedback.findByPresentation(id);
    
    // Organizar os feedbacks por pergunta
    const questions = await Feedback.getQuestions();
    
    // Estruturar os dados para o frontend
    const feedbacks = [];
    
    // Agrupar feedbacks por questionId
    const feedbacksByQuestion = {};
    feedbackData.feedbacks.forEach(feedback => {
      if (!feedbacksByQuestion[feedback.question_id]) {
        feedbacksByQuestion[feedback.question_id] = [];
      }
      feedbacksByQuestion[feedback.question_id].push(feedback.rating);
    });
    
    // Reorganizar os dados para o formato esperado pelo frontend
    const uniqueSubmissions = new Set();
    feedbackData.feedbacks.forEach(feedback => {
      uniqueSubmissions.add(feedback.created_at.toISOString());
    });
    
    // Converter para array de arrays (cada array interno representa um conjunto de respostas)
    Array.from(uniqueSubmissions).forEach(submissionTime => {
      const submission = [];
      questions.forEach(question => {
        const ratings = feedbacksByQuestion[question.id] || [];
        // Pegar a primeira avaliação para esta pergunta neste conjunto de respostas
        submission.push(ratings.length > 0 ? ratings.shift() : null);
      });
      feedbacks.push(submission);
    });
    
    res.status(200).json({
      feedbacks,
      averageRating: feedbackData.averageRating,
      totalFeedbacks: feedbackData.totalFeedbacks
    });
  } catch (error) {
    console.error('Erro ao buscar feedbacks da apresentação:', error);
    res.status(500).json({ error: 'Erro ao buscar feedbacks da apresentação.' });
  }
};

//add luiz 18/05
exports.getPresentationFeedback = getPresentationFeedback;