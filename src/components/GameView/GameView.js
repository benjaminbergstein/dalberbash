import React, { useState } from 'react';
import Container from '../Container';
import SubmitPrompt from './SubmitPrompt';
import AwaitingPrompt from './AwaitingPrompt';
import CollectAnswers from './CollectAnswers';
import Voting from './Voting';
import Scoring from './Scoring';
import withWatchGame from '../../containers/withWatchGame';
import withPromptSuggestions from '../../containers/withPromptSuggestions';

const ROUND_COMPONENTS = {
  awaiting_prompt: [AwaitingPrompt, 'Choose Prompt'],
  awaiting_answers: [CollectAnswers, 'Submit Answers'],
  voting: [Voting, 'Vote'],
  scoring: [Scoring, 'Point Tally'],
};

const ConditionalComponent = (condition) => ({ children }) => (condition && children);

const GameView = ({ game, connected, ...props }) => {
  const {
    name,
    currentPlayer,
    turnPlayer,
    round,
  } = game;

  const isMyTurn = turnPlayer === currentPlayer;
  const [Component, title] = ROUND_COMPONENTS[round.state];

  const footerOptions = connected ? {
    primaryText: isMyTurn ? 'Your turn!' : `Player ${turnPlayer}'s Turn.`,
    secondaryText: title,
  } : {
    primaryText: 'Reconnecting...',
    secondaryText: 'Hold on a second!',
  }
  return (
    <Container
        title={`Game "${name}"`}
        subtitle={`You are player ${currentPlayer}`}
        footer={footerOptions}
      >
      <Component
        game={game}
        isMyTurn={isMyTurn}
        WhenMyTurn={ConditionalComponent(isMyTurn)}
        WhenNotMyTurn={ConditionalComponent(!isMyTurn)}
        {...props}
      />
    </Container>
  );
};

export default withPromptSuggestions(withWatchGame(GameView));
