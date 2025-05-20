import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../../components/CustomButton';
import PresentationService from '../../services/PresentationService';

const Assess = () => {
  const [loading, setLoading] = useState(true);
  const [presentation, setPresentation] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const loadPresentation = async () => {
    try {
      const id = await AsyncStorage.getItem('selectedPresentationId');
      if (id) {
        console.log('Carregando apresentação com ID:', id);
        const data = await PresentationService.getPresentationById(id);
        setPresentation(data);

        if (data.status === 'completed') {
          console.log('Apresentação concluída, carregando perguntas de feedback');
          const fetchedQuestions = await PresentationService.getFeedbackQuestions(id);
          console.log('Perguntas de feedback obtidas:', fetchedQuestions);
          setQuestions(fetchedQuestions);
          setFeedback(fetchedQuestions.map(() => 3)); // valor inicial 3
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados da palestra ou perguntas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRating = (index, value) => {
    const updated = [...feedback];
    updated[index] = value;
    setFeedback(updated);
  };

  const handleSubmit = async () => {
    try {
      const id = await AsyncStorage.getItem('selectedPresentationId');
      if (!id) {
        Alert.alert('Erro', 'ID da apresentação não encontrado');
        return;
      }

      console.log('Enviando feedback para apresentação ID:', id);
      console.log('Respostas:', feedback);
      
      await PresentationService.submitFeedback(id, feedback);
      setSubmitted(true);
      Alert.alert('Obrigado!', 'Seu feedback foi enviado com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      Alert.alert('Erro', 'Não foi possível enviar o feedback. Tente novamente.');
    }
  };

  useEffect(() => {
    loadPresentation();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFA001" />
      </View>
    );
  }

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.centered}>
          <Text style={styles.infoText}>
            Obrigado por enviar seu feedback!
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!presentation || presentation.status !== 'completed') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.centered}>
          <Text style={styles.infoText}>
            A avaliação estará disponível assim que a palestra for concluída.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <Text style={styles.title}>Avaliação da Palestra</Text>

        {questions.map((q, index) => (
          <View key={q.id || index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{q.question}</Text>

            <View style={styles.buttonGroup}>
              {[1, 2, 3, 4, 5].map((val) => (
                <CustomButton
                  key={val}
                  title={val.toString()}
                  handlePress={() => handleSelectRating(index, val)}
                  containerStyles={[
                    styles.ratingButton,
                    feedback[index] === val && styles.ratingButtonSelected,
                  ]}
                  textStyles={{
                    color: feedback[index] === val ? '#161622' : '#fff',
                  }}
                />
              ))}
            </View>

            <Text style={styles.sliderValue}>Nota selecionada: {feedback[index]}</Text>
          </View>
        ))}

        <CustomButton
          title="Enviar Avaliação"
          handlePress={handleSubmit}
          containerStyles={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Assess;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161622',
    flex: 1,
  },

  scrollview: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },

  title: {
    fontSize: 22,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20,
  },

  questionContainer: {
    marginBottom: 30,
  },
  
  questionText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },

  sliderValue: {
    color: '#FFA001',
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },

  infoText: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Poppins-Regular',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  button: {
    marginTop: -2
  },

  ratingButton: {
    flex: 1,
    backgroundColor: '#2c2c2e',
    minHeight: 44,
  },

  ratingButtonSelected: {
    backgroundColor: '#FFA001',
  },
});
