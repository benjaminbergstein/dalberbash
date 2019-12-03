import React, {
  useState,
  useEffect,
} from 'react';
import {
  createGame,
  joinGame,
  fetchGames,
} from '../../game';

const CreateGame = ({ game, setGame }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedGame = {
      ...game,
      turnPlayer: 1,
      round: {
        state: 'awaiting_prompt',
        prompt: undefined,
        answers: {},
      },
      state: 'waiting',
    };
    createGame(updatedGame)
      .then(() => {
        const { name, currentPlayer } = updatedGame;
        window.location.hash = `${name}.${currentPlayer}`;
        setGame(updatedGame);
      })
      .catch(() => {});
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          autofocus="autofocus"
          type="text"
          onChange={(e) => setGame({
            ...game,
            players: 1,
            currentPlayer: 1,
            name: e.target.value
          })}
        />
        <button>Create Game</button>
      </form>
    </div>
  )
};

const GameList = ({ games, setGame }) => {
  const handleClick = (name, game) => () => {
    joinGame(name, game).then((serverGame) => {
      const { name, currentPlayer } = serverGame;
      window.location.hash = `${name}.${currentPlayer}`;
      setGame(serverGame);
    });
  };

  return (
    <div>
      {Object.entries(games).map(([name, game]) => (
        <div>
          {name}
          <button onClick={handleClick(name, game)}>Join</button>
        </div>
      ))}
    </div>
  );
};

const StartView = (props) => {
  const [games, setGames] = useState({});
  const anyGames = Object.keys(games).length !== 0;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!anyGames) fetchGames().then((res) => {
        setGames(res);
      });
    }, 1000);
    return () => { clearInterval(interval); };
  });

  return (
    <div>
      <CreateGame {...props} />
      {anyGames && (
        <GameList games={games} {...props} />
      )}
    </div>
  );
};

export default StartView;
