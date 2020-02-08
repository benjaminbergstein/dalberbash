import { gql } from 'apollo-boost';

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

export {
  CREATE_GAME,
  FETCH_GAME,
};
