import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export const ScoreBand = ({ score, name, setName }) => {
  return (
    <View style={styles.top}>
      {!!setName && (
        <View style={styles.user}>
          <Text>Joueur : </Text>
          <TextInput onChangeText={setName} value={name} />
        </View>
      )}
      <Text>Score : {score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    margin: 10,
    paddingBottom: 10,
    borderBottomWidth: 2,
  },
  user: {
    flexDirection: 'row',
    flex: 1,
  },
});
