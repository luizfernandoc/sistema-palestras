// c:\Users\luiz.moura\Desktop\Nova_pasta\Nova_pasta\sistema-palestras\frontend\app\(auth)\sign-in.jsx
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'
import authService from '../services/authService'  // Adicione esta importação

const SignIn = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!form.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    }

    if (!form.password) {
      newErrors.password = 'Senha é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Usando authService em vez de fetch diretamente
      const result = await authService.login({
        email: form.email,
        password: form.password
      })

      console.log('Login realizado com sucesso:', result)

      Alert.alert(
        'Sucesso',
        'Login realizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Redirecionando para home...')
              router.replace('/logged') // alteração
            }
          }
        ],
        { cancelable: false }
      )
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      Alert.alert(
        'Erro',
        error.message || 'Credenciais inválidas',
        [{ text: 'OK' }],
        { cancelable: false }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View style={styles.viewstyle1}>
          <Image
            source={images.inova}
            resizeMode='contain'
            style={styles.inova}
          />

          <Text style={styles.textstyle1}>
            Bem-vindo de volta!
          </Text>

          <FormField
            title="Email"
            placeholder="Seu email aqui"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={styles.formfield}
            keyboardType="email-address"
            error={errors.email}
          />

          <FormField
            title="Senha"
            placeholder="Sua senha aqui"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={styles.formfield}
            secureTextEntry={true}
            error={errors.password}
          />

          <View style={styles.viewstyle3}>
            <Link href="/forgot-password" style={styles.forgotpass}>Esqueceu a senha?</Link>
          </View>

          <CustomButton
            title="Entrar"
            handlePress={submit}
            containerStyles={styles.buttonstyle}
            isLoading={isSubmitting}
          />

          <View style={styles.viewstyle2}>
            <Text style={styles.textstyle2}>
              Não tem uma conta?
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
    width: 145,
    height: 44
  },

  textstyle1: {
    color: "white",
    fontFamily: "Poppins-SemiBold",
    fontSize: 24,
    lineHeight: 32,
    marginTop: 40,
    fontWeight: 600
  },

  formfield: {
    marginTop: 28
  },

  buttonstyle: {
    marginTop: 40
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
    alignItems: "flex-end",
    paddingTop: 10,
  },

  forgotpass: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#FF9C01"
  },
})