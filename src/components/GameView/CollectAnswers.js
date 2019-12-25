import React, { useState, useEffect } from 'react';
import CollectionForm from '../CollectionForm';
import Button from '../Button';
import TextBox from '../TextBox';
import {
  updateGame,
  submitAnswer,
} from '../../game';
import { shuffle } from '../../utilities';

const CollectAnswers = ({
  game,
  setGame,
  setWatchGamePaused,
  selectedPrompt,
  WhenMyTurn,
  WhenNotMyTurn
}) => {
  const [answer, setAnswer] = useState(selectedPrompt ? selectedPrompt[2] : '');
  const {
    name,
    currentPlayer,
    turnPlayer,
    players,
    round,
  } = game;

  const { prompt, answers } = round;
  const serverAnswer = answers[''+currentPlayer];
  const [hasSubmitted, setHasSubmitted] = useState(!!serverAnswer);

  const answerCount = Object.entries(answers).length;
  const everyoneAnswered = answerCount === players;

  const handleSubmit = () => {
    submitAnswer(name, currentPlayer, answer);
    setHasSubmitted(true);
  };

  useEffect(() => { setWatchGamePaused(!hasSubmitted) }, [hasSubmitted]);
  useEffect(() => {
    if (selectedPrompt && !hasSubmitted) {
      handleSubmit();
    }
  });

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
        <TextBox theme='gray' text={`The prompt is: "${prompt}"`} />
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
