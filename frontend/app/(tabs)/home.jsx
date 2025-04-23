import { View, Text, ScrollView, StyleSheet, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const Home = () => {
  const submit = () => {

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
          Bem Vindo!
        </Text>

        <CustomButton
          title="Criar Palestra"
          handlePress={() => router.push('/create')}
          containerStyles={styles.button}
        />

        <CustomButton
          title="Editar Palestra"
          handlePress={() => {}}
          containerStyles={styles.button}
        />

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

  button: {
    marginTop: 28
  }
})