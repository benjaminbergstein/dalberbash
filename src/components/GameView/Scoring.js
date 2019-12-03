import React, { useState } from 'react';

const Scoring = ({ game }) => {
  const { name, round, currentPlayer, players, turnPlayer } = game;
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

  return (
    <table>
      <tr>
        <th>Player</th>
        <th>Answer</th>
        <th></th>
        <th>Points</th>
        <th>Votes</th>
      </tr>

      {Object.entries(points).map(([player, points]) => {
        return (
          <tr>
            <td>{player}</td>
            <td>{answers[player]}</td>
            <td>{isTurnPlayer(player) ? '(real)' : ''}</td>
            <td>{points}</td>
            <td>{votesFor(player)}</td>
          </tr>
        );
      })}
    </table>
  );
};

export default Scoring;
