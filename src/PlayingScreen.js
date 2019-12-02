import React, { useState } from 'react';
import {
  updateGame,
  watchGame,
  submitAnswer,
} from './game';

const CollectionForm = ({ prompt, field, setField, handleSubmit }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div>
      <div>{prompt}</div>
      <form onSubmit={onSubmit}>
        <textarea onChange={(e) => setField(e.target.value)}>{field}</textarea>
        <button>Submit</button>
      </form>
    </div>
  )
};

const SubmitPrompt = ({ game, setGame }) => {
  const [prompt, setPrompt] = useState('');
  const { round } = game;
  const handleSubmit = () => {
    const updatedGame = {
      ...game,
      round: {
        ...round,
        prompt,
        state: 'awaiting_answers',
      },
    };
    updateGame(updatedGame);
  };

  return (
    <div>
      <div>It's your turn</div>
      <CollectionForm
        prompt="What's the prompt?"
        handleSubmit={handleSubmit}
        field={prompt}
        setField={setPrompt}
      />
    </div>
  )
};

const AwaitingPrompt = ({ game, setGame, isMyTurn }) => {
  const { turnPlayer } = game;

  return (
    <>
      {isMyTurn && (
        <SubmitPrompt game={game} setGame={setGame} />
      )}
      {!isMyTurn && (
        <div>It's player {turnPlayer}'s turn</div>
      )}
    </>
  );
};

const CollectAnswers = ({ game, setGame, isMyTurn }) => {
  const [answer, setAnswer] = useState('');
  const { name, currentPlayer, turnPlayer, round } = game;
  const { prompt } = round;

  const handleSubmit = () => {
    submitAnswer(name, currentPlayer, answer);
  };

  return (
    <>
      {isMyTurn && (
        <div>Waiting for other players...</div>
      )}
      {!isMyTurn && (
        <>
          <div>The prompt is:</div>
          <div>{prompt}</div>
          <CollectionForm
            prompt="What's your answer?"
            handleSubmit={handleSubmit}
            field={answer}
            setField={setAnswer}
          />
        </>
      )}
    </>
  );
};

const ROUND_COMPONENTS = {
  awaiting_prompt: AwaitingPrompt,
  awaiting_answers: CollectAnswers,
};

const PlayingScreen = ({ game, setGame }) => {
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
      />
    </div>
  );
};

export default PlayingScreen;
