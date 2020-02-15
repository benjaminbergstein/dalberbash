import React, { useState, useMemo } from 'react';
import Button from '../Button';
import TextBox from '../TextBox';
import { useMutation } from '@apollo/react-hooks';
import { SUBMIT_VOTE, CALCULATE_SCORES } from '../../graphql/queries';
import { shuffle } from '../../utilities';
import turnHelper from './turnHelper';
import useGame from '../../hooks/useGame';
import stopWords from './stopWords.json';

const STOP_WORDS = stopWords;

const hintFor = (answer) => {
  const words = answer.toLowerCase()
    .replace(/[^a-z ]/g, '')
    .split(' ');

  const longestWords = words
    .filter((word) => STOP_WORDS.indexOf(word) === -1)
    .sort((a, b) => b.length - a.length)
    .slice(0, 5);

  return words.filter((word) =>
    longestWords.indexOf(word) !== -1).join(', ');
};

const VoteOption = ({
  answerNumber,
  currentPlayer,
  vote,
  player,
  answer,
  onClick,
}) => {
  const isCurrentPlayerAnswer = parseInt(player) === currentPlayer;
  const theme = isCurrentPlayerAnswer ? 'lightgray' :
    (vote === player ? 'green' : 'yellow');

  const answerHint = hintFor(answer);
  return (
    <Button
      disabled={isCurrentPlayerAnswer}
      theme={theme}
      onClick={onClick}
      text={`${answerNumber + 1}: ${answerHint}${isCurrentPlayerAnswer ? ' (your answer)' : ''}`}
    />
  );
};

const Voting = ({
  gameId,
  currentPlayer,
}) => {
  const { game, subscribe } = useGame(gameId);
  subscribe();

  const { WhenMyTurn, WhenNotMyTurn } = turnHelper(currentPlayer, game);

  const { round, countPlayers } = game;
  const { prompt, answers, votes, answerOrder } = round;
  const orderedAnswers = answerOrder.map((answerer) =>
    (answers || {}).find(({ player }) => answerer === parseInt(player)));

  const [error, setError] = useState(false);
  const [vote, setVote] = useState(-1);

  const [submitVote, { called: voteSubmitted }] = useMutation(SUBMIT_VOTE, {
    variables: {
      gameId,
      voteInput: {
        player: currentPlayer,
        vote,
      },
    },
  });

  const hasPlayerVoted = voteSubmitted || votes.some(({ player }) => player === currentPlayer);

  const [calculateScores] = useMutation(CALCULATE_SCORES, {
    variables: { gameId },
  });

  const [voteOptions] = useState(shuffle(answers).map(({ player, answer }) => [player, answer]));

  const voteCount = votes.length;
  const everyoneVoted = voteCount === countPlayers - 1;

  const handleVoteSubmit = () => {
    if (vote === -1) {
      setError('Vote for one of the above options by clicking it.');
    } else {
      submitVote();
    }
  };

  return (
    <>
      <WhenMyTurn>
        <TextBox theme='gray' text='Waiting for everyone to vote' />
        <TextBox theme='green' text={`${voteCount} vote(s)`} />
        {everyoneVoted && (
          <Button onClick={calculateScores} text='End Voting' />
        )}
      </WhenMyTurn>

      <WhenNotMyTurn>
        {voteSubmitted && (
          <TextBox theme='green' text='Waiting for other players...' />
        )}
        {!voteSubmitted && (
          <div>
          <TextBox theme='gray' text={`Prompt: ${prompt}`} />
          <TextBox theme='gray' text='Which answer is real?' />
            {orderedAnswers.map(({ player, answer }, i) => (
              <VoteOption
                answerNumber={i}
                vote={vote}
                player={player}
                answer={answer}
                currentPlayer={currentPlayer}
                onClick={() => {
                  setError(false)
                  setVote(player)
                }}
              />
            ))}
            {error !== false && (
              <TextBox theme='yellow' text={error} marginTop='0.5em' />
            )}
            <Button onClick={handleVoteSubmit} text='Submit' />
          </div>
        )}
      </WhenNotMyTurn>
    </>
  );
};

export default Voting;
