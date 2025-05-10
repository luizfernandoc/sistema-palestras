import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { BarCodeScanner } from 'expo-barcode-scanner';

const Student = () => {
  const [name, setName] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [anonCount, setAnonCount] = useState(1);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Digite um nome ou entre como anônimo.");
      return;
    }
    await AsyncStorage.setItem('studentName', name);
    setScanning(true); // Vai exibir o scanner
  };

  const handleAnonymous = async () => {
    const anonName = `Anônimo${anonCount}`;
    setName(anonName);
    setAnonCount(prev => prev + 1);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanning(false);
    // Redirecionar para a palestra com base no código escaneado
    router.push(`/student/presentation/${data}`);
  };

  if (scanning && hasPermission) {
    return (
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Entrar como Aluno</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        placeholderTextColor="#aaa"
        onChangeText={setName}
        value={name}
      />
      <CustomButton
        title="Entrar como Anônimo" 
        handlePress={handleAnonymous}
        containerStyles={styles.button} 
      />
      <CustomButton 
        title="Continuar e Escanear QR Code" 
        handlePress={handleContinue}
        containerStyles={styles.button} 
      />
    </SafeAreaView>
  );
};

export default Student;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    padding: 16,
    justifyContent: 'center'
  },
  
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold'
  },

  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16
  },

  button: {
    marginTop: 28
  },
});
