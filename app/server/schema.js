const { gql } = require('apollo-server');
const {
  getGames,
  getGame,
  getPlayers,
} = require('./db/game.js');

const typeDefs = gql`
  type Game {
    name: String!
    state: String!
    round: Round!
    turnPlayer: Int
    roundTallies: [RoundTally]!
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
`

const gamePlayers = (gameId) => getPlayers(gameId)
  .then((gamePlayers) =>
    Object.entries(gamePlayers)
      .map(([player, name]) => ({ player, name })))

const resolvers = {
  Query: {
    games: () => getGames().then(
      (games) => {
        console.log(Object.values(games)[0]);
        return Object.values(games);
      }
    ),
    game: (_, { gameId }) => getGame(gameId),
    gamePlayers: (_, { gameId }) => gamePlayers(gameId),
  },
  Game: {
    players: ({ name }) => gamePlayers(name),
    roundTallies: ({ roundTallies }) => (roundTallies || []).map((roundTally, round) => ({
      round,
      playerTallies: Object.entries(roundTally)
        .map(([player, points]) => ({ player, points }))
    })),
  },
  Round: {
    answers: ({ answers }) => Object.entries(answers).map(([player, answer]) => ({ player, answer })),
    voteOptions: ({ voteOptions }) => (voteOptions || []).map(([player, answer]) => ({ player, answer })),
    votes: ({ votes }) => Object.entries(votes || {}).map(([player, vote]) => ({ player, vote })),
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
