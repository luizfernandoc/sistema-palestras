import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { images } from '../../../constants'
import PresentationService from '../../services/PresentationService'

import { router } from 'expo-router'
import CustomButton from '../../../components/CustomButton'

const StudentHome = () => {
  const [presentationId, setPresentationId] = useState(null)
  const [presentation, setPresentation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? 'Data não disponível' : date.toLocaleDateString('pt-BR')
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? 'Horário não disponível' : date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    const loadPresentationId = async () => {
      try {
        const id = await AsyncStorage.getItem('selectedPresentationId')
        if (id) {
          setPresentationId(id)
          fetchPresentationData(id)
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error('Erro ao carregar ID da palestra:', err)
        setError('Erro ao carregar ID da palestra')
        setLoading(false)
      }
    }

    loadPresentationId()
  }, [])

  const fetchPresentationData = async (id) => {
    try {
      setLoading(true)
      const data = await PresentationService.getPresentationById(id)
      setPresentation(data)
      setError(null)
    } catch (err) {
      console.error('Erro ao buscar dados da palestra:', err)
      setError('Não foi possível carregar os dados da palestra. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <Image
          source={images.inova}
          style={styles.inova}
          resizeMode='contain'
        />

        <Text style={styles.textstyle1}>Informações da Palestra</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FFA001" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : presentation ? (
          <View style={styles.presentationContainer}>
            <Text style={styles.presentationTitle}>{presentation.title}</Text>

            {presentation.location && (
              <Text style={styles.presentationDetails}>Local: {presentation.location}</Text>
            )}

            <Text style={styles.presentationDetails}>Data: {formatDate(presentation.date)}</Text>
            <Text style={styles.presentationDetails}>Horário: {formatTime(presentation.date)}</Text>

            {presentation.moreinfo && (
              <Text style={styles.presentationDetails}>Descrição: {presentation.moreinfo}</Text>
            )}

            <Text style={styles.presentationStatus}>
              Status: <Text style={[
                styles.statusText,
                presentation.status === 'active' ? styles.activeStatus :
                  presentation.status === 'completed' ? styles.completedStatus :
                    styles.scheduledStatus
              ]}>
                {presentation.status === 'active' ? 'Ativa' :
                  presentation.status === 'completed' ? 'Concluída' : 'Agendada'}
              </Text>
            </Text>

          </View>
        ) : (
          <Text style={styles.presentationText}>Nenhuma palestra selecionada</Text>
        )}

        <CustomButton
          title='Voltar'
          handlePress={() => router.push('/student')}
          containerStyles={[styles.button2, styles.backButton]}
          textStyles={styles.textBackButton}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default StudentHome

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#161622",
    height: "100%"
  },

  inova: {
    width: 380, // Tamanho da logo
    height: 300,
    marginBottom: -90,
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
  
  button2: {
    marginTop: 24
  },

  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFA001',
  },

  textBackButton: {
    color: '#FFA001',
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

  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FF5252',
    fontFamily: 'Poppins-Regular'
  },

  presentationContainer: {
    marginTop: 20,
    padding: 16,
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

  presentationStatus: {
    fontSize: 14,
    color: '#CDCDE0',
    fontFamily: 'Poppins-Regular',
    marginTop: 4
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
})
