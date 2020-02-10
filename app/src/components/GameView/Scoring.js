import React, { useState } from 'react';
import withTrackEvent from '../../containers/withTrackEvent';
import Button from '../Button';
import TextBox from '../TextBox';
import { useMutation } from '@apollo/react-hooks';
import { START_NEW_ROUND } from '../../graphql/queries';
import turnHelper from './turnHelper';
import useGame from '../../hooks/useGame';

const CHECK = '✅';

const Scoring = ({
  gameId,
  currentPlayer,
  resetSelectedPrompt,
  trackEvent,
}) => {
  const { game, subscribe } = useGame(gameId);
  subscribe();

  const { WhenMyTurn } = turnHelper(currentPlayer, game);

  resetSelectedPrompt();

  const {
    round,
    countPlayers,
    players,
    turnPlayer,
    roundTallies,
  } = game;

  const [startNewRound, { called: nextRoundStarted }] = useMutation(START_NEW_ROUND, {
    variables: { gameId },
  });

  if (nextRoundStarted) return null;

  const playerNames = players.reduce((names, { player, name }) => ({
    ...names,
    [player]: name || `Player ${player}`,
  }), {});
  const { answers, voteOptions, votes } = round;

  const [totals, points] = roundTallies.reduce(([aggregate, lastRound], { playerTallies }, index, tallies) => {
    return [playerTallies.reduce((t2, { player, points }) => {
      if (!t2[player]) t2[player] = 0;

      if (index === tallies.length - 1) {
        lastRound[player] = points;
      }

      t2[player] = t2[player] + points;
      return t2;
    }, aggregate), lastRound];
  }, [{}, {}]);

  const startNextRound = () => {
    trackEvent('Round', 'Start');
    startNewRound();
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

  console.log(totals, points);
  const getPlayerName = (player) => playerNames[player] || `Player ${player}`;

  return (
    <>
      {playerOrder.map((player) => (
        <div>
          <TextBox theme='green' marginTop='0.5rem' text={`${getPlayerName(player)}`} />
          <TextBox theme='gray' text={`${totals[player]} pts total, ${points[player]} this round.`} />
        </div>
      ))}

      <WhenMyTurn>
        <Button text='Next Round' onClick={startNextRound} />
      </WhenMyTurn>
    </>
  );
};

export default withTrackEvent(Scoring);
