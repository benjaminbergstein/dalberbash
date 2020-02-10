import React, { useState, useContext, useRef } from 'react';
import CollectionForm from './CollectionForm';
import Container from './Container';
import TextBox from './TextBox';
import Button from './Button';
import withTrackEvent from '../containers/withTrackEvent';
import { useMutation } from '@apollo/react-hooks';
import { START_GAME, SET_PLAYER } from '../graphql/queries';
import useGame from '../hooks/useGame';

const PreGameView = ({
  gameId,
  currentPlayer,
  trackEvent
}) => {
  const { game, subscribe } = useGame(gameId);
  subscribe();
  const {
    countPlayers,
    name,
    players,
  } = game;

  const currentPlayerDetails = players.find(({ player }) => parseInt(player) === parseInt(currentPlayer));
  const { name: currentPlayerName } =  currentPlayerDetails || {};

  const playerNames = players.map(({ name }) => name);
  const [playerName, setPlayerName] = useState(currentPlayerDetails ? currentPlayerName : `Player ${currentPlayer}`);

  const [setPlayer, { called: playerNameSubmitted }] = useMutation(SET_PLAYER, {
    onComplete: () => trackEvent('Player', 'Set Name'),
    variables: {
      gameId: name,
      playerInput: {
        player: parseInt(currentPlayer),
        name: playerName,
      }
    }
  });
  const playerNameSet = playerNameSubmitted || currentPlayerDetails;

  const [startGame, { called: gameStarted }] = useMutation(START_GAME, {
    variables: {
      gameId: name,
    },
  });

  const handleClick = () => {
    trackEvent('Game', 'Start');
    trackEvent('Round', 'Start');
    startGame(name);
  };
  const playerNameValues = Object.values(playerNames || {});
  const unnamedPlayers = players - playerNameValues.length;

  return (
    <Container
      title={`Game "${name}"`}
      subtitle={'Waiting for players to join'}
    >
      <TextBox theme='blue' text={`${countPlayers} player(s) currently joined`} />
      {playerNameValues.map((playerName) => (
        <TextBox theme='gray' text={playerName} />
      ))}
      {unnamedPlayers > 0 && (
        <TextBox theme='gray' text={`${unnamedPlayers} unnamed players(s)`} />
      )}
      {currentPlayer === 1 && (
        <Button onClick={startGame} text='Start!' />
      )}

      {!playerNameSet && (
        <CollectionForm
          marginTop='1em'
          prompt="How do you wish to known?"
          handleSubmit={setPlayer}
          field={playerName}
          setField={setPlayerName}
        />
      )}
      {playerNameSet && (
        <TextBox
          theme='blue'
          text={`Name set to "${playerName}!`}
          marginTop='1em'
        />
      )}
    </Container>
  )
};

export default withTrackEvent(PreGameView);
