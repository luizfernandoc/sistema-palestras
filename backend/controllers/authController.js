// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verificar se o usuário já existe
    const existingUser = await User.findByEmail(email);
    
    if (existingUser) {
      return res.status(409).json({
        message: 'Email já cadastrado'
      });
    }
    
    // Criar usuário
    const user = await User.create({ name, email, password });
    
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      userId: user.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.registerAudience = async (req, res) => {
  try {
    const accessCode = req.params.accessCode;
    const { name } = req.body;
     
    // Criar usuário
    const user = await User.createAudience({ name, accessCode });

    // Gerar token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      userId: user.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuário
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        message: 'Autenticação falhou'
      });
    }
    
    // Verificar senha
    const isPasswordValid = await User.verifyPassword(user, password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Autenticação falhou'
      });
    }
    
    // Gerar token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(200).json({
      message: 'Autenticação bem-sucedida',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
};