// frontend/services/PresentationService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native'; // Adicionar esta importação


const API_URL = Platform.OS === 'web'
  ? 'http://localhost:5000/api'  // Para desenvolvimento web
  : 'http://192.168.0.2:5000/api'; // Substitua pelo IP do seu computador

class PresentationService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL
    });

    // Interceptor para adicionar o token de autenticação em todas as requisições
    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getUserInfo() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await this.api.get('/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      throw this._handleError(error);
    }
  }

  async createPresentation(presentationData) {
    try {
      // Garantir que nenhum valor seja undefined
      const sanitizedData = {
        title: presentationData.title || '',
        location: presentationData.location || '',
        date: presentationData.date || '',
        moreinfo: presentationData.moreinfo || null // Usar null em vez de undefined
      };

      console.log('Enviando dados sanitizados:', sanitizedData);

      const response = await this.api.post('/presentations', sanitizedData);
      console.log('Resposta do servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao criar palestra:', error);
      if (error.response) {
        console.error('Resposta de erro do servidor:', error.response.data);
      }
      throw this._handleError(error);
    }
  }
  // Obter todas as apresentações do usuário
  async getUserPresentations() {
    try {
      const response = await this.api.get('/presentations');
      return response.data.presentations;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // luiz 18/05
  // Método para obter perguntas de feedback
  async getFeedbackQuestions(presentationId) {
    try {
      const response = await axios.get(`${API_URL}/feedback`);
      console.log('Perguntas de feedback obtidas:', response.data);
      return response.data.questions;
    } catch (error) {
      console.error('Erro ao obter perguntas de feedback:', error);
      throw error;
    }
  }

  // luiz 18/05
  // Método para enviar respostas de feedback
  async submitFeedback(presentationId, answers) {
    try {
      const response = await axios.post(`${API_URL}/feedback`, {
        presentationId,
        answers
      });
      console.log('Feedback enviado com sucesso:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      throw error;
    }
  }

  // luiz 18/05
  // Método para obter todos os feedbacks de uma apresentação
  async getAllFeedbacks(presentationId) {
    try {
      console.log(`Buscando feedbacks para apresentação ID: ${presentationId}`);
      const response = await this.api.get(`/presentations/${presentationId}/feedback`);
      console.log('Feedbacks obtidos:', response.data);
      return response.data.feedbacks || [];
    } catch (error) {
      console.error('Erro ao buscar todos feedbacks:', error);
      if (error.response && error.response.status === 404) {
        console.log('Nenhum feedback encontrado para esta apresentação');
        return []; // Retornar array vazio em vez de lançar erro
      }
      throw this._handleError(error);
    }
  }

  // Obter uma apresentação específica por ID
  async getPresentationById(id) {
    try {
      const response = await this.api.get(`/presentations/${id}`);
      return response.data.presentation;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Obter uma apresentação por código de acesso
  async getPresentationByCode(code) {
    try {
      const response = await this.api.get(`/presentations/code/${code}`);
      return response.data.presentation;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Atualizar uma apresentação
  async updatePresentation(id, presentationData) {
    try {
      const response = await this.api.put(`/presentations/${id}`, presentationData);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Excluir uma apresentação
  async deletePresentation(id) {
    try {
      const response = await this.api.delete(`/presentations/${id}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Iniciar uma apresentação
  async startPresentation(id) {
    try {
      const response = await this.api.post(`/presentations/${id}/start`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Encerrar uma apresentação
  async endPresentation(id) {
    try {
      const response = await this.api.post(`/presentations/${id}/end`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }
  // luiz 18/05
  // Metodo para buscar palestra pelo codigo de acesso
  async getPresentationByAccessCode(accessCode) {
    try {
      console.log(`Buscando apresentação com código: ${accessCode}`);
      const response = await this.api.get(`/presentations/access/${accessCode}`);
      console.log('Resposta da API:', response.data);
      return response.data.presentation;
    } catch (error) {
      console.error('Erro ao buscar apresentação por código de acesso:', error);
      throw this._handleError(error);
    }
  } 

  // Gerar QR Code para uma apresentação
  async generateQRCode(id) {
    try {
      const response = await this.api.get(`/presentations/${id}/qrcode`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Tratamento de erros
  _handleError(error) {
    if (error.response) {
      // O servidor respondeu com um status de erro
      return {
        status: error.response.status,
        message: error.response.data.message || 'Erro no servidor'
      };
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      return {
        status: 0,
        message: 'Sem resposta do servidor. Verifique sua conexão.'
      };
    } else {
      // Algo aconteceu na configuração da requisição
      return {
        status: 0,
        message: 'Erro ao processar a requisição: ' + error.message
      };
    }
  }
}

export default new PresentationService();