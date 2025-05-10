
import { View, Text, ScrollView, StyleSheet, Image, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { images } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import PresentationService from '../services/PresentationService'

const Edit = () => {
  const [presentationId, setPresentationId] = useState(null);
  const [presentation, setPresentation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Campos do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  
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
  }, []);

  const fetchPresentationData = async (id) => {
    try {
      setLoading(true);
      
      // Buscar dados da palestra usando o serviço
      const data = await PresentationService.getPresentationById(id);
      setPresentation(data);
      
      // Preencher os campos do formulário
      setTitle(data.title || '');
      setDescription(data.moreinfo || ''); // Usando moreinfo como descrição
      setDate(data.date || '');
      setLocation(data.location || '');
      
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar dados da palestra:', error);
      setError('Não foi possível carregar os dados da palestra. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
  try {
    setSaving(true);
    
    const updatedPresentation = {
      title,
      moreinfo: description, // Usando description como moreinfo
      date,
      location
    };
    
    // Atualizar a palestra usando o serviço
    await PresentationService.updatePresentation(presentationId, updatedPresentation);
    
    // Navegar de volta para a home com parâmetro de atualização
    router.push({
      pathname: '/(tabs)/home',
      params: { updated: 'true', timestamp: Date.now() }
    });
  } catch (error) {
    console.error('Erro ao salvar palestra:', error);
    setError('Não foi possível salvar as alterações. Tente novamente.');
  } finally {
    setSaving(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <Text style={styles.textstyle1}>
          Editar Palestra
        </Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#FFA001" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Título da palestra"
              placeholderTextColor="#CDCDE0"
            />
            
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Descrição da palestra"
              placeholderTextColor="#CDCDE0"
              multiline
              numberOfLines={4}
            />
            
            <Text style={styles.label}>Data e Hora</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD HH:MM"
              placeholderTextColor="#CDCDE0"
            />
            
            <Text style={styles.label}>Local</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Local da palestra"
              placeholderTextColor="#CDCDE0"
            />
            
            {saving ? (
              <ActivityIndicator size="large" color="#FFA001" style={styles.savingLoader} />
            ) : (
              <>
                <CustomButton
                  title="Salvar Alterações"
                  handlePress={handleSave}
                  containerStyles={styles.button}
                />
                
                <CustomButton
                  title="Cancelar"
                  handlePress={() => router.push('/(tabs)/home')}
                  containerStyles={[styles.button, styles.cancelButton]}
                  textStyles={styles.cancelButtonText}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Edit

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#161622",
    height: "100%"
  },

  inova: {
    width: 145,
    height: 44
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
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20
  },

  loader: {
    marginTop: 30
  },
  
  savingLoader: {
    marginTop: 20
  },
  
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FF5252',
    fontFamily: 'Poppins-Regular'
  },
  
  formContainer: {
    marginTop: 10
  },
  
  label: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-Medium',
    marginBottom: 8
  },
  
  input: {
    backgroundColor: '#1E1E2D',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginBottom: 16,
    borderColor: '#333',
    borderWidth: 1,
  },
  
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  
  button: {
    marginTop: 16
  },
  
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFA001'
  },
  
  cancelButtonText: {
    color: '#FFA001'
  }
})