import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Home } from './src/Home/Home';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Home />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
