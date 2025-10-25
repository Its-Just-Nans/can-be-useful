import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export const DirectionButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.container} />
);

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 60,
    background: "linear-gradient(#e66465, #9198e5)",
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 30,
  },
});
