// frontend/app/(tabs)/create.jsx
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Redirect, router } from 'expo-router';
import PresentationService from '../services/PresentationService'; // Caminho corrigido

import { images } from '../../constants'

const Create = () => {
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    location: '',
    date: '',
    moreinfo: ''
  })

  const validateForm = () => {
    if (!form.title.trim()) {
      Alert.alert('Erro', 'O título da palestra é obrigatório');
      return false;
    }
    if (!form.location.trim()) {
      Alert.alert('Erro', 'O local da palestra é obrigatório');
      return false;
    }
    if (!form.date.trim()) {
      Alert.alert('Erro', 'A data e hora da palestra são obrigatórias');
      return false;
    }
    return true;
  }

  const submit = async () => {
    if (!validateForm()) return;

    try {
      setUploading(true);

      // Garantir que os dados estejam no formato esperado pelo backend
      const presentationData = {
        title: form.title.trim(),
        location: form.location.trim(),
        date: form.date.trim(),
        moreinfo: form.moreinfo.trim()
      };

      console.log('Enviando dados formatados:', presentationData);

      const response = await PresentationService.createPresentation(presentationData);

      Alert.alert(
        'Sucesso',
        `Palestra criada com sucesso!\nCódigo de acesso: ${response.accessCode}`,
        [
          {
            text: 'OK',
            onPress: () => router.push('/presentations')
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao criar palestra:', error);
      Alert.alert('Erro', error.message || 'Não foi possível criar a palestra. Tente novamente.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <Image
          source={images.inova}
          resizeMode='contain'
          style={styles.inova}
        />

        <Text style={styles.textstyle1}>
          Criar Palestra
        </Text>

        <FormField
          title="Tema/Título da Palestra"
          value={form.title}
          placeholder="Informe o tema da palestra..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles={styles.formfield1}
        />

        <FormField
          title="Local da Palestra"
          value={form.location}
          placeholder="Informe o local da palestra..."
          handleChangeText={(e) => setForm({ ...form, location: e })}
          otherStyles={styles.formfield2}
        />

        <FormField
          title="Data/Hora da Palestra"
          value={form.date}
          placeholder="Informe a data e hora..."
          handleChangeText={(e) => setForm({ ...form, date: e })}
          otherStyles={styles.formfield2}
        />

        <FormField
          title="Informações adicionais"
          value={form.moreinfo}
          placeholder="Caso queira acrescentar algo..."
          handleChangeText={(e) => setForm({ ...form, moreinfo: e })}
          otherStyles={styles.formfield3}
        />

        <CustomButton
          title="Enviar & Publicar"
          handlePress={submit}
          containerStyles={styles.button1}
          isLoading={uploading}
        />

        <CustomButton
          title="Cancelar"
          handlePress={() => router.push('/(tabs)/home')}
          containerStyles={[styles.button2, styles.cancelButton]}
          textStyles={styles.cancelButtonText}
        />

      </ScrollView>
    </SafeAreaView>
  )
}

export default Create

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
    marginTop: 25,
    fontSize: 24,
    lineHeight: 32,
    color: 'white',
    fontFamily: 'Poppins-SemiBold'
  },

  formfield1: {
    marginTop: 36
  },

  formfield2: {
    marginTop: 28
  },

  formfield3: {

    marginTop: 28
  },

  button1: {
    marginTop: 30
  },

  button2: {
    marginTop: 20
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

  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFA001'
  },

  cancelButtonText: {
    color: '#FFA001'
  }
})