// controllers/presentationController.js
const db = require('../config/database');
const crypto = require('crypto');
const QRCode = require('qrcode');

exports.createPresentation = async (req, res) => {
  try {
    const { title, description, date, time, location, theme } = req.body;
    const userId = req.userData.userId;
    
    // Gerar código único para a apresentação
    const uniqueCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    const [result] = await db.execute(
      'INSERT INTO presentations (title, description, date, time, location, theme, user_id, access_code, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, date, time, location, theme, userId, uniqueCode, 'scheduled']
    );
    
    res.status(201).json({
      message: 'Apresentação criada com sucesso',
      presentationId: result.insertId,
      accessCode: uniqueCode
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getPresentations = async (req, res) => {
  try {
    const userId = req.userData.userId;
    
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE user_id = ? ORDER BY date DESC, time DESC',
      [userId]
    );
    
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
    
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE id = ?',
      [presentationId]
    );
    
    if (presentations.length === 0) {
      return res.status(404).json({
        message: 'Apresentação não encontrada'
      });
    }
    
    res.status(200).json({
      presentation: presentations[0]
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
    
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE access_code = ?',
      [accessCode]
    );
    
    if (presentations.length === 0) {
      return res.status(404).json({
        message: 'Apresentação não encontrada'
      });
    }
    
    // Verificar se a apresentação está ativa
    if (presentations[0].status !== 'active') {
      return res.status(403).json({
        message: 'Esta apresentação não está ativa no momento'
      });
    }
    
    res.status(200).json({
      presentation: presentations[0]
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
    const { title, description, date, time, location, theme } = req.body;
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
    
    await db.execute(
      'UPDATE presentations SET title = ?, description = ?, date = ?, time = ?, location = ?, theme = ? WHERE id = ?',
      [title, description, date, time, location, theme, presentationId]
    );
    
    res.status(200).json({
      message: 'Apresentação atualizada com sucesso'
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
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE id = ? AND user_id = ?',
      [presentationId, userId]
    );
    
    if (presentations.length === 0) {
      return res.status(404).json({
        message: 'Apresentação não encontrada ou não autorizada'
      });
    }
    
    await db.execute(
      'DELETE FROM presentations WHERE id = ?',
      [presentationId]
    );
    
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
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE id = ? AND user_id = ?',
      [presentationId, userId]
    );
    
    if (presentations.length === 0) {
      return res.status(404).json({
        message: 'Apresentação não encontrada ou não autorizada'
      });
    }
    
    await db.execute(
      'UPDATE presentations SET status = ?, start_time = NOW() WHERE id = ?',
      ['active', presentationId]
    );
    
    res.status(200).json({
      message: 'Apresentação iniciada com sucesso'
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
    const [presentations] = await db.execute(
      'SELECT * FROM presentations WHERE id = ? AND user_id = ?',
      [presentationId, userId]
    );
    
    if (presentations.length === 0) {
      return res.status(404).json({
        message: 'Apresentação não encontrada ou não autorizada'
      });
    }
    
    await db.execute(
      'UPDATE presentations SET status = ?, end_time = NOW() WHERE id = ?',
      ['completed', presentationId]
    );
    
    res.status(200).json({
      message: 'Apresentação encerrada com sucesso'
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
    
    // Buscar o código de acesso da apresentação
    const [presentations] = await db.execute(
      'SELECT access_code FROM presentations WHERE id = ?',
      [presentationId]
    );
    
    if (presentations.length === 0) {
      return res.status(404).json({
        message: 'Apresentação não encontrada'
      });
    }
    
    const accessCode = presentations[0].access_code;
    
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