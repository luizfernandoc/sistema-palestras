import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { StatusBar } from 'expo-status-bar';
import { Redirect, router } from 'expo-router';

export default function App() {
  return (
    /* 
      Tailwindcss não está funcionando mais como deveria, por isso foi decidido utilizar o framework apenas para conversão, do tailwind (framework) para o css puro no stylesheet (por que eu acostumei a utilizar o framework e não lembro algumas coisas do css puro) 
    */

    /* 
      SafeAreaView é para garantir que o conteúdo não fique por cima de nada, como bottombar e statusbar
    */

    <SafeAreaView style={styles.safeareaview}>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View style={styles.viewstyle1}>
          <Image
            source={images.inova}
            style={styles.imagestyle1}
            resizeMode='contain'
          />

          <Image
            source={images.cards}
            style={styles.cardstyle}
            resizeMode='contain'
          />

          <View style={styles.viewstyle2}>
            <Text style={styles.textstyle}>
              Crie, Melhore, Pergunte!{"\n"}
              Tudo Isso e Mais com {''}
              <Text style={styles.textstyle2}>Inova</Text>
            </Text>

            <Image
              source={images.path}
              style={styles.imagestyle2}
              resizeMode='contain'
            />
          </View>

          <Text style={styles.textstyle3}>
            Chega de ter sua pergunta ignorada em uma palestra! E você, palestrante, cansado de não saber sua performance? Bom, esse aplicativo é para vocês!
          </Text>

          <CustomButton
            title="Conheça nosso App"
            handlePress={() => router.push('/sign-in')}
            containerStyles={styles.containerstyles1}
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },

  safeareaview: {
    backgroundColor: "#161622",
    height: "100%"
  },

  viewstyle1: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    minHeight: '90%',
    paddingHorizontal: 16
  },

  imagestyle1: {
    width: 150,
    height: 84
  },

  cardstyle: {
    maxWidth: 380,
    width: "100%",
    height: 300
  },

  textstyle: {
    fontSize: 30,
    lineHeight: 36,
    color: 'white',
    fontWeight: 700,
    textAlign: 'center'
  },

  viewstyle2: {
    position: 'relative',
    marginTop: 20
  },

  textstyle2: {
    color: '#FF8E01'
  },

  imagestyle2: {
    width: 136,
    height: 15,
    position: 'absolute',
    bottom: -9,
    right: -36
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
    width: '100%',
    marginTop: 32
  }
})