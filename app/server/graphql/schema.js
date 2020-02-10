const { gql } = require('apollo-server');

const typeDefs = gql`
  type Game {
    name: String!
    state: String!
    round: Round!
    turnPlayer: Int
    roundTallies: [RoundTally]!
    countPlayers: Int
    players: [Player]!
  }

  type Round {
    state: String
    prompt: String
    answers: [Answer]!
    voteOptions: [VoteOption]!
    votes: [Vote]!
  }

  type VoteOption {
    player: Int
    answer: String
  }

  type Vote {
    player: Int
    vote: Int
  }

  type RoundTally {
    round: Int
    playerTallies: [PlayerTally]
  }

  type PlayerTally {
    player: Int
    points: Int
  }

  type Player {
    player: Int
    name: String
  }

  type Answer {
    player: Int!
    answer: String!
  }

  type Query {
    games: [Game]!
    game(gameId: String!): Game
    gamePlayers(gameId: String!): [Player]!
  }

  input GameInput {
    name: String!
  }

  input PlayerInput {
    player: Int!
    name: String!
  }

  input VoteInput  {
    player: Int!
    vote: Int!
  }

  input AnswerInput {
    player: Int!
    answer: String!
  }

  type Mutation {
    createGame(game: GameInput!): Game
    setPlayer(gameId: String!, player: PlayerInput!): Player
    startGame(gameId: String!): Game
    joinGame(gameId: String!): Player
    setPrompt(gameId: String!, prompt: String!): Game
    submitAnswer(gameId: String!, answer: AnswerInput!): Game
    startVoting(gameId: String!): Game
    submitVote(gameId: String!, vote: VoteInput!): Vote
    calculateScores(gameId: String!): Game
    startNewRound(gameId: String!): Game
  }

  type Subscription {
    gameUpdated(gameId: String!): Game
  }
`

module.exports = typeDefs;
