// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importação das rotas
const authRoutes = require('./routes/auth');
const presentationRoutes = require('./routes/presentations');
const questionRoutes = require('./routes/questions');
const audienceQuestionRoutes = require('./routes/audienceQuestions');
const feedbackRoutes = require('./routes/feedback');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure o CORS para permitir requisições do seu frontend
app.use(cors({
  origin: 'http://localhost:8081', // URL do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/presentations', presentationRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/audience-questions', audienceQuestionRoutes);
app.use('/api/feedback', feedbackRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.send('API do Sistema de Feedback e Interação para Apresentações');
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro no servidor!');
});

module.exports = app;