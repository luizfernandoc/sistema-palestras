// server.js
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Adicione esta rota ao seu arquivo app.js ou em uma rota específica
app.get('/api/test-db', async (req, res) => {
    try {
      const db = require('./config/database');
      const [result] = await db.query('SELECT 1 as test');
      res.status(200).json({ 
        message: 'Conexão com o banco de dados bem-sucedida', 
        result: result 
      });
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
      res.status(500).json({ 
        message: 'Erro ao conectar ao banco de dados', 
        error: error.message 
      });
    }
  });