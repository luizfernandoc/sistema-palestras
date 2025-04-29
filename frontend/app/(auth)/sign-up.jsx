import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { images } from '../../constants'


import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'
import authService from '../services/authService'  // Caminho corrigido

const SignUp = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!form.username.trim()) {
      newErrors.username = 'Nome é obrigatório'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!form.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (form.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres'
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async () => {
    if (!validateForm()) {
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      console.log('Iniciando registro com dados:', {
        name: form.username,
        email: form.email,
        password: form.password
      });
      
      // Usando o authService em vez de fetch diretamente
      const userData = {
        name: form.username,
        email: form.email,
        password: form.password
      };
  
      console.log('Chamando authService.register com:', userData);
      const result = await authService.register(userData);
  
      console.log('Cadastro realizado com sucesso:', result);
  
      // Garantir que o Alert seja exibido
      Alert.alert(
        'Sucesso',
        'Usuário cadastrado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Redirecionando para login...');
              router.push('/sign-in');
            }
          }
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      Alert.alert(
        'Erro',
        error.message || 'Falha ao cadastrar usuário',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Cadastre-se Já!
          </Text>

          <FormField
            title="Nome"
            placeholder="Seu nome aqui"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles={styles.formfield}
            error={errors.username}
          />

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

          <FormField
            title="Confirmar Senha"
            placeholder="Confirme sua senha"
            value={form.confirmPassword}
            handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            otherStyles={styles.formfield}
            secureTextEntry={true}
            error={errors.confirmPassword}
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
  // Estilos existentes mantidos
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
    marginTop: 28,
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