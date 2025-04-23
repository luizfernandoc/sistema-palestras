import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Redirect, router } from 'expo-router';

import { images } from '../../constants'

const Create = () => {
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    location: '',
    date: '',
    moreinfo: ''
  })

  const submit = () => {

  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview}>

        {/*}
        Caso queira adicionar logo do APP
        <Image
          source={images.inova}
          resizeMode='contain'
          style={styles.inova}
        />
        {*/}

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
          containerStyles={styles.button}
          isLoading={uploading}
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
    marginTop: 20,
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

  formfield3: {
    marginTop: 32
  },

  button: {
    marginTop: 40
  }
})