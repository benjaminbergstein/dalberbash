import { gql } from 'apollo-boost';

const WATCH_GAME = gql`
subscription WatchGame($gameId: String!) {
  gameUpdated(gameId: $gameId) {
    name
    state
    countPlayers
    round {
      votes {
        player
        vote
      }
    }
    roundTallies {
      playerTallies {
        player
        points
      }
    }
    players {
      name
      player
    }
  }
}`

const CREATE_GAME = gql`
mutation CreateGame($gameInput: GameInput!) {
  createGame(game: $gameInput) {
    name
  }
}`;

const FETCH_GAME = gql`
query FetchGame($gameId: String!) {
  game(gameId: $gameId) {
    state
    name
    countPlayers
    round {
      votes {
	player
	vote
      }
    }
    roundTallies {
      playerTallies {
	player
	points
      }
    }
    players {
      name
      player
    }
  }
}`

const START_GAME = gql`
mutation StartGame($gameId: String!) {
  startGame(gameId: $gameId) {
    name
    state
  }
}`

const SET_PLAYER = gql`
mutation SetPlayer($gameId: String!, $playerInput: PlayerInput!) {
  setPlayer(gameId: $gameId, player: $playerInput) {
    player
    name
  }
}`

export {
  CREATE_GAME,
  FETCH_GAME,
  START_GAME,
  SET_PLAYER,
  WATCH_GAME,
};
