import { Platform } from 'react-native';

// Configuração da URL base da API
export const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api'  // Para desenvolvimento web
  : 'http://192.168.0.2:5000/api'; // Substitua pelo IP do seu computador

// Função auxiliar para fazer requisições à API
export const fetchApi = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro na API (${endpoint}):`, error);
    throw error;
  }
};