import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { images } from '../../constants'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { router } from 'expo-router'
import PresentationService from '../services/PresentationService'

const Edit = () => {
  const [presentationId, setPresentationId] = useState(null);
  const [presentation, setPresentation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const loadPresentationId = async () => {
      try {
        const id = await AsyncStorage.getItem('selectedPresentationId');
        if (id) {
          setPresentationId(id);
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
      const data = await PresentationService.getPresentationById(id);
      setPresentation(data);
      setTitle(data.title || '');
      setDescription(data.moreinfo || '');
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
        moreinfo: description,
        date,
        location
      };

      await PresentationService.updatePresentation(presentationId, updatedPresentation);

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
        <Text style={styles.textstyle1}>Editar Palestra</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FFA001" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.formContainer}>
            <FormField
              title="Título"
              value={title}
              placeholder="Título da palestra"
              handleChangeText={setTitle}
              otherStyles={styles.formField1}
            />

            <FormField
              title="Descrição"
              value={description}
              placeholder="Descrição da palestra"
              handleChangeText={setDescription}
              otherStyles={styles.formField}
              multiline
              numberOfLines={4}
            />

            <FormField
              title="Data e Hora"
              value={date}
              placeholder="YYYY-MM-DD HH:MM"
              handleChangeText={setDate}
              otherStyles={styles.formField}
            />

            <FormField
              title="Local"
              value={location}
              placeholder="Local da palestra"
              handleChangeText={setLocation}
              otherStyles={styles.formField}
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
  );
};

export default Edit;

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

  formField1: {
    marginTop: 8
  },
  
  formField: {
    marginTop: 18
  },

  button: {
    marginTop: 18
  },

  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFA001'
  },

  cancelButtonText: {
    color: '#FFA001'
  }
});
