import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import CustomButton from '../../components/CustomButton';

const Student = () => {
  const [name, setName] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [anonCount, setAnonCount] = useState(1);
  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Digite um nome ou entre como anônimo.");
      return;
    }
    await AsyncStorage.setItem('studentName', name);
    setScanning(true);
    setScanned(false);
  };

  const handleAnonymous = async () => {
    const anonName = `Anônimo${anonCount}`;
    setName(anonName);
    setAnonCount(prev => prev + 1);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;

    setScanned(true);
    setScanning(false);
    router.push(`/student/presentation/${data}`);
  };

  if (scanning && permission?.granted) {
    return (
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        onBarCodeScanned={handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['qr'],
        }}
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
        title="Digite código da Palestra"
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    marginTop: 28,
  },
});
