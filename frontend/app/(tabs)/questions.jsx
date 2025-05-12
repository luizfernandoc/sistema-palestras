import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { images } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { fetchApi } from '../config/api'

const Questions = () => {
  const [presentationId, setPresentationId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Carregar o ID da palestra do AsyncStorage
    const loadPresentationId = async () => {
      try {
        const id = await AsyncStorage.getItem('selectedPresentationId');
        if (id) {
          setPresentationId(id);
          console.log('ID da palestra carregado:', id);
          // Carregar as perguntas da palestra
          fetchQuestions(id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao carregar ID da palestra:', error);
        setError('Erro ao carregar ID da palestra');
        setLoading(false);
      }
    };
    
    loadPresentationId();
  }, []);

  const fetchQuestions = async (id) => {
    try {
      setLoading(true);
      
      // Tente buscar da API real
      try {
        const data = await fetchApi(`/presentations/${id}/questions`);
        setQuestions(data);
      } catch (apiError) {
        console.log('Usando dados mock devido a erro na API:', apiError);
        
        // Fallback para dados mock em caso de erro
        const mockQuestions = [
          { id: '1', text: 'Qual é o objetivo principal desta palestra?', author: 'Maria Silva', timestamp: '2023-05-15T14:30:00' },
          { id: '2', text: 'Poderia explicar mais sobre o segundo tópico?', author: 'João Santos', timestamp: '2023-05-15T14:35:00' },
          { id: '3', text: 'Haverá material complementar disponível após a palestra?', author: 'Ana Oliveira', timestamp: '2023-05-15T14:40:00' }
        ];
        
        setQuestions(mockQuestions);
      }
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
      setError('Erro ao carregar perguntas');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = ({ item }) => {
    const date = new Date(item.timestamp);
    const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{item.text}</Text>
        <View style={styles.questionMeta}>
          <Text style={styles.questionAuthor}>{item.author}</Text>
          <Text style={styles.questionTime}>{formattedTime}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview}>

        <Text style={styles.textstyle1}>
          Perguntas
        </Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#FFA001" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : questions.length > 0 ? (
          <FlatList
            data={questions}
            renderItem={renderQuestion}
            keyExtractor={item => item.id}
            style={styles.questionsList}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noQuestionsText}>
            Nenhuma pergunta disponível para esta palestra.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Questions

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#161622",
    height: "100%"
  },

  scrollview: {
    paddingHorizontal: 16,
    marginVertical: 24,
  },

  textstyle1: {
    marginTop: 20,
    fontSize: 24,
    lineHeight: 32,
    color: 'white',
    fontFamily: 'Poppins-SemiBold'
  },
})