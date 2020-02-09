import React, { useState } from 'react';
import Container from '../Container';
import SubmitPrompt from './SubmitPrompt';
import AwaitingPrompt from './AwaitingPrompt';
import CollectAnswers from './CollectAnswers';
import Voting from './Voting';
import Scoring from './Scoring';
import withPromptSuggestions from '../../containers/withPromptSuggestions';

const ROUND_COMPONENTS = {
  awaiting_prompt: [AwaitingPrompt, 'Choose Prompt'],
  awaiting_answers: [CollectAnswers, 'Submit Answers'],
  voting: [Voting, 'Vote'],
  scoring: [Scoring, 'Point Tally'],
};

const ConditionalComponent = (condition) => ({ children }) => (condition && children);

const GameView = ({
  game,
  currentPlayer,
  setWatchGamePaused,
  getRandomPrompt,
  setSelectedPrompt,
  selectedPrompt,
  resetSelectedPrompt,
}) => {
  const {
    name,
    turnPlayer,
    round,
  } = game;

  const isMyTurn = turnPlayer === currentPlayer;
  const [Component, title] = ROUND_COMPONENTS[round.state];

  return (
    <Container
        title={`Game "${name}"`}
        subtitle={`You are player ${currentPlayer}`}
        footer={{
          primaryText: isMyTurn ? 'Your turn!' : `Player ${turnPlayer}'s Turn.`,
          secondaryText: title,
        }}
      >
      <Component
        game={game}
        currentPlayer={currentPlayer}
        isMyTurn={isMyTurn}
        setWatchGamePaused={setWatchGamePaused}
        getRandomPrompt={getRandomPrompt}
        setSelectedPrompt={setSelectedPrompt}
        resetSelectedPrompt={resetSelectedPrompt}
        selectedPrompt={selectedPrompt}
        WhenMyTurn={ConditionalComponent(isMyTurn)}
        WhenNotMyTurn={ConditionalComponent(!isMyTurn)}
      />
    </Container>
  );
};

export default withPromptSuggestions(GameView);
