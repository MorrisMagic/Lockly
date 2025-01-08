import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Header from './components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <Header/>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',

  },
});
