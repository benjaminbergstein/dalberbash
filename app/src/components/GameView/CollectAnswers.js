import React, { useState, useEffect } from 'react';
import CollectionForm from '../CollectionForm';
import Button from '../Button';
import TextBox from '../TextBox';
import { useMutation } from '@apollo/react-hooks';
import { SUBMIT_ANSWER, START_VOTING } from '../../graphql/queries';
import { shuffle } from '../../utilities';

const CollectAnswers = ({
  game,
  currentPlayer,
  selectedPrompt,
  WhenMyTurn,
  WhenNotMyTurn
}) => {
  const {
    name: gameId,
    countPlayers,
    turnPlayer,
    players,
    round,
  } = game;
  const [answer, setAnswer] = useState(selectedPrompt ? selectedPrompt[2] : '');
  const [submitAnswer, { called: hasSubmitted }] = useMutation(SUBMIT_ANSWER, {
    variables: {
      gameId,
      answerInput: {
        player: currentPlayer,
        answer,
      },
    },
  })

  const { prompt, answers } = round;
  const answerCount = answers.length;
  const everyoneAnswered = answerCount === countPlayers;
  const hasCurrentPlayerAnswered = answers.some(({ player }) => player === currentPlayer) || hasSubmitted;

  useEffect(() => {
    if (selectedPrompt) {
      submitAnswer();
    }
  });

  const [startVoting] = useMutation(START_VOTING, {
    variables: { gameId },
  });

  return (
    <>
      <WhenMyTurn>
        {!hasCurrentPlayerAnswered && (
          <CollectionForm
            prompt="What's the real answer?"
            handleSubmit={submitAnswer}
            field={answer}
            setField={setAnswer}
          />
        )}
        {hasCurrentPlayerAnswered && (
          <>
            <TextBox theme='gray' text={`${answerCount} answer(s)`} />
            {answers.map(({ answer }) => (
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
        {!hasCurrentPlayerAnswered && (
          <CollectionForm
            prompt="What's your answer?"
            handleSubmit={submitAnswer}
            field={answer}
            setField={setAnswer}
          />
        )}
        {hasCurrentPlayerAnswered && (
          <TextBox theme='green' text='Waiting for other players...' />
        )}
      </WhenNotMyTurn>
    </>
  );
};

export default CollectAnswers;
