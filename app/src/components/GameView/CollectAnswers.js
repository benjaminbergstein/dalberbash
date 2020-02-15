import React, { useState, useEffect, useRef, memo } from 'react';
import CollectionForm from '../CollectionForm';
import Button from '../Button';
import TextBox from '../TextBox';
import { useMutation } from '@apollo/react-hooks';
import { SUBMIT_ANSWER, START_VOTING } from '../../graphql/queries';
import turnHelper from './turnHelper';
import useGame from '../../hooks/useGame';

const AnswerSubmitted = ({ currentPlayer, gameId }) => {
  const { game, subscribe } = useGame(gameId);
  subscribe();

  const { WhenMyTurn, WhenNotMyTurn } = turnHelper(currentPlayer, game);
  const { round, countPlayers } = game;
  const { prompt, answers, answerOrder } = round;
  const answerCount = answers.length;
  const everyoneAnswered = answerCount === countPlayers;

  const [startVoting] = useMutation(START_VOTING, {
    variables: { gameId },
  });

  const orderedAnswers = answerOrder.map((answerer) =>
    (answers || {}).find(({ player }) => answerer === parseInt(player)) || { answer: "(no answer yet)" });

  return <>
    <WhenMyTurn>
      {everyoneAnswered && (
        <TextBox theme='yellow' text='Everyone has answered. Now, read each option aloud to the group.' />
      )}
      {!everyoneAnswered && (
        <TextBox theme='gray' text={`${answerCount} player(s) have answered`} />
      )}
      {orderedAnswers.map(({ answer }, i) => (
        <TextBox theme='green' text={`${i+1}: ${answer}`} />
      ))}
      {everyoneAnswered && (
        <Button onClick={startVoting} text='Proceed to Vote' />
      )}
    </WhenMyTurn>

    <WhenNotMyTurn>
      {everyoneAnswered && (
        <TextBox theme='yellow' text='Listen to each answer. Which one sounds like the real one?' />
      )}
      {!everyoneAnswered && (
        <TextBox theme='green' text='Waiting for other players...' />
      )}
    </WhenNotMyTurn>
  </>;
};

const AnswerForm = ({
  currentPlayer,
  gameId,
  selectedPrompt,
  onSubmit,
}) => {
  const { game } = useGame(gameId);
  const { round } = game;
  const { prompt } = round;
  const { WhenNotMyTurn, isMyTurn } = turnHelper(currentPlayer, game);

  const answer = useRef(selectedPrompt ? selectedPrompt[2] : '');
  const setAnswer = (newAnswer) => { answer.current = newAnswer };

  const [submitAnswer, { called: hasSubmitted }] = useMutation(SUBMIT_ANSWER, {
    variables: {
      gameId,
      answerInput: {
        player: currentPlayer,
        answer: answer.current,
      },
    },
  });

  useEffect(() => {
    if (selectedPrompt) {
      submitAnswer();
      onSubmit();
    }
  });

  return (
    <>
      <WhenNotMyTurn>
        <TextBox theme='gray' text={`The prompt is: "${prompt}"`} />
      </WhenNotMyTurn>

      <CollectionForm
        prompt={isMyTurn ? "What's the real answer?" : "What's your answer?"}
        handleSubmit={() => {
          submitAnswer({
            variables: {
              gameId,
              answerInput: {
                player: currentPlayer,
                answer: answer.current,
              },
            },
          });
          onSubmit();
        }}
        field={answer.current}
        setField={setAnswer}
      />
    </>
  );
};

const CollectAnswers = ({
  gameId,
  currentPlayer,
  selectedPrompt,
}) => {
  const { game } = useGame(gameId);
  const { round } = game;
  const { answers } = round;

  const [hasCurrentPlayerAnswered, setHasCurrentPlayerAnswered] = useState(
    answers.some(({ player }) => player === currentPlayer)
  );

  if (hasCurrentPlayerAnswered) {
    return <AnswerSubmitted
      gameId={gameId}
      currentPlayer={currentPlayer}
    />;
  } else {
    return <AnswerForm
      gameId={gameId}
      currentPlayer={currentPlayer}
      selectedPrompt={selectedPrompt}
      onSubmit={() => setHasCurrentPlayerAnswered(true)}
    />;
  }
};

export default CollectAnswers;
