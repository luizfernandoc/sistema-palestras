import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View style={styles.container}>
      <Text className="text-3xl">Início do PROJETO dia 30/03!</Text>
      <StatusBar style="auto" />
      <Link href="/profile" style={{ color: 'blue' }}>Ir para os PERFIS!</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})