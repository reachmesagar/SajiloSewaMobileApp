import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OrderStackNavigator } from './Navigators/StackNavigator';
import BootSplash from 'react-native-bootsplash';
import { useEffect } from 'react';
function App() {

  
  useEffect(() => {
    const init = async () => {
      await BootSplash.hide();
    };

    init();
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <OrderStackNavigator></OrderStackNavigator>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
