// c:\Users\luizf\Desktop\Nova_pasta_(6)\sistema-palestras\frontend\app\services\authService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Definir a URL da API baseada na plataforma
const API_URL = Platform.OS === 'web'
  ? 'http://localhost:5000/api'
  : 'http://192.168.136.1:5000/api'; // Substitua pelo IP do seu computador na rede local

const authService = {
  async register(userData) {
    try {
      console.log('Enviando dados de registro:', userData);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('Dados da resposta:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado no registro:', error);
      throw error;
    }
  },
  
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const data = response.data;
      
      // Armazenar token e dados do usuário no AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  async loginStudent(credentials) {
    try {
      console.log('Tentando login com:', credentials);
      
      // Verificar se o código de acesso foi fornecido
      if (!credentials.accessCode) {
        throw new Error('Código de acesso não fornecido');
      }
      
      // Usar axios diretamente
      const response = await axios.get(`${API_URL}/presentations/access/${credentials.accessCode}`, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta da API:', response.data);
      
      if (response.data && response.data.presentation) {
        // Criar um objeto de usuário com dados válidos
        const userData = {
          name: credentials.name || 'Anônimo',
          accessCode: credentials.accessCode,
          presentationId: response.data.presentation.id,
          role: 'student'
        };
        
        console.log('Dados do usuário a serem salvos:', userData);
        
        // Salvar apenas se userData for válido
        if (userData && Object.keys(userData).length > 0) {
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          
          // Salvar também o ID da apresentação para uso em outras telas
          await AsyncStorage.setItem('selectedPresentationId', 
            response.data.presentation.id.toString());
        }
        
        return {
          success: true,
          user: userData,
          presentation: response.data.presentation
        };
      } else {
        throw new Error('Código de palestra inválido');
      }
    } catch (error) {
      console.error('Erro detalhado no login do estudante:', error);
      
      // Verificar se é um erro de rede
      if (error.message === 'Network Error') {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      }
      
      // Verificar se é um erro de timeout
      if (error.code === 'ECONNABORTED') {
        throw new Error('Tempo de conexão esgotado. Tente novamente mais tarde.');
      }
      
      // Verificar se é um erro de resposta do servidor
      if (error.response) {
        console.log('Status do erro:', error.response.status);
        console.log('Dados do erro:', error.response.data);
        
        if (error.response.status === 404) {
          throw new Error('Código de palestra não encontrado');
        }
        
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      // Erro genérico
      throw new Error('Erro ao acessar a palestra. Tente novamente.');
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