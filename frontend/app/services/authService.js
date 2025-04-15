// c:\Users\luiz.moura\Desktop\Nova_pasta\Nova_pasta\sistema-palestras\frontend\app\services\authService.js

// Remova temporariamente esta importação
// import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api';

// Armazenamento temporário em memória
let tokenStorage = null;
let userStorage = null;

const authService = {
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar usuário');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Credenciais inválidas');
      }
      
      // Armazenar token e dados do usuário em memória
      tokenStorage = data.token;
      userStorage = data.user;
      
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  async logout() {
    tokenStorage = null;
    userStorage = null;
  },
  
  async isAuthenticated() {
    return !!tokenStorage;
  },
  
  async getUser() {
    return userStorage;
  },
  
  async getToken() {
    return tokenStorage;
  }
};

export default authService;