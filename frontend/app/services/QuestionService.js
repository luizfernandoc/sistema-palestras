// c:\Users\luizf\Desktop\Nova_pasta_(6)\sistema-palestras\frontend\app\services\QuestionService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'web'
  ? 'http://localhost:5000/api'
  : 'http://192.168.0.2:5000/api'; // Substitua pelo IP do seu computador

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
      const response = await this.api.get(`/questions/access/${accessCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw this._handleError(error);
    }
  }

  // Enviar uma nova pergunta
  async sendQuestion(questionData) {
    try {
      console.log('Enviando pergunta:', questionData);
      const response = await this.api.post('/questions/student', {
        access_code: questionData.access_code,
        text: questionData.text,
        student_name: questionData.student_name || 'Anônimo'
      });
      console.log('Resposta do servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar pergunta:', error.response?.data || error.message);
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