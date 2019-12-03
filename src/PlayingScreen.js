import React, { useState } from 'react';
import {
  updateGame,
  watchGame,
  submitAnswer,
  submitVote,
} from './game';

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const CollectionForm = ({ prompt, field, setField, handleSubmit }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div>
      <div>{prompt}</div>
      <form onSubmit={onSubmit}>
        <textarea onChange={(e) => setField(e.target.value)}>{field}</textarea>
        <button>Submit</button>
      </form>
    </div>
  )
};

const SubmitPrompt = ({ game, setGame }) => {
  const [prompt, setPrompt] = useState('');
  const { round } = game;
  const handleSubmit = () => {
    const updatedGame = {
      ...game,
      round: {
        ...round,
        prompt,
        state: 'awaiting_answers',
      },
    };
    updateGame(updatedGame);
  };

  return (
    <div>
      <div>It's your turn</div>
      <CollectionForm
        prompt="What's the prompt?"
        handleSubmit={handleSubmit}
        field={prompt}
        setField={setPrompt}
      />
    </div>
  )
};

const AwaitingPrompt = ({ game, setGame, isMyTurn }) => {
  const { turnPlayer } = game;

  return (
    <>
      {isMyTurn && (
        <SubmitPrompt game={game} setGame={setGame} />
      )}
      {!isMyTurn && (
        <div>It's player {turnPlayer}'s turn</div>
      )}
    </>
  );
};

const CollectAnswers = ({ game, setGame, isMyTurn }) => {
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
      {isMyTurn && (
        <>
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
        </>
      )}

      {!isMyTurn && (
        <>
          <div>The prompt is:</div>
          <div>{prompt}</div>
          <CollectionForm
            prompt="What's your answer?"
            handleSubmit={handleSubmit}
            field={answer}
            setField={setAnswer}
          />
        </>
      )}
    </>
  );
};

const Voting = ({ game, isMyTurn }) => {
  const [vote, setVote] = useState(-1);
  const { name, round, currentPlayer, players } = game;
  const { voteOptions, votes } = round;

  const voteCount = Object.entries(votes).length;
  const everyoneVoted = voteCount === players - 1;

  const handleClick = () => {
    updateGame({
      ...game,
      round: {
        ...round,
        state: 'scoring',
      },
    })
  };

  return (
    <>
      {isMyTurn && (
        <>
          <div>Waiting for everyone to vote</div>
          <div>{voteCount} vote(s)</div>
          {everyoneVoted && (
            <button onClick={handleClick}>Finish Voting</button>
          )}
        </>
      )}
      {!isMyTurn && (
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
      )}
    </>
  );
};

const Scoring = ({ game }) => {
  const { name, round, currentPlayer, players, turnPlayer } = game;
  const { answers, voteOptions, votes } = round;

  const isTurnPlayer = (player) => {
    return parseInt(player) === turnPlayer;
  };
  const votesFor = (player) => {
    return Object.values(votes).reduce((count, answerNumber) => {
      return player === answerNumber ? count + 1 : count;
    }, 0);
  };

  const pointsForPlayer = (player) => {
    if (isTurnPlayer(player)) {
      return votesFor(player) === 0 ? 2 : 0
    } else {
      const correctAnswer = votes[player] === turnPlayer;
      return (correctAnswer ? 2 : 0) + votesFor(player);
    }
  };

  const points = Object.entries(answers).reduce((totals, [player]) => {
    return { ...totals, [player]: pointsForPlayer(player) };
  }, {});

  return (
    <table>
      <tr>
        <th>Player</th>
        <th>Answer</th>
        <th></th>
        <th>Points</th>
        <th>Votes</th>
      </tr>

      {Object.entries(points).map(([player, points]) => {
        return (
          <tr>
            <td>{player}</td>
            <td>{answers[player]}</td>
            <td>{isTurnPlayer(player) ? '(real)' : ''}</td>
            <td>{points}</td>
            <td>{votesFor(player)}</td>
          </tr>
        );
      })}
    </table>
  );
};

const ROUND_COMPONENTS = {
  awaiting_prompt: AwaitingPrompt,
  awaiting_answers: CollectAnswers,
  voting: Voting,
  scoring: Scoring,
};

const PlayingScreen = ({ game, setGame }) => {
  const {
    currentPlayer,
    turnPlayer,
    round,
  } = game;

  const isMyTurn = turnPlayer === currentPlayer;
  const Component = ROUND_COMPONENTS[round.state];
  watchGame(game, setGame);

  return (
    <div>
      <h1>{game.name}</h1>
      <div>You are player {currentPlayer}</div>
      <Component
        game={game}
        setGame={setGame}
        isMyTurn={isMyTurn}
      />
    </div>
  );
};

export default PlayingScreen;
