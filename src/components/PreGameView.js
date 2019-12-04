import React from 'react';
import Container from './Container';
import TextBox from './TextBox';
import Button from './Button';
import withWatchGame from '../containers/withWatchGame';
import { startGame } from '../game';

const PreGameView = ({ game }) => {
  const {
    currentPlayer,
    players,
    name,
  } = game;

  const handleClick = () => startGame(name);

  return (
    <Container
      title={`Game "${name}"`}
      subtitle={'Waiting for players to join'}
    >
      <TextBox theme='gray' text={`${players} player(s) currently joined`} />
      {currentPlayer === 1 && (
        <Button onClick={handleClick} text='Start!' />
      )}
    </Container>
  )
};

export default withWatchGame(PreGameView);
