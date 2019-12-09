import React, { useState, useEffect } from 'react';
import CollectionForm from './CollectionForm';
import Button from '../Button';
import TextBox from '../TextBox';
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
  setWatchGamePaused,
  WhenMyTurn,
  WhenNotMyTurn
}) => {
  const [answer, setAnswer] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const {
    name,
    currentPlayer,
    turnPlayer,
    players,
    round,
  } = game;

  useEffect(() => { setWatchGamePaused(!hasSubmitted) }, [hasSubmitted]);

  const { prompt, answers } = round;
  const answerCount = Object.entries(answers).length;
  const everyoneAnswered = answerCount === players;

  const handleSubmit = () => {
    submitAnswer(name, currentPlayer, answer);
    setHasSubmitted(true);
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
        {!hasSubmitted && (
          <CollectionForm
            prompt="What's the real answer?"
            handleSubmit={handleSubmit}
            field={answer}
            setField={setAnswer}
          />
        )}
        {hasSubmitted && (
          <>
            <TextBox theme='gray' text={`${answerCount} answer(s)`} />
            {Object.entries(answers).map(([player, answer]) => (
              <TextBox theme='green' text={answer} />
            ))}
            {everyoneAnswered && (
              <Button onClick={startVoting} text='Start Voting' />
            )}
          </>
        )}
      </WhenMyTurn>

      <WhenNotMyTurn>
        <TextBox theme='gray' text={prompt} />
        {!hasSubmitted && (
          <CollectionForm
            prompt="What's your answer?"
            handleSubmit={handleSubmit}
            field={answer}
            setField={setAnswer}
          />
        )}
        {hasSubmitted && (
          <TextBox theme='green' text='Waiting for other players...' />
        )}
      </WhenNotMyTurn>
    </>
  );
};

export default CollectAnswers;
