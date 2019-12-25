import React, { useState } from 'react';
import {
  updateRound,
  submitVote,
} from '../../game';
import Button from '../Button';
import TextBox from '../TextBox';

const Voting = ({
  game,
  WhenMyTurn,
  WhenNotMyTurn,
}) => {
  const { name, round, currentPlayer, players } = game;
  const { voteOptions, votes } = round;
  const serverVote = votes[''+currentPlayer];
  const [error, setError] = useState(false);
  const [vote, setVote] = useState(-1);
  const [voteSubmitted, setVoteSubmitted] = useState(serverVote || false);

  const voteCount = Object.entries(votes).length;
  const everyoneVoted = voteCount === players - 1;

  const handleClick = () => {
    updateRound(game, round, { state: 'scoring' });
  };

  const handleVoteSubmit = () => {
    if (vote === -1) {
      setError('Vote for one of the above options by clicking it.');
    } else {
      submitVote(name, currentPlayer, vote);
      setVoteSubmitted(true);
    }
  };

  return (
    <>
      <WhenMyTurn>
        <TextBox theme='gray' text='Waiting for everyone to vote' />
        <TextBox theme='green' text={`${voteCount} vote(s)`} />
        {everyoneVoted && (
          <Button onClick={handleClick} text='End Voting' />
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
