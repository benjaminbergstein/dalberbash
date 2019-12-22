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
      <TextBox theme='blue' text='Create a game' marginTop='0.5em' />
      <form onSubmit={handleSubmit}>
        <Input
          autoFocus={true}
          onChange={(e) => setGame({
            ...game,
            players: 1,
            currentPlayer: 1,
            name: e.target.value.replace(' ', '-').replace(/[^-a-zA-Z1-9]/, '')
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
      <TextBox theme='gray' text='Join a game' marginTop='0.5rem' />
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
      {anyGames && (
        <GameList games={games} {...props} />
      )}
      {anyGames || (
        <TextBox theme='gray' text='There are no games currently accepting players. Create a game.' marginTop='0.5rem' />
      )}
      <CreateGame {...props} />
    </Container>
  );
};

export default StartView;
