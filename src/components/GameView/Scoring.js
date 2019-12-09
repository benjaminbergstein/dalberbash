import React, { useState } from 'react';
import {
  DEFAULT_ROUND,
  updateGame,
} from '../../game'
import Button from '../Button';
import TextBox from '../TextBox';

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

  const correctAnswer = (player) => parseInt(votes[player]) === turnPlayer;
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
      return (correctAnswer(player) ? 2 : 0) + votesFor(player);
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

  const TitleCell = ({ children }) => (
    <th style={{
      textAlign: 'center',
      padding: '0.5rem',
    }}>{children}</th>
  );
  const Cell = ({ children }) => (
    <td style={{
      textAlign: 'center',
      padding: '0.5rem',
    }}>{children}</td>
  );

  const playerOrder = Object.entries(totals)
    .sort(([p1, s1], [p2, s2]) => s2 - s1)
    .map(([player]) => player);

  return (
    <>
      {playerOrder.map((player) => (
        <div>
          <TextBox theme='green' marginTop='0.5rem' text={`Player ${player}`} />
          <TextBox theme='gray' text={`${totals[player]} pts total, ${points[player]} this round.`} />
          <TextBox theme='gray' text={`${votesFor(player)} votes.`} />
          {correctAnswer(player) && (
            <TextBox theme='gray' text='${CHECK} Voted Correctly!' />
          )}
        </div>
      ))}

      <WhenMyTurn>
        <Button text='Next Round' onClick={startNextRound} />
      </WhenMyTurn>
    </>
  );
};

export default Scoring;
