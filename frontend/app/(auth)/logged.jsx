import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { images } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { useState } from 'react'
import PresentationService from '../services/PresentationService'

const Logged = () => {
  const [userName, setUserName] = useState('');
  const [palestras, setPalestras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para decodificar base64 (para tokens JWT)
  const atob = (input) => {
    const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    // Remove caracteres que não são base64
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

    while (i < input.length) {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3);
      }
    }

    // Converte para UTF-8
    output = decodeURIComponent(escape(output));

    return output;
  };

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
    // Definir o nome do usuário diretamente com base nos logs
    // Ou, se preferir uma solução mais genérica:
    const setUserNameFromStorage = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          if (userData.user && userData.user.name) {
            setUserName(userData.user.name);
          }
        }
      } catch (error) {
        console.error('Erro ao obter nome do usuário:', error);
      }
    };

    // Carregar as palestras do usuário
    const loadPresentations = async () => {
      try {
        setLoading(true);
        const presentations = await PresentationService.getUserPresentations();
        setPalestras(presentations);
        setError(null);
      } catch (error) {
        console.error('Erro ao carregar palestras:', error);
        setError('Não foi possível carregar suas palestras. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    setUserNameFromStorage();
    loadPresentations();
  }, []);


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8E01" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View style={styles.viewstyle1}>
          <Image
            source={images.inova}
            resizeMode='contain'
            style={styles.inova}
          />

          <View style={styles.viewstyle2}>
            <Text style={styles.textstyle}>
              Seja Bem Vindo(a) {'\n'} {''}
              <Text style={styles.textstyle2}>{userName || 'Palestrante'}</Text>
              {' '}!
            </Text>
          </View>

          <Text style={styles.textstyle3}>
            Crie aqui sua Palestra ou escolha uma já criada!
          </Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.cardContainer}>
            {palestras.length > 0 ? (
              palestras.map((palestra) => (
                <TouchableOpacity
                  key={palestra.id}
                  style={styles.card}
                  onPress={async () => {
                    // Salvar o ID da palestra no AsyncStorage
                    await AsyncStorage.setItem('selectedPresentationId', palestra.id.toString());
                    // Navegar para a home
                    router.push('/(tabs)/home');
                  }}
                >
                  <Text style={styles.cardTitle}>{palestra.title}</Text>
                  <Text style={styles.cardDetails}>
                    {palestra.location && `Local: ${palestra.location}`}
                    {palestra.date && `\nData: ${formatDate(palestra.date)}`}
                    {'\nStatus: '}
                    <Text style={[
                      styles.statusText,
                      palestra.status === 'active' ? styles.activeStatus :
                        palestra.status === 'completed' ? styles.completedStatus :
                          styles.scheduledStatus
                    ]}>
                      {palestra.status === 'active' ? 'Ativa' :
                        palestra.status === 'completed' ? 'Concluída' :
                          'Agendada'}
                    </Text>
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Sem Palestras criadas</Text>
              </View>
            )}

            <CustomButton
              title="Criar Palestra"
              handlePress={() => router.push('/create')}
              containerStyles={styles.containerstyles2}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Logged

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#161622",
    height: "100%"
  },

  viewstyle1: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    minHeight: '85%',
    paddingHorizontal: 16
  },

  textstyle1: {
    color: "white",
    fontFamily: "Poppins-SemiBold",
    fontSize: 24,
    lineHeight: 32,
    marginTop: 40,
    fontWeight: 600
  },

  inova: {
    marginTop: 28,
    width: 180,
    height: 84
  },

  choice: {
    marginTop: 28,
    width: 350,
    height: 330
  },

  viewstyle2: {
    position: 'relative',
    marginTop: 20
  },

  textstyle2: {
    color: '#FF8E01'
  },

  textstyle: {
    fontSize: 30,
    lineHeight: 36,
    color: 'white',
    fontWeight: 700,
    textAlign: 'center'
  },

  textstyle3: {
    color: "#CDCDE0",
    marginTop: 28,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular'
  },

  containerstyles1: {
    width: '90%',
    marginTop: 32
  },

  containerstyles2: {
    width: '90%',
    marginTop: 20
  },

  cardContainer: {
    width: '100%',
    marginTop: 24,
    gap: 12,
    alignItems: 'center',
  },

  card: {
    width: '90%',
    backgroundColor: '#1E1E2D',
    padding: 16,
    borderRadius: 12,
    borderColor: '#333',
    borderWidth: 1,
  },

  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8
  },

  cardDetails: {
    color: '#CDCDE0',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20
  },

  statusText: {
    fontFamily: 'Poppins-SemiBold',
  },

  activeStatus: {
    color: '#4CAF50',
  },

  completedStatus: {
    color: '#2196F3',
  },

  scheduledStatus: {
    color: '#FF8E01',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: 'white',
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular'
  },

  errorText: {
    color: '#FF5252',
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular'
  }
})