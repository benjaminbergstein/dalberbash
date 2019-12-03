import React, { useState } from 'react';
import CollectionForm from './CollectionForm';
import SubmitPrompt from './SubmitPrompt';
import AwaitingPrompt from './AwaitingPrompt';
import CollectAnswers from './CollectAnswers';
import Voting from './Voting';
import Scoring from './Scoring';
import withWatchGame from '../../containers/withWatchGame';

const ROUND_COMPONENTS = {
  awaiting_prompt: AwaitingPrompt,
  awaiting_answers: CollectAnswers,
  voting: Voting,
  scoring: Scoring,
};

const ConditionalComponent = (condition) => ({ children }) => (condition && children);

const GameView = ({ game, setGame }) => {
  const {
    name,
    currentPlayer,
    turnPlayer,
    round,
  } = game;

  const isMyTurn = turnPlayer === currentPlayer;
  const Component = ROUND_COMPONENTS[round.state];

  return (
    <div>
      <h1>{name}</h1>
      <div>You are player {currentPlayer}</div>
      <Component
        game={game}
        setGame={setGame}
        isMyTurn={isMyTurn}
        WhenMyTurn={ConditionalComponent(isMyTurn)}
        WhenNotMyTurn={ConditionalComponent(!isMyTurn)}
      />
    </div>
  );
};

export default withWatchGame(GameView);
