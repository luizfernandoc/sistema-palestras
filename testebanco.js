const db = require('./backend/config/database');

(async () => {
  try {
    const [rows] = await db.execute('SELECT 1');
    console.log('Conexão com o banco de dados bem-sucedida!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
  }
})();