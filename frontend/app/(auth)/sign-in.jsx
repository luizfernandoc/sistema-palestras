import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = () => {

  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.viewstyle1}>
          <Image
            source={images.inova}
            resizeMode='contain'
            style={styles.inova}
          />

          <Text style={styles.textstyle1}>
            Faça o Login Agora!
          </Text>

          <FormField
            title="Email"
            placeholder="fulano12@gmail.com"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={styles.emailfield}
            keyboardType="email-address"
          />

          <FormField
            title="Senha"
            placeholder="Fulano12*"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={styles.emailfield}
          />

          <View style={styles.viewstyle3}>
            <Text style={styles.textstyle3}>
              Esqueceu a senha?
            </Text>
            <Link href="/sign-up" style={styles.forgotpass}>Recupere!</Link>
          </View>

          <CustomButton
            title="Login"
            handlePress={submit}
            containerStyles={styles.buttonstyle}
            isLoading={isSubmitting}
          />

          <View style={styles.viewstyle2}>
            <Text style={styles.textstyle2}>
              Não possui uma conta?
            </Text>
            <Link href="/sign-up" style={styles.signupstyle}>Cadastre-se!</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#161622",
    height: "100%"
  },

  viewstyle1: {
    width: "100%",
    justifyContent: "center",
    minHeight: "85%",
    paddingHorizontal: 16,
    marginVertical: 24
  },

  inova: {
    width: 115,
    height: 35
  },

  textstyle1: {
    color: "white",
    fontFamily: "Poppins-SemiBold",
    fontSize: 24,
    lineHeight: 32,
    marginTop: 40,
    fontWeight: 600
  },

  emailfield: {
    marginTop: 28
  },

  buttonstyle: {
    marginTop: 28
  },

  viewstyle2: {
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 20,
    gap: 8
  },

  textstyle2: {
    fontSize: 18,
    lineHeight: 28,
    color: "#CDCDE0",
    fontFamily: "Poppins-Regular"
  },

  signupstyle: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "Poppins-SemiBold",
    color: "#FF9C01"
  },

  viewstyle3: {
    justifyContent: "start",
    flexDirection: "row",
    paddingTop: 10,
    gap: 4
  },

  textstyle3: {
    fontSize: 12,
    lineHeight: 18,
    color: "#CDCDE0",
    fontFamily: "Poppins-Regular"
  },

  forgotpass: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#FF9C01"
  },
})