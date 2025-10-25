import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NOKIA_COLOR } from '../theme';
import { useBoard } from './useBoard';

const Cell = ({ size, position, isApple }) => (
  <View
    style={[
      styles.cell,
      {
        height: size,
        width: size,
        ...position,
        backgroundColor: isApple ? 'red' : 'black',
        borderColor: isApple ? 'black' : NOKIA_COLOR,
        zIndex: '-1',
      },
    ]}
  />
);

/**
 * height is the height of the component
 * width is the width of the component
 * head is the position of the head of the snake
 * tail is a list of position for every cell of the snake's tail
 * apple is the position of the apple
 */
export const Board = ({ size, head, tail, apple }) => {
  const { cellSize, headPosition, tailCells, applePosition } = useBoard({
    size,
    head,
    tail,
    apple,
  });

  return (
    <View style={{ ...styles.board, border: "1px solid black", height: size, width: size}}>
      <Cell size={cellSize} position={applePosition} isApple />
      <Cell size={cellSize} position={headPosition} />
      {tailCells.map((position, index) => (
        <Cell size={cellSize} position={position} key={index} />
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  board: {
    borderColor: 'black',
    borderWidth: 2,
    alignSelf: 'center',
  },
  cell: {
    position: 'absolute',
    borderWidth: 1,
  },
});
