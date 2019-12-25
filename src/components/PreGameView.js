import React, { useState } from 'react';
import CollectionForm from './CollectionForm';
import Container from './Container';
import TextBox from './TextBox';
import Button from './Button';
import withWatchGame from '../containers/withWatchGame';
import withTrackEvent from '../containers/withTrackEvent';
import { startGame, setPlayer } from '../game';

const PreGameView = ({ game, trackEvent }) => {
  const {
    currentPlayer,
    players,
    name,
    playerNames,
  } = game;
  const [playerName, setPlayerName] = useState(`Player ${currentPlayer}`);
  const [playerNameSubmitted, setPlayerNameSubmitted] = useState(false);
  const handleClick = () => {
    trackEvent('Game', 'Start');
    trackEvent('Round', 'Start');
    startGame(name);
  };
  const handleSubmit = () => setPlayer({
    name,
    player: currentPlayer,
    playerName,
  }).then(() => {
    trackEvent('Player', 'Set Name');
    setPlayerNameSubmitted(true);
  });
  const playerNameValues = Object.values(playerNames || {});
  const unnamedPlayers = players - playerNameValues.length;

  return (
    <Container
      title={`Game "${name}"`}
      subtitle={'Waiting for players to join'}
    >
      <TextBox theme='blue' text={`${players} player(s) currently joined`} />
      {playerNameValues.map((playerName) => (
        <TextBox theme='gray' text={playerName} />
      ))}
      {unnamedPlayers > 0 && (
        <TextBox theme='gray' text={`${unnamedPlayers} unnamed players(s)`} />
      )}
      {currentPlayer === 1 && (
        <Button onClick={handleClick} text='Start!' />
      )}

      {!playerNameSubmitted && (
        <CollectionForm
          marginTop='1em'
          prompt="How do you wish to known?"
          handleSubmit={handleSubmit}
          field={playerName}
          setField={setPlayerName}
        />
      )}
      {playerNameSubmitted && (
        <TextBox
          theme='blue'
          text={`Name set to "${playerName}!`}
          marginTop='1em'
        />
      )}
    </Container>
  )
};

export default withTrackEvent(withWatchGame(PreGameView));
