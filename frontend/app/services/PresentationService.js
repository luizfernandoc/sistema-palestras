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