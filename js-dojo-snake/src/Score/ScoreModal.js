import React from 'react';
import { Button, Modal, SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { NOKIA_COLOR } from '../theme';

export const ScoreModal = ({ visible, close, scores }) => {
  return (
    <Modal visible={visible} animationType={'slide'}>
      <SafeAreaView style={styles.modal}>
        <Text style={styles.title}>Meilleurs scores</Text>
        <ScrollView style={styles.list}>
          {scores
            ?.filter(({ score }) => score > 0)
            .sort((line1, line2) => line2.score - line1.score)
            .map(({ score, name, time }, index) => (
              <Text style={styles.line} key={time}>
                <Text>
                  {index + 1} - {new Date(time).toLocaleTimeString('fr')} - {name} - {score}
                </Text>
              </Text>
            ))}
        </ScrollView>
        <Button title={'Fermer les scores'} onPress={close} />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    color: NOKIA_COLOR,
    paddingVertical: 20,
  },
  list: {
    flex: 1,
    paddingHorizontal: 30,
  },
  line: {
    flex: 1,
    color: NOKIA_COLOR,
    fontSize: 18,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  name: {
    flex: 1,
  },
});
