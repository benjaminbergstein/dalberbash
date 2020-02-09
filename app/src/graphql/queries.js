import { gql } from 'apollo-boost';

const GAME_ATTRIBUTES = gql`
fragment GameAttributes on Game {
  name
  state
  countPlayers
  turnPlayer
  round {
    state
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
`
const WATCH_GAME = gql`
subscription WatchGame($gameId: String!) {
  gameUpdated(gameId: $gameId) {
    ...GameAttributes
  }
}

${GAME_ATTRIBUTES}`

const JOIN_GAME = gql`
mutation JoinGame($gameId: String!) {
  joinGame(gameId: $gameId) {
    player
  }
}`;

const CREATE_GAME = gql`
mutation CreateGame($gameInput: GameInput!) {
  createGame(game: $gameInput) {
    name
  }
}`;

const FETCH_GAME = gql`
query FetchGame($gameId: String!) {
  game(gameId: $gameId) {
    ...GameAttributes
  }
}

${GAME_ATTRIBUTES}`

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
  JOIN_GAME,
  START_GAME,
  SET_PLAYER,
  WATCH_GAME,
};
