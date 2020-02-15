import { gql } from 'apollo-boost';

const GAME_LIST = gql`
query GameList {
  games {
    name
  }
}`

const WATCH_GAME_LIST = gql`
subscription GameList {
  games {
    name
  }
}`

const GAME_ATTRIBUTES = gql`
fragment GameAttributes on Game {
  name
  state
  countPlayers
  turnPlayer
  round {
    state
    prompt
    votes {
      player
      vote
    }
    answers {
      player
      answer
    }
    answerOrder
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

${GAME_ATTRIBUTES}`;

const START_GAME = gql`
mutation StartGame($gameId: String!) {
  startGame(gameId: $gameId) {
    name
    state
  }
}`;

const SET_PLAYER = gql`
mutation SetPlayer($gameId: String!, $playerInput: PlayerInput!) {
  setPlayer(gameId: $gameId, player: $playerInput) {
    player
    name
  }
}`;

const SUBMIT_PROMPT = gql`
mutation SubmitPrompt($gameId: String!, $prompt: String!) {
  setPrompt(gameId: $gameId, prompt: $prompt) {
    name
  }
}`;

const SUBMIT_ANSWER = gql`
mutation SubmitAnswer($gameId: String!, $answerInput: AnswerInput!) {
  submitAnswer(gameId: $gameId, answer: $answerInput) {
    name
  }
}`;

const START_VOTING = gql`
mutation StartVoting($gameId: String!) {
  startVoting(gameId: $gameId) {
    name
    state
  }
}`;

const SUBMIT_VOTE = gql`
mutation SubmitVote($gameId: String!, $voteInput: VoteInput!) {
  submitVote(gameId: $gameId, vote: $voteInput) {
    player
    vote
  }
}`;

const CALCULATE_SCORES = gql`
mutation CalculateScores($gameId: String!) {
  calculateScores(gameId: $gameId) {
    name
    roundTallies {
      playerTallies {
        player
        points
      }
    }
  }
}`

const START_NEW_ROUND = gql`
mutation StartNewRound($gameId: String!) {
  startNewRound(gameId: $gameId) {
    name
    state
  }
}`;

export {
  GAME_LIST,
  WATCH_GAME_LIST,
  CREATE_GAME,
  FETCH_GAME,
  JOIN_GAME,
  START_GAME,
  SET_PLAYER,
  WATCH_GAME,
  SUBMIT_PROMPT,
  SUBMIT_ANSWER,
  START_VOTING,
  SUBMIT_VOTE,
  CALCULATE_SCORES,
  START_NEW_ROUND,
};
