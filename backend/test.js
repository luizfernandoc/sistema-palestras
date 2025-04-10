const pool = require('./config/database');

async function listarRegistros() {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    console.log('Registros da tabela usuarios:');
    console.table(rows);
  } catch (err) {
    console.error('Erro ao consultar tabela:', err);
  } finally {
    pool.end();
  }
}

listarRegistros();