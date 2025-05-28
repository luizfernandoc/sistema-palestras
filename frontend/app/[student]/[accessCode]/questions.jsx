'use client';

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PresentationService from '../../services/PresentationService';
import QuestionService from '../../services/QuestionService';
import FormField from '../../../components/FormField';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../components/CustomButton';

//add luiz 18/05
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';


export default function Questions() {

  const [presentation, setPresentation] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Obter o código de acesso da URL luiz 18/05
  const { accessCode } = useLocalSearchParams();
  const [userQuestions, setUserQuestions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('Anônimo');



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

  // LUIZ 18/05
  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        console.log('Dados do usuário carregados:', userData);
        setUserName(userData.name || 'Anônimo');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const [likedQuestions, setLikedQuestions] = useState([]);

  const loadLikedQuestions = async () => {
    try {
      const likedQuestionsString = await AsyncStorage.getItem('likedQuestions');
      console.log('Dados brutos de perguntas curtidas:', likedQuestionsString);

      if (likedQuestionsString) {
        const likedQuestionsArray = JSON.parse(likedQuestionsString);
        setLikedQuestions(likedQuestionsArray);
        console.log('Perguntas curtidas carregadas:', likedQuestionsArray);
      } else {
        // Inicializar com array vazio se não houver dados
        setLikedQuestions([]);
        console.log('Nenhuma pergunta curtida encontrada, inicializando com array vazio');
      }
    } catch (error) {
      console.error('Erro ao carregar perguntas curtidas:', error);
      // Inicializar com array vazio em caso de erro
      setLikedQuestions([]);
    }
  };

  useEffect(() => {
    if (accessCode) {
      loadData();
      loadUserData(); // Adicionando chamada para carregar dados do usuário
      loadLikedQuestions(); // Adicione esta linha
    }
  }, [accessCode]);

  // luiz 18/05
  // useEffect para atualizar as perguntas periodicamente
  useEffect(() => {
    const initializeData = async () => {
      let code = accessCode;

      // Se o accessCode não estiver disponível via useLocalSearchParams, tente obtê-lo do AsyncStorage
      if (!code) {
        try {
          const userDataString = await AsyncStorage.getItem('user');
          if (userDataString) {
            const userData = JSON.parse(userDataString);
            code = userData.accessCode;
            console.log('Código de acesso obtido do AsyncStorage:', code);
          }
        } catch (error) {
          console.error('Erro ao obter código de acesso do AsyncStorage:', error);
        }
      }

      if (code) {
        console.log('Inicializando dados com código de acesso:', code);
        // Carregar dados inicialmente
        await loadDataWithCode(code);
        await loadUserData();

        // Configurar intervalo para atualizar perguntas a cada 10 segundos
        const interval = setInterval(async () => {
          console.log('Atualizando perguntas para o código:', code);

          // Apenas atualizar as perguntas, não a apresentação completa
          try {
            const q = await QuestionService.getQuestionsByAccessCode(code);
            console.log('Perguntas atualizadas:', q.questions?.length || 0);
            setQuestions(q.questions || []);
          } catch (error) {
            console.error('Erro ao atualizar perguntas:', error);
          }
        }, 10000); // 10 segundos

        return () => {
          console.log('Limpando intervalo de atualização');
          clearInterval(interval);
        };
      }
    };

    initializeData();
  }, [accessCode]);

  // luiz 18/05
  //  carregar dados com um código específico
  const loadDataWithCode = async (code) => {
    if (!code) {
      console.error('Código de acesso não fornecido');
      return;
    }

    setLoading(true);
    try {
      console.log('Tentando carregar apresentação com código:', code);

      // Buscar detalhes da apresentação pelo código de acesso
      const pres = await PresentationService.getPresentationByAccessCode(code);
      console.log('Apresentação carregada:', pres);

      if (!pres) {
        console.error('Apresentação não encontrada para o código:', code);
        setPresentation(null);
        setQuestions([]);
        return;
      }

      setPresentation(pres);

      // Salvar o ID da apresentação no AsyncStorage
      await AsyncStorage.setItem('selectedPresentationId', pres.id.toString());

      // Buscar perguntas pelo código de acesso
      console.log('Buscando perguntas para o código:', code);
      const q = await QuestionService.getQuestionsByAccessCode(code);
      console.log('Perguntas recebidas:', q);

      setQuestions(q.questions || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setPresentation(null);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // luiz 18/05
  const handleSendQuestion = async () => {
    if (!questionText.trim()) {
      Alert.alert('Atenção', 'Digite uma pergunta antes de enviar');
      console.log('Erro ao enviar a pergunta, o campo está vazio.')
      return;
    }

    try {
      setSending(true);

      // Verificar se temos o nome do usuário, se não, tentar carregar novamente
      if (!userName || userName === 'Anônimo') {
        await loadUserData();
      }

      // Obter o código de acesso do AsyncStorage se não estiver disponível via useLocalSearchParams
      let code = accessCode;
      if (!code) {
        try {
          const userDataString = await AsyncStorage.getItem('user');
          if (userDataString) {
            const userData = JSON.parse(userDataString);
            code = userData.accessCode;
          }
        } catch (error) {
          console.error('Erro ao obter código de acesso do AsyncStorage:', error);
        }
      }

      if (!code) {
        Alert.alert('Erro', 'Código de acesso não encontrado');
        return;
      }

      console.log('Enviando pergunta com nome:', userName, 'e código:', code);

      await QuestionService.sendQuestion({
        access_code: code,
        text: questionText.trim(),
        student_name: userName
      });

      setQuestionText('');

      // Atualiza lista de perguntas depois de enviar
      const updated = await QuestionService.getQuestionsByAccessCode(code);
      console.log('Perguntas atualizadas após envio:', updated);
      setQuestions(updated.questions || []);

      Alert.alert('Sucesso', 'Sua pergunta foi enviada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar a pergunta');
      console.error('Erro ao enviar pergunta:', error);
    } finally {
      setSending(false);
    }
  };


  const handleLikeQuestion = async (questionId) => {
    // Verificar se a pergunta já foi curtida - convertendo para string para garantir comparação correta
    const questionIdStr = questionId.toString();
    
    // Verificar se a pergunta já está na lista de curtidas
    if (likedQuestions.some(id => id.toString() === questionIdStr)) {
      Alert.alert('Aviso', 'Você já curtiu esta pergunta');
      return;
    }
  
    try {
      await QuestionService.likeQuestion(questionId);
  
      // Adiciona a pergunta à lista de perguntas curtidas
      const updatedLikedQuestions = [...likedQuestions, questionIdStr];
      setLikedQuestions(updatedLikedQuestions);
  
      // Salva no AsyncStorage
      await AsyncStorage.setItem('likedQuestions', JSON.stringify(updatedLikedQuestions));
      console.log('Pergunta adicionada às curtidas:', questionIdStr);
      console.log('Lista atualizada de curtidas:', updatedLikedQuestions);
  
      // Atualizar a lista de perguntas após dar like
      let code = accessCode;
      if (!code) {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          code = userData.accessCode;
        }
      }
  
      if (code) {
        const updated = await QuestionService.getQuestionsByAccessCode(code);
        setQuestions(updated.questions || []);
      }
    } catch (error) {
      console.error('Erro ao dar like na pergunta:', error);
      Alert.alert('Erro', 'Não foi possível dar like na pergunta');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Faça sua pergunta</Text>

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
            <View style={styles.questionHeader}>
              <Text style={styles.questionText}>{item.text}</Text>
              <TouchableOpacity
                style={[
                  styles.likeButton,
                  likedQuestions.some(id => id.toString() === item.id.toString()) ? styles.likedButton : {}
                ]}
                onPress={() => handleLikeQuestion(item.id)}
                disabled={likedQuestions.some(id => id.toString() === item.id.toString())}
              >
                <FontAwesome
                  name="thumbs-up"
                  size={16}
                  color={likedQuestions.some(id => id.toString() === item.id.toString()) ? "#FFD700" : "#FFA001"}
                />
                <Text style={styles.likeCount}>{item.likes || 0}</Text>
              </TouchableOpacity>
            </View>
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
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  likedButton: {
    backgroundColor: '#3A3A4A',
    borderColor: '#FFD700',
    borderWidth: 1,
    opacity: 0.7,
  },
  likeButton: {
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