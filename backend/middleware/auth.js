// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Verificar se o cabeçalho de autorização existe
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('Cabeçalho de autorização ausente');
      return res.status(401).json({ message: 'Autenticação falhou: token ausente' });
    }
    
    // Extrair o token
    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('Token não encontrado no cabeçalho');
      return res.status(401).json({ message: 'Autenticação falhou: formato de token inválido' });
    }
    
    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    
    // Adicionar dados do usuário à requisição
    req.userData = { userId: decoded.userId };
    
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(401).json({ message: 'Autenticação falhou: token inválido' });
  }
};