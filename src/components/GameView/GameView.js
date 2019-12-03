import React, { useState } from 'react';
import CollectionForm from './CollectionForm';
import SubmitPrompt from './SubmitPrompt';
import AwaitingPrompt from './AwaitingPrompt';
import CollectAnswers from './CollectAnswers';
import Voting from './Voting';
import Scoring from './Scoring';
import { watchGame } from '../../game';

const ROUND_COMPONENTS = {
  awaiting_prompt: AwaitingPrompt,
  awaiting_answers: CollectAnswers,
  voting: Voting,
  scoring: Scoring,
};

const ConditionalComponent = (condition) => ({ children }) => {
  if (!condition) return null;
  return (<>{children}</>);
};

const GameView = ({ game, setGame }) => {
  const {
    currentPlayer,
    turnPlayer,
    round,
  } = game;

  const isMyTurn = turnPlayer === currentPlayer;
  const Component = ROUND_COMPONENTS[round.state];
  watchGame(game, setGame);

  return (
    <div>
      <h1>{game.name}</h1>
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

export default GameView;
