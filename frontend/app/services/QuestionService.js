import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'web'
  ? 'http://localhost:5000/api'
  : 'http://192.168.136.1:5000/api'; // Substitua pelo IP correto da sua máquina

class QuestionService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL
    });

    // Interceptor para token JWT (se necessário)
    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Obter todas as perguntas de uma palestra por código de acesso
  async getQuestionsByAccessCode(accessCode) {
    try {
      const response = await this.api.get(`/questions/${accessCode}`);
      return response.data.questions || []; // Ajuste conforme o retorno do backend
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Criar uma nova pergunta
  async createQuestion(questionData) {
    try {
      const sanitizedData = {
        accessCode: questionData.accessCode || '',
        text: questionData.text || '',
        studentName: questionData.studentName || 'Anônimo'
      };

      const response = await this.api.post('/questions', sanitizedData);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Tratamento de erros
  _handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || 'Erro no servidor'
      };
    } else if (error.request) {
      return {
        status: 0,
        message: 'Sem resposta do servidor. Verifique sua conexão.'
      };
    } else {
      return {
        status: 0,
        message: 'Erro ao processar a requisição: ' + error.message
      };
    }
  }
}

export default new QuestionService();