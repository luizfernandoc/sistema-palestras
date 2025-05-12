import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, router } from 'expo-router';

import { images } from '../../constants'
import CustomButton from '../../components/CustomButton'

const Main = () => {
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
              Seja Muito {'\n'} Bem Vindo(a) ao {''}
              <Text style={styles.textstyle2}>INOVA</Text>
            </Text>
          </View>

          <Text style={styles.textstyle3}>
            Para começar, selecione entre ALUNO ou PALESTRANTE. Vale ressaltar que somos o número 1 na UVV e estamos a incríveis 1 mês no ar!
          </Text>

          <CustomButton
            title="Sou Aluno"
            handlePress={() => router.push('/student')}
            containerStyles={styles.containerstyles1}
          />

          <CustomButton
            title="Sou Palestrante"
            handlePress={() => router.push('/sign-in')}
            containerStyles={styles.containerstyles2}
          />

          <Image
            source={images.choice}
            style={styles.choice}
            resizeMode='contain'
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Main

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
})