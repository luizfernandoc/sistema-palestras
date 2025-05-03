import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, router } from 'expo-router'

import { images } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { useState } from 'react'

/*
Nessa página o Palestrante, já logado, terá que escolher uma
palestra já criada ou criar uma, para então prosseguir.

Precisamos integrar esse Logged com as Tabs, para assim, conseguir
fazer com que o palestrante tenha sua palestra integrada a essas Tabs,
que seriam Home, Create, Questions e Profile (provavelmente profile
vai se tornar Edit)
*/

const Logged = () => {
  // Simulando uma lista de palestras (até ter a integração com as palestras)
  const [palestras, setPalestras] = useState([
    { id: 1, title: 'Palestra de Inovação' },
    { id: 2, title: 'Tecnologia e Futuro' }
  ])

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
              <Text style={styles.textstyle2}>nome</Text>
              {' '}!
            </Text>
          </View>

          <Text style={styles.textstyle3}>
            Crie aqui sua Palestra ou escolha uma já criada!
          </Text>

          <View style={styles.cardContainer}>
            {palestras.length > 0 ? (
              palestras.map((palestra) => (
                <TouchableOpacity
                  key={palestra.id}
                  style={styles.card}
                  onPress={() => router.push(`/presentation/${palestra.id}`)} // Substitua pela rota correta
                >
                  <Text style={styles.cardTitle}>{palestra.title}</Text>
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
  }
})