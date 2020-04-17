import React, {
  useState,
  useEffect,
} from 'react';
import Container from '../Container';
import Input from '../Input';
import TextBox from '../TextBox';
import Button from '../Button';
import withTrackEvent from '../../containers/withTrackEvent';
import {
  DEFAULT_ROUND,
  createGame,
  joinGame,
  fetchGames,
} from '../../game';

import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  GAME_LIST,
  WATCH_GAME_LIST,
  FETCH_GAME,
  CREATE_GAME,
  JOIN_GAME,
} from '../../graphql/queries';

const CreateGame = ({ game, onGameJoined }) => {
  const [createGameName, setCreateGameName] = useState('');
  const [error, setError] = useState(false);
  const [createGame, { data }] = useMutation(CREATE_GAME, {
    onCompleted: (data) => {
      onGameJoined({
        isCreator: true,
        gameId: createGameName,
        player: 1,
      });
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    if (createGameName === '') {
      setError('Please supply a name for this game');
      return;
    }

    createGame({
      variables: {
        gameInput: {
          name: createGameName,
        },
      },
    })
  };

  const sanitizeName = (name) => name
    .replace(' ', '-')
    .replace(/[^-a-zA-Z1-9]/, '');

  return (
    <div>
      <TextBox theme='blue' text='Create a game' marginTop='0.5em' />
      <form onSubmit={handleSubmit}>
        <Input
          autoFocus={true}
          onChange={(e) => {
            setError(false);
            setCreateGameName(sanitizeName(e.target.value));
          }}
          value={createGameName}
        />

        {error !== false && (
          <TextBox theme='yellow' text={error} marginTop='0.5em' />
        )}
        <Button text='Create Game' />
      </form>
    </div>
  )
};

const GameList = ({ gameId: joinGameId, games, onGameJoined }) => {
  const [joinGame, { data, called, loading }] = useMutation(JOIN_GAME);

  const isAcceptingInvitation = !!joinGameId
  const acceptInvite = () => {
    joinGame({
      variables: {
        gameId: joinGameId,
      },
      update: (cache, { data }) => {
        const { joinGame } = data;
        const { player } = joinGame;
        onGameJoined({
          isCreator: false,
          gameId: joinGameId,
          player,
        });
      },
    });
  }

  const handleClick = (name, game) => () => {
    joinGame({
      variables: {
        gameId: name,
      },
      update: (cache, { data }) => {
        const { joinGame } = data;
        const { player } = joinGame;
        onGameJoined({
          isCreator: true,
          gameId: name,
          player,
        });
      },
    });
  };

  return (
    <div>
      {isAcceptingInvitation && <>
        <TextBox theme='green' text={`You have been invited to game "${joinGameId}"`} marginTop='0.5rem' />
        <Button theme='green' text='Accept' onClick={acceptInvite} />
      </>}
      <TextBox theme='gray' text='Join a game' marginTop='0.5rem' />
      {games.map(({ name, ...game }) => (
        <Button theme='gray' text={name} onClick={handleClick(name, game)} />
      ))}
    </div>
  );
};

const StartView = (props) => {
  const { data, loading, subscribeToMore } = useQuery(GAME_LIST);
  subscribeToMore({
    document: WATCH_GAME_LIST,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const games = subscriptionData.data.games;
      return { games };
    }
  })
  const { games } = data || { games: [] };
  const anyGames = Object.keys(games).length !== 0;

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

export default withTrackEvent(StartView);
