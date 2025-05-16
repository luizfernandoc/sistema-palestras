'use client';

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PresentationService from '../../services/PresentationService';
import QuestionService from '../../services/QuestionService';
import FormField from '../../../components/FormField';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '../../../components/CustomButton';

export default function Questions() {
  const [presentation, setPresentation] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // Buscar o selectedPresentationId direto do AsyncStorage
      const storedId = await AsyncStorage.getItem('selectedPresentationId');
      if (storedId) {
        const pres = await PresentationService.getPresentationById(storedId);
        setPresentation(pres);

        const q = await QuestionService.getQuestionsByAccessCode(pres.access_code);
        setQuestions(q.questions || []);
      } else {
        setPresentation(null);
        setQuestions([]);
      }
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
      setPresentation(null);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendQuestion = async () => {
    if (!questionText.trim()) {
      Alert.alert('Atenção', 'Digite uma pergunta antes de enviar');
      console.log('Erro ao enviar a pergunta, o campo está vazio.')
      return;
    }

    try {
      setSending(true);
      await QuestionService.sendQuestion({
        access_code: presentation.access_code,
        text: questionText.trim(),
        student_name: null, // ou enviar o nome do aluno aqui
      });

      setQuestionText('');

      // Atualiza lista de perguntas depois de enviar
      const updated = await QuestionService.getQuestionsByAccessCode(presentation.access_code);
      setQuestions(updated.questions || []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar a pergunta');
      console.error('Erro ao enviar pergunta:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Faça sua pergunta</Text>

        {presentation && (
          <View style={styles.presentationContainer}>
            <Text style={styles.presentationTitle}>{presentation.title}</Text>
            <Text style={styles.presentationDetails}>Código: {presentation.access_code}</Text>
          </View>
        )}

        <FormField
          value={questionText}
          onChangeText={setQuestionText}
          placeholder="Digite sua pergunta aqui..."
          otherStyles={styles.input}
        />

        <CustomButton
          title={sending ? 'Enviando...' : 'Enviar Pergunta'}
          handlePress={handleSendQuestion}
          isLoading={sending}
          containerStyles={styles.button}
        />


        <Text style={[styles.title, { marginTop: 30 }]}>Perguntas Enviadas</Text>

        {questions.length === 0 && !loading && (
          <Text style={styles.emptyText}>Nenhuma pergunta enviada ainda.</Text>
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
    paddingHorizontal: 16,
    marginVertical: 24,
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

  input: {
    marginTop: 4,
    marginBottom: 4
  },

  button: {
    marginTop: 16,
    backgroundColor: '#FFA001',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
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
