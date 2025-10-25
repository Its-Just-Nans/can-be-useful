import React from 'react';
import { useState,useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, Alert, Button } from 'react-native';
import { NOKIA_COLOR } from '../theme';
import {Board} from '../Board/Board';
import {Controls} from "../Controls/Controls"
import { getScreenDimension } from "../utils/getScreenDimension";
import {useGameLoop} from "./useGameLoop";
import {GameOverMessage} from "./GameOverMessage";
import {ScoreBand} from "../Score/ScoreBand"
import {ScoreModal} from "../Score/ScoreModal"
import {useScores} from "../Score/useScores";

export const Home = () => {
  const [scoreBoardVisible, setScoreBoardVisible] = useState(false);
  const { head, tail, apple, relaunch, goDown, goRight, goLeft, goUp, running, score } = useGameLoop(() => {
    sendScore(score);
  });
  const {screenHeight, screenWidth} = getScreenDimension();
  const [name, setName] = useState("DEFAULT");
  const {scores, fetchScores, sendScore} = useScores(name);

  return (
    <SafeAreaView style={styles.container}>
      <Text>This is a snake to be !</Text>

      <ScoreModal scores={scores} visible={scoreBoardVisible} close={()=> {
        setScoreBoardVisible(false);
      }}/>
      <Button disabled={running} title="Relancer une partie" onPress={relaunch} />
      <ScoreBand score={score} name={name} setName={setName}/>
      <Board head={head} tail={tail} apple={apple} size={screenWidth - 50} />
      <Controls goDown={goDown} goLeft={goLeft} goRight={goRight} goUp={goUp}/>
      {!running && 
        <GameOverMessage />
      }
      <Button onPress={async ()=>{
        await fetchScores();
        setScoreBoardVisible(true);
      }} title="Show Score"/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NOKIA_COLOR,
    padding: 10,
  },
});
