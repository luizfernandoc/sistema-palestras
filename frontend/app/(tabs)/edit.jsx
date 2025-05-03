// frontend/app/presentation/[id].jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

import PresentationService from '../services/PresentationService';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

/* 
Tentei me aventurar no BackEnd, não faço ideia se vai funcionar, porém
fica aí a base do que precisar ser feito. Atualizar os dados da Palestra
nessa página e na página Home, onde ficarão os dados da Palestra.
*/

const Edit = () => {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    title: '',
    location: '',
    date: '',
    moreinfo: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const data = await PresentationService.getPresentationById(id); // Ajuste de acordo com o backend
        setForm({
          title: data.title,
          location: data.location,
          date: data.date,
          moreinfo: data.moreinfo || ''
        });
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar a palestra.');
      }
    };

    fetchPresentation();
  }, [id]);

  const validateForm = () => {
    if (!form.title.trim()) return Alert.alert('Erro', 'Título obrigatório');
    if (!form.location.trim()) return Alert.alert('Erro', 'Local obrigatório');
    if (!form.date.trim()) return Alert.alert('Erro', 'Data obrigatória');
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await PresentationService.updatePresentation(id, {
        title: form.title,
        location: form.location,
        date: form.date,
        moreinfo: form.moreinfo
      });
      Alert.alert('Sucesso', 'Palestra atualizada com sucesso!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <Text style={styles.textstyle}>Editar Palestra</Text>

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
          otherStyles={styles.formfield2}
        />

        <CustomButton
          title="Salvar Alterações"
          handlePress={handleSave}
          containerStyles={styles.button}
          isLoading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161622',
    flex: 1
  },

  scrollview: {
    paddingHorizontal: 16,
    paddingVertical: 24
  },

  textstyle: {
    marginTop: 25,
    fontSize: 24,
    lineHeight: 32,
    color: 'white',
    fontFamily: 'Poppins-SemiBold'
  },

  formfield1: {
    marginTop: 40
  },

  formfield2: {
    marginTop: 32
  },

  button: {
    marginTop: 40
  }
});
