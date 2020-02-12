import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import SubmitPrompt from './SubmitPrompt';
import AwaitingPrompt from './AwaitingPrompt';
import CollectAnswers from './CollectAnswers';
import Voting from './Voting';
import Scoring from './Scoring';
import withPromptSuggestions from '../../containers/withPromptSuggestions';
import turnHelper from './turnHelper';
import useGame from '../../hooks/useGame';

const ROUND_COMPONENTS = {
  awaiting_prompt: [AwaitingPrompt, 'Choose Prompt'],
  awaiting_answers: [CollectAnswers, 'Submit Answers'],
  voting: [Voting, 'Vote'],
  scoring: [Scoring, 'Point Tally'],
};

const GameView = ({
  gameId,
  currentPlayer,
  getRandomPrompt,
  setSelectedPrompt,
  selectedPrompt,
  resetSelectedPrompt,
}) => {
  const { game, subscribe } = useGame(gameId);
  subscribe();

  const { turnPlayer, round } = game;
  const { isMyTurn } = turnHelper(currentPlayer, game);
  const [Component, title] = ROUND_COMPONENTS[round.state];

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header title={`Game "${gameId}"`} subtitle={`You are player ${currentPlayer}`} />
      <div style={{ flex: '1', overflowY: 'scroll', marginBottom: 'auto' }}>
        <Component
          gameId={gameId}
          currentPlayer={currentPlayer}
          getRandomPrompt={getRandomPrompt}
          setSelectedPrompt={setSelectedPrompt}
          resetSelectedPrompt={resetSelectedPrompt}
          selectedPrompt={selectedPrompt}
        />
      </div>
      <Footer
        primaryText={isMyTurn ? 'Your turn!' : `Player ${turnPlayer}'s Turn.`}
        secondaryText={title}
      />
    </div>
  );
};

export default withPromptSuggestions(GameView);
