// c:\Users\luizf\Desktop\Nova_pasta_(6)\sistema-palestras\frontend\app\(tabs)\questions.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PresentationService from '../services/PresentationService';
import QuestionService from '../services/QuestionService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [presentation, setPresentation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadPresentationAndQuestions = async () => {
    setLoading(true);
    try {
      const storedId = await AsyncStorage.getItem('selectedPresentationId');
      console.log('ID da apresentação armazenado:', storedId);
      
      if (storedId) {
        const pres = await PresentationService.getPresentationById(storedId);
        console.log('Apresentação carregada:', pres);
        setPresentation(pres);

        // Buscar perguntas pelo código de acesso
        const response = await QuestionService.getQuestionsByAccessCode(pres.access_code);
        console.log('Perguntas recebidas:', response);
        
        if (response && response.questions) {
          setQuestions(response.questions);
        } else {
          console.warn('Resposta não contém perguntas:', response);
          setQuestions([]);
        }
      } else {
        console.warn('Nenhum ID de apresentação encontrado no AsyncStorage');
        setQuestions([]);
        setPresentation(null);
      }
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
      setQuestions([]);
      setPresentation(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPresentationAndQuestions();
  };

  useEffect(() => {
    loadPresentationAndQuestions();
    
    // Configurar um intervalo para atualizar as perguntas a cada 30 segundos
    const interval = setInterval(() => {
      loadPresentationAndQuestions();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []); // Removi a dependência de presentation para evitar loops

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollview} 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Perguntas Recebidas</Text>

        {loading && !refreshing && (
          <ActivityIndicator size="large" color="#FFA001" style={{ marginTop: 20 }} />
        )}

        {questions.length === 0 && !loading && (
          <Text style={styles.emptyText}>Nenhuma pergunta recebida ainda.</Text>
        )}

        {questions.length > 0 && (
          <View style={styles.questionsContainer}>
            {questions.map((item) => (
              <View key={item.id} style={styles.questionContainer}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionText}>{item.text}</Text>
                  <View style={styles.likeDisplay}>
                    <FontAwesome name="thumbs-up" size={16} color="#FFA001" />
                    <Text style={styles.likeCount}>{item.likes || 0}</Text>
                  </View>
                </View>
                <Text style={styles.questionAuthor}>
                  Enviado por: {item.student_name || 'Anônimo'}
                </Text>
                <Text style={styles.questionTime}>
                  {new Date(item.created_at).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#161622",
    height: "100%"
  },

  scrollview: {
    paddingHorizontal: 8,
    marginVertical: 12,
  },

  title: {
    marginTop: 20,
    fontSize: 22,
    lineHeight: 28,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },

  presentationContainer: {
    backgroundColor: '#1E1E2D',
    padding: 12,
    borderRadius: 12,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 20,
  },

  presentationTitle: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },

  presentationDetails: {
    fontSize: 14,
    color: '#CDCDE0',
    fontFamily: 'Poppins-Regular',
  },
  
  questionsContainer: {
    marginTop: 10,
  },

  questionContainer: {
    backgroundColor: '#1E1E2D',
    padding: 12,
    borderRadius: 10,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 12,
  },

  questionText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },

  questionAuthor: {
    fontSize: 12,
    color: '#CDCDE0',
    fontFamily: 'Poppins-Regular',
    marginTop: 6,
  },

  emptyText: {
    fontSize: 16,
    color: '#CDCDE0',
    fontFamily: 'Poppins-Regular',
    marginTop: 20,
    textAlign: 'center',
  },

  questionTime: {
    fontSize: 10,
    color: '#CDCDE0',
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  likeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A3A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  likeCount: {
    color: '#FFA001',
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
});