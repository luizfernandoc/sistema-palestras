// c:\Users\luizf\Desktop\Nova_pasta_(6)\sistema-palestras\frontend\app\[student]\[accessCode]\questions.jsx
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
  
  // Obter o código de acesso da URL
  const [accessCode, setAccessCode] = useState('');
  
  useEffect(() => {
    // Extrair o código de acesso da URL
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      // Encontrar o índice após "student" na URL
      const studentIndex = pathParts.findIndex(part => part === 'student');
      if (studentIndex !== -1 && pathParts.length > studentIndex + 1) {
        const code = pathParts[studentIndex + 1];
        console.log('Código de acesso extraído da URL:', code);
        setAccessCode(code);
      } else {
        console.error('Não foi possível extrair o código de acesso da URL');
      }
    }
  }, []);

  const loadData = async () => {
    if (!accessCode) return;
    
    setLoading(true);
    try {
      // Buscar detalhes da apresentação pelo código de acesso
      const pres = await PresentationService.getPresentationByAccessCode(accessCode);
      setPresentation(pres);
      
      // Salvar o ID da apresentação no AsyncStorage
      await AsyncStorage.setItem('selectedPresentationId', pres.id.toString());

      // Buscar perguntas pelo código de acesso
      const q = await QuestionService.getQuestionsByAccessCode(accessCode);
      setQuestions(q.questions || []);
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
      setPresentation(null);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessCode) {
      loadData();
    }
  }, [accessCode]);

  const handleSendQuestion = async () => {
    if (!questionText.trim()) {
      Alert.alert('Atenção', 'Digite uma pergunta antes de enviar');
      console.log('Erro ao enviar a pergunta, o campo está vazio.')
      return;
    }

    try {
      setSending(true);
      await QuestionService.sendQuestion({
        access_code: accessCode,
        text: questionText.trim(),
        student_name: null, // ou enviar o nome do aluno aqui
      });

      setQuestionText('');

      // Atualiza lista de perguntas depois de enviar
      const updated = await QuestionService.getQuestionsByAccessCode(accessCode);
      setQuestions(updated.questions || []);
      
      Alert.alert('Sucesso', 'Sua pergunta foi enviada com sucesso!');
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
  // Estilos permanecem os mesmos
  container: {
    backgroundColor: "#161622",
    height: "100%"
  },

  scrollview: {
    paddingHorizontal: 16,
    marginVertical: 24,
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