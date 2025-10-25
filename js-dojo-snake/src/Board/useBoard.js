import { GRID_SIZE } from '../constants';

export const useBoard = ({ size, head: propsHead, tail: propsTail, apple: propsApple }) => {
  // At the begining of the dojo, we don't define the head, tail and apple so we initialize them here
  const head = propsHead || { top: 0, left: 0 };
  const tail = propsTail || [];
  const apple = propsApple || { top: 0, left: 0 };

  const cellSize = size / GRID_SIZE;

  const computePosition = ({ left, top }) => ({
    left: left * cellSize - 2,
    top: top * cellSize,
  });

  const headPosition = computePosition(head);
  const applePosition = computePosition(apple);
  const tailCells = tail.map(computePosition);

  return {
    cellSize,
    headPosition,
    tailCells,
    applePosition,
  };
};
