import React, { useState } from 'react';
import CollectionForm from './CollectionForm';
import {
  updateGame,
  submitAnswer,
} from '../../game';

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const CollectAnswers = ({
  game,
  setGame,
  WhenMyTurn,
  WhenNotMyTurn
}) => {
  const [answer, setAnswer] = useState('');
  const {
    name,
    currentPlayer,
    turnPlayer,
    players,
    round,
  } = game;

  const { prompt, answers } = round;
  const answerCount = Object.entries(answers).length;
  const everyoneAnswered = answerCount === players;

  const handleSubmit = () => {
    submitAnswer(name, currentPlayer, answer);
  };

  const startVoting = () => {
    updateGame({
      ...game,
      round: {
        ...round,
        state: 'voting',
        votes: {},
        voteOptions: shuffle(Object.entries(answers)),
      },
    });
  };

  return (
    <>
      <WhenMyTurn>
        <CollectionForm
          prompt="What's the real answer?"
          handleSubmit={handleSubmit}
          field={answer}
          setField={setAnswer}
        />
        <div>{answerCount} answers</div>
        {Object.entries(answers).map(([player, answer]) => (
          <div>{answer}</div>
        ))}
        {everyoneAnswered && (
          <button onClick={startVoting}>Start Voting</button>
        )}
      </WhenMyTurn>

      <WhenNotMyTurn>
        <div>The prompt is:</div>
        <div>{prompt}</div>
        <CollectionForm
          prompt="What's your answer?"
          handleSubmit={handleSubmit}
          field={answer}
          setField={setAnswer}
        />
      </WhenNotMyTurn>
    </>
  );
};

export default CollectAnswers;
