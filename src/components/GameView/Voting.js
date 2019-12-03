import React, { useState } from 'react';
import {
  updateRound,
  submitVote,
} from '../../game';

const Voting = ({
  game,
  WhenMyTurn,
  WhenNotMyTurn,
}) => {
  const [vote, setVote] = useState(-1);
  const { name, round, currentPlayer, players } = game;
  const { voteOptions, votes } = round;

  const voteCount = Object.entries(votes).length;
  const everyoneVoted = voteCount === players - 1;

  const handleClick = () => {
    updateRound(game, round, { state: 'scoring' });
  };

  return (
    <>
      <WhenMyTurn>
        <div>Waiting for everyone to vote</div>
        <div>{voteCount} vote(s)</div>
        {everyoneVoted && (
          <button onClick={handleClick}>Finish Voting</button>
        )}
      </WhenMyTurn>

      <WhenNotMyTurn>
        <div>
          {voteOptions.map(([player, answer]) => (
            <div>
              <label>
                <input type="radio" checked={vote === player} onChange={() => setVote(player)} />
                {answer}
              </label>
            </div>
          ))}
          <button onClick={() => submitVote(name, currentPlayer, vote)}>Submit</button>
        </div>
      </WhenNotMyTurn>
    </>
  );
};

export default Voting;
