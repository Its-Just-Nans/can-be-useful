import { useState, useEffect } from 'react';
import { GRID_SIZE } from '../constants';

// The snake position will be updated every 100 ms
const LOOP_INTERVAL = 100;

const IS_INITIALLY_RUNNING = true;

/**
 * Each cell is defined by a left and a top parameter
 * We have on cell for the head
 * One for he apple
 * A list for the tail
 */
const initialTail = [
  { left: 0, top: 0 },
  { left: 1, top: 0 },
];
const initialHead = { left: 2, top: 0 };
const initialApple = { left: 10, top: 10 };

const areSamePosition = ({ top, left }, { top: top2, left: left2 }) =>
  top === top2 && left === left2;

// Check if an element is included in a given array
const isIncludedInArray = ({ top, left }, list) => {
  for (const element of list) {
    if (top === element.top && left === element.left) return true;
  }
  return false;
};

export const useGameLoop = (CALLBACK) => {
  const [head, setHead] = useState(initialHead);
  const [tail, setTail] = useState(initialTail);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(IS_INITIALLY_RUNNING);
  
  const start = () => setRunning(true);
  const stop = () => {
    setRunning(false);
    CALLBACK();
  }

  // Reset the game
  const reset = () => {
    setHead(initialHead);
    setTail(initialTail);
    setXSpeed(1);
    setYSpeed(0);
  };

  const relaunch = () => {
    reset();
    start();
  };

  const [apple, setApple] = useState(initialApple);

  // Compute new apple position
  const generateApple = () => {
    const appleTop = Math.floor(Math.random() * (GRID_SIZE - 1));
    const appleLeft = Math.floor(Math.random() * (GRID_SIZE - 1));
    setApple({ top: appleTop, left: appleLeft });
  };

  // xSpeed and ySpeed define the horizontal and vertical speed of the snake
  const [xSpeed, setXSpeed] = useState(1);
  const [ySpeed, setYSpeed] = useState(0);
  const [hasAlreadyTurned, setHasAlreadyTurned] = useState(false);

  const goLeft = () => {
    // We check that the snake is not going horizontally and that it did not already turn in the last iteration
    if (xSpeed !== -1 && xSpeed !== 1 && !hasAlreadyTurned) {
      setXSpeed(-1);
      setYSpeed(0);
      setHasAlreadyTurned(true);
    }
  };
  const goRight = () => {
    // We check that the snake is not going horizontally and that it did not already turn in the last iteration
    if (xSpeed !== -1 && xSpeed !== 1 && !hasAlreadyTurned) {
      setXSpeed(1);
      setYSpeed(0);
      setHasAlreadyTurned(true);
    }
  };
  const goUp = () => {
    // We check that the snake is not going vertically and that it did not already turn in the last iteration
    if (ySpeed !== -1 && ySpeed !== 1 && !hasAlreadyTurned) {
      setXSpeed(0);
      setYSpeed(-1);
      setHasAlreadyTurned(true);
    }
  };
  const goDown = () => {
    // We check that the snake is not going vertically and that it did not already turn in the last iteration
    if (ySpeed !== -1 && ySpeed !== 1 && !hasAlreadyTurned) {
      setXSpeed(0);
      setYSpeed(1);
      setHasAlreadyTurned(true);
    }
  };

  // This function hold all the logic to compute the next iteration
  const computeNextHead = () => {
    if (running) {
      setHasAlreadyTurned(false);
      const nextHead = { top: head.top + ySpeed, left: head.left + xSpeed };
      const shouldGrow = areSamePosition(nextHead, apple);
      // If the snake will leave the board, we lose
      const nextHeadIsOutside =
        nextHead.top >= GRID_SIZE ||
        nextHead.left >= GRID_SIZE ||
        nextHead.top < 0 ||
        nextHead.left < 0;
      if (nextHeadIsOutside) {
        stop();
        return;
      }
      // If the snake will eat itself, we lose
      if (isIncludedInArray(nextHead, tail)) {
        stop();
        return;
      }
      // We compute the new tail :
      setTail(currentTail => {
        // We remove the last item because we moved forward - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice for slice definition
        const newTail = currentTail.slice(1);
        // We add the old head as now part of the tail
        newTail.push(head);
        if(shouldGrow) {
          newTail.push(nextHead);
          setScore(score+1);
          return newTail;
        }
        return newTail;
      });
      // We move the head
      setHead(nextHead);
      if(shouldGrow){
        generateApple()
      }
    }
  };

  useEffect(() => {
    setTimeout(computeNextHead, LOOP_INTERVAL);
  }, [head, running]);

  return {
    head,
    tail,
    apple,
    start,
    relaunch,
    stop,
    reset,
    goDown,
    goLeft,
    goRight,
    goUp,
    running,
    score
  };
};
