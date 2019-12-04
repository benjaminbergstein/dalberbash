import React, { useState } from 'react';
import {
  DEFAULT_ROUND,
  updateGame,
} from '../../game'
import Button from '../Button';

const CHECK = '✅';

const Scoring = ({ game, WhenMyTurn }) => {
  const {
    name,
    round,
    currentPlayer,
    players,
    turnPlayer,
    roundTallies,
  } = game;
  const { answers, voteOptions, votes } = round;

  const isTurnPlayer = (player) => {
    return parseInt(player) === turnPlayer;
  };
  const votesFor = (player) => {
    return Object.values(votes).reduce((count, answerNumber) => {
      return player === answerNumber ? count + 1 : count;
    }, 0);
  };

  const pointsForPlayer = (player) => {
    if (isTurnPlayer(player)) {
      return votesFor(player) === 0 ? 2 : 0
    } else {
      const correctAnswer = parseInt(votes[player]) === turnPlayer;
      return (correctAnswer ? 2 : 0) + votesFor(player);
    }
  };

  const points = Object.entries(answers).reduce((totals, [player]) => {
    return { ...totals, [player]: pointsForPlayer(player) };
  }, {});

  const updatedRoundTallies = [
    ...roundTallies,
    points,
  ];

  const totals = updatedRoundTallies.reduce((t1, tally) => {
    return Object.entries(t1).reduce((t2, [player, score]) => ({
      ...t2,
      [player]: score + tally[player],
    }), {});
  });

  const startNextRound = () => {
    const newTurnPlayer = (turnPlayer % players) + 1;
    const updatedGame = {
      ...game,
      turnPlayer: newTurnPlayer,
      round: DEFAULT_ROUND,
      roundTallies: updatedRoundTallies,
    };

    updateGame(updatedGame);
  };

  return (
    <>
      <table style={{ width: '100%', border: '1px solid #ccc' }}>
        <tr>
          <th>Player</th>
          <th>Answer</th>
          <th></th>
          <th>Votes</th>
          <th>Round Pts</th>
          <th>Total Pts</th>
        </tr>

        {Object.entries(points).map(([player, points]) => {
          return (
            <tr>
              <td style={{ textAlign: 'center', }}>{player}</td>
              <td style={{ textAlign: 'center', }}>{answers[player]}</td>
              <td style={{ textAlign: 'center', }}>{isTurnPlayer(player) ? CHECK : ''}</td>
              <td style={{ textAlign: 'center', }}>{votesFor(player)}</td>
              <td style={{ textAlign: 'center', }}>{points}</td>
              <td style={{ textAlign: 'center', }}>{totals[player]}</td>
            </tr>
          );
        })}
      </table>

      <WhenMyTurn>
        <Button text='Next Round' onClick={startNextRound} />
      </WhenMyTurn>
    </>
  );
};

export default Scoring;
