import React, { useState, useMemo } from 'react';
import Button from '../Button';
import TextBox from '../TextBox';
import { useMutation } from '@apollo/react-hooks';
import { SUBMIT_VOTE, END_VOTING } from '../../graphql/queries';
import { shuffle } from '../../utilities';

const Voting = ({
  game,
  currentPlayer,
  WhenMyTurn,
  WhenNotMyTurn,
}) => {
  const { name: gameId, round, countPlayers } = game;
  const { answers, votes } = round;

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

  const [endVoting] = useMutation(END_VOTING, {
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
          <Button onClick={endVoting} text='End Voting' />
        )}
      </WhenMyTurn>

      <WhenNotMyTurn>
        {voteSubmitted && (
          <TextBox theme='green' text='Waiting for other players...' />
        )}
        {!voteSubmitted && (
          <div>
          <TextBox theme='gray' text='Which answer is real?' />
            {voteOptions.map(([player, answer]) => (
              <Button
                theme={vote === player ? 'green' : 'lightgray'}
                onClick={() => {
                  setError(false)
                  setVote(player)
                }}
                text={answer}
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
