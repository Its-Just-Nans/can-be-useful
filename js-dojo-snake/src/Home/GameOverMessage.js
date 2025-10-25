import React from 'react';
import { StyleSheet, Text } from 'react-native';

export const GameOverMessage = () => <Text style={styles.gameOver}>Game Over :( </Text>;

const styles = StyleSheet.create({
  gameOver: {
    position: 'absolute',
    top: '30%',
    textAlign: 'center',
    right: 0,
    left: 0,
    fontSize: 40,
    fontWeight: '800',
  },
});
