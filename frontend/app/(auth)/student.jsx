import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { images } from '../../constants';
import authService from '../services/authService';  // Adicione esta importação

const Student = () => {
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [usedAnonNames, setUsedAnonNames] = useState(new Set());
  const [showAccessCodeCard, setShowAccessCodeCard] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isAnonymous) {
      generateUniqueAnonymousName();
    } else {
      setName('');
    }
  }, [isAnonymous]);

  const generateUniqueAnonymousName = () => {
    let anonName;
    let tries = 0;
    const maxTries = 1000;

    do {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      anonName = `Anônimo${randomNum}`;
      tries++;
    } while (usedAnonNames.has(anonName) && tries < maxTries);

    setUsedAnonNames(prev => new Set(prev).add(anonName));
    setName(anonName);
  };

  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Digite um nome ou selecione o modo anônimo.");
      console.log("Por favor digite um nome ou selecione o modo anônimo.")
      return;
    }
    setShowAccessCodeCard(true);
  };

  const handleAccessCodeSubmit = async () => {
    if (!accessCode.trim()) {
      Alert.alert("Erro", "Digite o código da palestra.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Autenticar (opcional se quiser verificar com backend)
      const result = await authService.loginStudent({
        name,
        accessCode
      });

      console.log('Login realizado com sucesso:', result);

      {/*Alert.alert(
        'Sucesso',
        'Login realizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Redirecionar para rota dinâmica da palestra
              router.push(`/student/${accessCode}/home`);
            }
          }
        ],
        { cancelable: false }
      );*/}
      router.replace(`/student/${accessCode}/home`);

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert(
        'Erro',
        error.message || 'Credenciais inválidas',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewstyle1}>
        <Image
          source={images.inova}
          resizeMode='contain'
          style={styles.inova}
        />
      </View>

      <Text style={styles.title}>
        Entrar como <Text style={styles.titleStudent}>Aluno</Text>
      </Text>

      <Text style={styles.textstyle3}>
        Coloque seu nome, ou escolha utilizar um nome anônimo. Depois, basta digitar o código da Palestra que o Palestrante irá passar! <Text style={styles.textstyle4}>Boa Palestra</Text>!
      </Text>

      <FormField
        title="Nome"
        value={name}
        placeholder="Digite seu nome"
        handleChangeText={setName}
        editable={!isAnonymous}
      />

      <View style={styles.checkboxContainer}>
        <Pressable onPress={() => setIsAnonymous(prev => !prev)} style={styles.checkbox}>
          <View
            style={[
              styles.checkboxBox,
              { borderColor: isAnonymous ? '#FFA001' : '#CDCDE0' },
              isAnonymous && styles.checkboxChecked,
            ]}
          />
          <Text style={[styles.checkboxLabel, { color: '#CDCDE0' }]}>
            Entrar como Anônimo
          </Text>
        </Pressable>
      </View>

      <CustomButton
        title="Digite código da Palestra"
        handlePress={handleContinue}
        containerStyles={styles.button}
      />

      {showAccessCodeCard && (
        <View style={styles.modalOverlay}>
          <View style={styles.card}>
            <FormField
              title="Código da Palestra"
              value={accessCode}
              placeholder="Ex.: EC1D4B"
              handleChangeText={setAccessCode}
            />

            <CustomButton
              title="Entrar"
              handlePress={handleAccessCodeSubmit}
              containerStyles={{ marginTop: 16 }}
            />

            <CustomButton
              title="Cancelar"
              handlePress={() => setShowAccessCodeCard(false)}
              containerStyles={[styles.button2, styles.cancelButton]}
              textStyles={styles.cancelButtonText}
            />

          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Student;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    marginTop: -30,
    padding: 16,
    justifyContent: 'center',
  },

  viewstyle1: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },

  textstyle3: {
    color: "#CDCDE0",
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular'
  },

  textstyle4: {
    color: '#FF9C01'
  },

  titleStudent: {
    color: '#FF9C01'
  },

  inova: {
    marginBottom: 40,
    width: 145,
    height: 44
  },

  button: {
    marginTop: 28,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkboxBox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    marginRight: 10,
    backgroundColor: 'transparent',
    borderRadius: 4,
  },

  checkboxChecked: {
    backgroundColor: '#FF9C01',
  },

  checkboxLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },

  card: {
    backgroundColor: '#1E1E2D',
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },

  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  card: {
    width: '90%',
    backgroundColor: '#1E1E2D',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  button2: {
    marginTop: 20,
  },

  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFA001',
  },

  cancelButtonText: {
    color: '#FFA001',
  },


});
