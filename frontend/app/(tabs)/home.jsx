import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams } from 'expo-router'

import { images } from '../../constants'
import { router } from 'expo-router'
import PresentationService from '../services/PresentationService'
import CustomButton from '../../components/CustomButton'

const Home = () => {
  const params = useLocalSearchParams();
  const [presentationId, setPresentationId] = useState(null);
  const [presentation, setPresentation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para formatar datas
  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      // Tenta diferentes formatos de data
      const date = new Date(dateString);

      // Verifica se a data é válida
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('pt-BR');
      }

      return 'Data não disponível';
    } catch (error) {
      console.error('Erro ao formatar data:', error, dateString);
      return 'Data não disponível';
    }
  };

  useEffect(() => {
    // Carregar o ID da palestra do AsyncStorage
    const loadPresentationId = async () => {
      try {
        const id = await AsyncStorage.getItem('selectedPresentationId');
        if (id) {
          setPresentationId(id);
          console.log('ID da palestra carregado:', id);
          // Carregar os dados da palestra
          fetchPresentationData(id);
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
  }, [params.updated, params.timestamp]); // Recarregar quando os parâmetros mudarem

  const fetchPresentationData = async (id) => {
    try {
      setLoading(true);

      // Buscar dados da palestra usando o serviço
      const data = await PresentationService.getPresentationById(id);
      setPresentation(data);
      console.log(presentation)
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar dados da palestra:', error);
      setError('Não foi possível carregar os dados da palestra. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // TIMER
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    // Aqui você pode salvar o tempo ou realizar outra ação
    console.log('Palestra finalizada - tempo total:', seconds, 'segundos');
  };

  const handleTimerPress = async () => {
    try {
      if (presentation?.status === 'active') {
        await PresentationService.endPresentation(presentationId); // Muda para "completed"
        stopTimer(); // Aqui ainda pode salvar o tempo
      } else {
        await PresentationService.startPresentation(presentationId); // Muda para "active"
        startTimer();
      }

      fetchPresentationData(presentationId); // Atualiza os dados no front

    } catch (error) {
      console.error('Erro ao atualizar status da apresentação:', error);
      alert('Erro ao atualizar status da palestra.');
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);

      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }

      return 'Horário não disponível';
    } catch (error) {
      console.error('Erro ao formatar hora:', error, dateString);
      return 'Horário não disponível';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <Image
          source={images.inova}
          style={styles.inova}
          resizeMode='contain'
        />

        <Text style={styles.textstyle1}>
          Home
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FFA001" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : presentation ? (
          <View style={styles.presentationContainer}>
            <Text style={styles.presentationTitle}>
              {presentation.title}
            </Text>

            {presentation.location && (
              <Text style={styles.presentationDetails}>
                Local: {presentation.location}
              </Text>
            )}

            <Text style={styles.presentationDetails}>
              Data: {formatDate(presentation.date)}
            </Text>

            <Text style={styles.presentationDetails}>
              Horário: {formatTime(presentation.date)}
            </Text>

            {presentation.moreinfo && (
              <Text style={styles.presentationDetails}>
                Descrição: {presentation.moreinfo}
              </Text>
            )}

            <Text style={styles.presentationStatus}>
              Status: <Text style={[
                styles.statusText,
                presentation.status === 'active' ? styles.activeStatus :
                  presentation.status === 'completed' ? styles.completedStatus :
                    styles.scheduledStatus
              ]}>
                {presentation.status === 'active' ? 'Ativa' :
                  presentation.status === 'completed' ? 'Concluída' :
                    'Agendada'}
              </Text>
            </Text>
            {presentation.description && (
              <Text style={styles.presentationDescription}>{presentation.description}</Text>
            )}
          </View>
        ) : (
          <View>
            <Text style={styles.presentationText}>
              Nenhuma palestra selecionada
            </Text>
          </View>
        )}

        {presentation && (
          <View style={styles.accessCodeContainer}>
            {presentation.access_code && (
              <Text style={styles.accessCodeText}>
                Código de Acesso: <Text style={styles.accessCode}>{presentation.access_code}</Text>
              </Text>
            )}
          </View>
        )}

        {presentation?.status !== 'completed' && (
          <CustomButton
            title={presentation?.status === 'active' ? 'Finalizar Palestra' : 'Iniciar Palestra'}
            handlePress={handleTimerPress}
            containerStyles={styles.button}
          />
        )}

        <CustomButton
          title='Voltar'
          handlePress={() => router.push('/logged')}
          containerStyles={[styles.button2, styles.backButton]}
          textStyles={styles.textBackButton}
        />

        {/*
        {isRunning && (
          <Text style={styles.timerText}>
            Tempo: {formatTime(seconds)}
          </Text>
        )}
        */}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#161622",
    height: "100%"
  },

  inova: {
    width: 380, // Tamanho da logo
    height: 300,
    marginBottom: -100,
    marginTop: -70
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

  presentationText: {
    marginTop: 12,
    fontSize: 16,
    color: '#CDCDE0',
    fontFamily: 'Poppins-Regular'
  },

  loader: {
    marginTop: 30
  },

  button: {
    marginTop: 24 // alterar
  },

  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FF5252',
    fontFamily: 'Poppins-Regular'
  },

  presentationContainer: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#1E1E2D',
    borderRadius: 12,
    borderColor: '#333',
    borderWidth: 1,
  },

  presentationTitle: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12
  },

  presentationDetails: {
    fontSize: 14,
    color: '#CDCDE0',
    fontFamily: 'Poppins-Regular',
    marginBottom: 4
  },

  accessCodeContainer: {
    marginTop: 26,
    alignItems: 'center'
  },

  accessCodeText: {
    color: '#CDCDE0',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold'
  },

  accessCode: {
    color: '#FF8E01',
  },

  presentationStatus: {
    fontSize: 14,
    color: '#CDCDE0',
    fontFamily: 'Poppins-Regular',
    marginBottom: 12
  },

  statusText: {
    fontFamily: 'Poppins-SemiBold',
  },

  activeStatus: {
    color: '#4CAF50',
  },

  button2: {
    marginTop: 20
  },

  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFA001',
  },

  textBackButton: {
    color: '#FFA001',
  },

  completedStatus: {
    color: '#2196F3',
  },

  scheduledStatus: {
    color: '#FF8E01',
  },

  presentationDescription: {
    fontSize: 14,
    color: '#CDCDE0',
    fontFamily: 'Poppins-Regular',
    marginTop: 12,
    lineHeight: 20
  },

  timerText: {
    color: 'white',
    fontSize: 20,
    marginTop: 20,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center'
  }
})
