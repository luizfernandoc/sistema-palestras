'use client';

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PresentationService from '../services/PresentationService';
import QuestionService from '../services/QuestionService';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [presentation, setPresentation] = useState(null);

  const loadPresentationAndQuestions = async () => {
    setLoading(true);
    try {
      const storedId = await AsyncStorage.getItem('selectedPresentationId');
      if (storedId) {
        const pres = await PresentationService.getPresentationById(storedId);
        setPresentation(pres);

        const q = await QuestionService.getQuestionsByAccessCode(pres.access_code);
        setQuestions(q.questions || []);
      } else {
        setQuestions([]);
        setPresentation(null);
      }
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
      setQuestions([]);
      setPresentation(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresentationAndQuestions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview} refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadPresentationAndQuestions} />
        }
      >
        <Text style={styles.title}>Perguntas Recebidas</Text>

        {presentation && (
          <View style={styles.presentationContainer}>
            <Text style={styles.presentationTitle}>{presentation.title}</Text>
            <Text style={styles.presentationDetails}>Código: {presentation.access_code}</Text>
          </View>
        )}

        {loading && <ActivityIndicator size="large" color="#FFA001" style={{ marginTop: 20 }} />}

        {questions.length === 0 && !loading && (
          <Text style={styles.emptyText}>Nenhuma pergunta recebida ainda.</Text>
        )}

        {questions.map((item) => (
          <View key={item.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{item.text}</Text>
            <Text style={styles.questionAuthor}>
              Enviado por: {item.student_name || 'Anônimo'}
            </Text>
          </View>
        ))}
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
    marginTop: 20, // essa porra
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
});
