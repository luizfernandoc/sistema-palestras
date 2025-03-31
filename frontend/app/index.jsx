import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../constants';

export default function App() {
  return (
    /* Tailwindcss não está funcionando mais como deveria, por isso foi decidido utilizar o framework apenas para conversão, do tailwind (framework) para o css puro no stylesheet (por que eu acostumei a utilizar o framework e não lembro algumas coisas do css puro) */

    /* SafeAreaView é para garantir que o conteúdo não fique por cima de nada, como bottombar e statusbar */
    <SafeAreaView style={styles.safeareaview}>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View style={styles.viewstyle}>
          <Image
            source={images.inova}
          />
          <Link href="/home" style={{ color: 'white' }}>Ir para HOME</Link>
        </View>
      </ScrollView>
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

  text: {
    fontFamily: "Poppins-Medium",
    fontSize: 30,
    fontWeight: 36,
  },

  safeareaview: {
    backgroundColor: "#161622",
    height: "100%"
  },

  viewstyle: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 16
  }
})