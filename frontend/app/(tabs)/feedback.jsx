// c:\Users\luizf\Desktop\Nova_pasta_(7)\sistema-palestras\frontend\app\(tabs)\feedback.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PresentationService from '../services/PresentationService';
import { BarChart } from 'react-native-chart-kit';

const Feedback = () => {
  const [loading, setLoading] = useState(true);
  const [presentations, setPresentations] = useState([]);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      setLoading(true);
      const userPresentations = await PresentationService.getUserPresentations();
      
      // Filtrar apenas apresentações concluídas
      const completedPresentations = userPresentations.filter(
        p => p.status === 'completed'
      );
      
      setPresentations(completedPresentations);
      
      // Se houver apresentações concluídas, selecionar a primeira por padrão
      if (completedPresentations.length > 0) {
        setSelectedPresentation(completedPresentations[0]);
        await loadFeedbackData(completedPresentations[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar apresentações:', error);
      setError('Não foi possível carregar suas apresentações.');
    } finally {
      setLoading(false);
    }
  };

  const loadFeedbackData = async (presentationId) => {
    try {
      setLoading(true);
      
      // Carregar perguntas de feedback
      const questions = await PresentationService.getFeedbackQuestions();
      setFeedbackQuestions(questions);
      
      // Carregar todos os feedbacks para a apresentação
      const feedbacks = await PresentationService.getAllFeedbacks(presentationId);
      
      // Processar os dados para o dashboard
      const processedData = processFeedbackData(feedbacks, questions);
      setFeedbackData(processedData);
    } catch (error) {
      console.error('Erro ao carregar dados de feedback:', error);
      setError('Não foi possível carregar os dados de feedback.');
    } finally {
      setLoading(false);
    }
  };

  const processFeedbackData = (feedbacks, questions) => {
    // Inicializar contadores para cada pergunta e cada nota (1-5)
    const questionStats = questions.map(q => ({
      questionId: q.id,
      questionText: q.question,
      ratings: [0, 0, 0, 0, 0], // Contadores para notas 1, 2, 3, 4, 5
      totalRatings: 0,
      averageRating: 0
    }));

    // Verificar se há feedbacks para processar
    if (!feedbacks || feedbacks.length === 0) {
      console.log('Nenhum feedback para processar');
      return {
        questionStats,
        overallAverage: 0,
        totalFeedbacks: 0
      };
    }

    // Processar cada feedback
    feedbacks.forEach(feedback => {
      if (Array.isArray(feedback)) {
        feedback.forEach((rating, index) => {
          if (index < questionStats.length && rating >= 1 && rating <= 5) {
            questionStats[index].ratings[rating - 1]++;
            questionStats[index].totalRatings++;
            questionStats[index].averageRating += rating;
          }
        });
      }
    });

    // Calcular médias
    questionStats.forEach(stat => {
      if (stat.totalRatings > 0) {
        stat.averageRating = (stat.averageRating / stat.totalRatings).toFixed(1);
      }
    });

    // Calcular média geral
    let overallTotal = 0;
    let overallCount = 0;
    questionStats.forEach(stat => {
      overallTotal += parseFloat(stat.averageRating) * stat.totalRatings;
      overallCount += stat.totalRatings;
    });

    const overallAverage = overallCount > 0 ? (overallTotal / overallCount).toFixed(1) : 0;

    return {
      questionStats,
      overallAverage,
      totalFeedbacks: feedbacks.length
    };
  };

  const handleSelectPresentation = async (presentation) => {
    setSelectedPresentation(presentation);
    await loadFeedbackData(presentation.id);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFA001" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (presentations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.infoText}>
            Você ainda não tem apresentações concluídas com feedback.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <Text style={styles.title}>Dashboard de Feedback</Text>
        
        {/* Seletor de Apresentação */}
        <View style={styles.presentationSelector}>
          <Text style={styles.selectorLabel}>Selecione uma apresentação:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
            {presentations.map(presentation => (
              <View 
                key={presentation.id} 
                style={[
                  styles.presentationItem,
                  selectedPresentation?.id === presentation.id && styles.selectedPresentation
                ]}
              >
                <Text 
                  style={[
                    styles.presentationTitle,
                    selectedPresentation?.id === presentation.id && styles.selectedPresentationText
                  ]}
                  onPress={() => handleSelectPresentation(presentation)}
                >
                  {presentation.title}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Resumo Geral */}
        {feedbackData && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Resumo Geral</Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{feedbackData.totalFeedbacks}</Text>
                <Text style={styles.statLabel}>Avaliações</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{feedbackData.overallAverage}</Text>
                <Text style={styles.statLabel}>Média Geral</Text>
              </View>
            </View>
          </View>
        )}

        {/* Detalhes por Pergunta */}
        {feedbackData && feedbackData.questionStats.map((stat, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{stat.questionText}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.averageRating}>Média: {stat.averageRating}</Text>
              <Text style={styles.totalRatings}>Total: {stat.totalRatings} avaliações</Text>
            </View>

            {/* Gráfico de barras para distribuição de notas */}
            {stat.totalRatings > 0 && (
              <BarChart
                data={{
                  labels: ['1', '2', '3', '4', '5'],
                  datasets: [
                    {
                      data: stat.ratings
                    }
                  ]
                }}
                width={Dimensions.get('window').width - 40}
                height={180}
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#1e1e30',
                  backgroundGradientFrom: '#1e1e30',
                  backgroundGradientTo: '#1e1e30',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 160, 1, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  barPercentage: 0.7
                }}
                style={styles.chart}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#161622",
    flex: 1
  },
  scrollview: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular'
  },
  infoText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular'
  },
  presentationSelector: {
    marginBottom: 20,
  },
  selectorLabel: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10
  },
  selectorScroll: {
    flexDirection: 'row',
  },
  presentationItem: {
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    minWidth: 150,
  },
  selectedPresentation: {
    backgroundColor: '#FFA001',
  },
  presentationTitle: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  selectedPresentationText: {
    color: '#161622',
  },
  summaryContainer: {
    backgroundColor: '#1e1e30',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFA001',
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  questionContainer: {
    backgroundColor: '#1e1e30',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  questionText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  averageRating: {
    color: '#FFA001',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  totalRatings: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  }
});