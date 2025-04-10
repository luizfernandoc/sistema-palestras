import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'

const SignUp = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    // Validação básica
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.username,
          email: form.email,
          password: form.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!', [
          { text: 'OK', onPress: () => router.push('/sign-in') }
        ]);
      } else {
        Alert.alert('Erro', data.message || 'Falha ao cadastrar usuário');
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
      setIsSubmitting(false);
    }
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
            Cadastre-se Já!
          </Text>

          <FormField
            title="Nome"
            placeholder="Fulano da Silva"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles={styles.formfield}
          />

          <FormField
            title="Email"
            placeholder="fulano12@gmail.com"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={styles.formfield}
            keyboardType="email-address"
          />

          <FormField
            title="Senha"
            placeholder="Fulano12*"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={styles.formfield}
            secureTextEntry={true}
          />

          <FormField
            title="Confirmar Senha"
            placeholder="Fulano12*"
            value={form.confirmPassword}
            handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            otherStyles={styles.formfield}
            secureTextEntry={true}
          />

          <CustomButton
            title="Cadastrar"
            handlePress={submit}
            containerStyles={styles.buttonstyle}
            isLoading={isSubmitting}
          />

          <View style={styles.viewstyle2}>
            <Text style={styles.textstyle2}>
              Já possui uma conta?
            </Text>
            <Link href="/sign-in" style={styles.signupstyle}>Faça Login!</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp

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