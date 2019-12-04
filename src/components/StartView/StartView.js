import React, {
  useState,
  useEffect,
} from 'react';
import Container from '../Container';
import Input from '../Input';
import TextBox from '../TextBox';
import Button from '../Button';
import {
  DEFAULT_ROUND,
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
      round: DEFAULT_ROUND,
      roundTallies: [],
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
        <Input
          autoFocus={true}
          onChange={(e) => setGame({
            ...game,
            players: 1,
            currentPlayer: 1,
            name: e.target.value
          })}
          value={game.name}
        />
        <Button text='Create Game' />
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
      <TextBox theme='gray' text='Games to Join' marginTop='0.5rem' />
      {Object.entries(games).map(([name, game]) => (
        <Button theme='gray' text={name} onClick={handleClick(name, game)} />
      ))}
    </div>
  );
};

const StartView = (props) => {
  const [games, setGames] = useState({});
  const anyGames = Object.keys(games).length !== 0;

  useEffect(() => {
    const interval = setInterval(() => {
      fetchGames().then((res) => {
        setGames(res);
      });
    }, 1000);
    return () => { clearInterval(interval); };
  });

  return (
    <Container
      title='Dalberbash'
      subtitle='An online companion to Balderdash'
    >
      <CreateGame {...props} />
      {anyGames && (
        <GameList games={games} {...props} />
      )}
    </Container>
  );
};

export default StartView;
