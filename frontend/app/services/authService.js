// c:\Users\luizf\Desktop\Nova_pasta_(2)\sistema-palestras\frontend\app\services\authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native'; // Adicionar esta importação


const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api'  // Para desenvolvimento web
  : 'http://192.168.136.1:5000/api'; // Substitua pelo IP do seu computador

const authService = {
  async register(userData) {
    try {
      console.log('Enviando dados de registro:', userData);
      console.log('URL completa:', `${API_URL}/auth/register`);
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      console.log('Status da resposta:', response.status);
      const data = await response.json();
      console.log('Dados da resposta:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar usuário');
      }
      
      return data;
    } catch (error) {
      console.error('Erro detalhado no registro:', error);
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
      
      // Armazenar token e dados do usuário no AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  async logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },
  
  async isAuthenticated() {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },
  
  async getUser() {
    const userJson = await AsyncStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },
  
  async getToken() {
    return await AsyncStorage.getItem('token');
  }
};

export default authService;