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
  const [vote, setVote] = useState(-1);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const { name, round, currentPlayer, players } = game;
  const { voteOptions, votes } = round;

  const voteCount = Object.entries(votes).length;
  const everyoneVoted = voteCount === players - 1;

  const handleClick = () => {
    updateRound(game, round, { state: 'scoring' });
  };

  const handleVoteSubmit = () => {
    submitVote(name, currentPlayer, vote);
    setVoteSubmitted(true);
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
        <TextBox theme='gray' text='Which answer is real?' />
        {voteSubmitted && (
          <TextBox theme='green' text='Waiting for other players...' />
        )}
        <div>
          {voteOptions.map(([player, answer]) => (
            <Button
              theme={vote === player ? 'green' : 'lightgray'}
              onClick={() => setVote(player)}
              text={answer}
            />
          ))}
          <Button onClick={handleVoteSubmit} text='Submit' />
        </div>
      </WhenNotMyTurn>
    </>
  );
};

export default Voting;
