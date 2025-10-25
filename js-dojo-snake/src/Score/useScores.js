import React, { useState } from 'react';

const SCORE_DB_ROOT = 'https://dojo-snake-default-rtdb.europe-west1.firebasedatabase.app';

export const useScores = (name) => {
  const [scores, setScores] = useState([]);

  const fetchScores = async () => {
    try {
      const response = await fetch(SCORE_DB_ROOT + '/scores.json');
      const rawScores = await response.json();
      setScores(Object.values(rawScores));
    } catch (e) {
      console.error('Something wrong happened :', e);
      setScores([]);
    }
  };

  const sendScore = async (score) => {
    try {
      const time = Date.now();
      const scoreLine = { name, score, time };
      const data = JSON.stringify(scoreLine);
      await fetch(`${SCORE_DB_ROOT}/scores/${time}.json`, { method: "PUT", body: data });
    } catch (e) {
      console.error('Something wrong happened :', e);
    }
  };

  return { fetchScores, scores, sendScore };
};
