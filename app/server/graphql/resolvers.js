const { PubSub } = require('apollo-server');

const {
  setGame,
  updateGame,
  getGameIds,
  getGame,
  getPlayers,
  setPlayer,
} = require('../db/game.js');

const calculateScores = require('./resolvers/calculateScores');

const gamePlayers = (gameId) => getPlayers(gameId)
  .then((gamePlayers) =>
    Object.entries(gamePlayers || {})
      .map(([player, name]) => ({ player, name })))

const resolveGame = (gameId) => getGame(gameId).then(({ players, ...game }) => ({
  countPlayers: players,
  name: gameId,
  ...game,
}));

const NEW_GAME = {
  state: 'waiting',
  players: 1,
  round: {
    votes: {},
  },
};

const pubsub = new PubSub();
const GAME_UPDATED = 'GAME_UPDATED';

const publishGameUpdate = (gameId) => (returnValue) => {
  resolveGame(gameId).then((gameUpdated) => {
    pubsub.publish([`${GAME_UPDATED}.${gameId}`], { gameUpdated });
  });
  return returnValue;
};

const resolvers = {
  Query: {
    games: () => getGameIds().then((gameIds) =>
      Promise.all(gameIds.map((gameId) => {
        const [_, key] = gameId.split(':');
        return resolveGame(key);
      }))
    ),
    game: (_, { gameId }) => resolveGame(gameId),
    gamePlayers: (_, { gameId }) => gamePlayers(gameId),
  },

  Mutation: {
    createGame: (_, { game }) => {
      const { name } = game;
      return new Promise((res, rej) => setGame(name, NEW_GAME)
        .then(() => res(resolveGame(name))));
    },

    startGame: (_, { gameId }) => updateGame(gameId, (game) => {
      return {
        ...game,
        state: "playing",
        round: {
          state: "awaiting_prompt",
          answers: {},
        },
      };
    })
    .then(publishGameUpdate(gameId))
    .then(() => resolveGame(gameId)),

    setPrompt: (_, { gameId, prompt }) => updateGame(gameId, (game) => {
      const { round } = prompt;
      return {
        ...game,
        round: {
          prompt,
          state: 'awaiting_answers',
        },
      };
    })
    .then(publishGameUpdate(gameId))
    .then(() => resolveGame(gameId)),

    setPlayer: (_, { gameId, player }) => {
      const { player: playerNumber,  name } = player;
      return setPlayer(gameId, playerNumber, name)
        .then(publishGameUpdate(gameId))
        .then(() => player);
    },

    joinGame: (_, { gameId }) => getGame(gameId).then((game) => {
      const { players } = game;
      const currentPlayer = players + 1;
      const updatedGame = {
        ...game,
        players: currentPlayer,
      };

      return setGame(gameId, updatedGame)
        .then(publishGameUpdate(gameId))
        .then(() => ({
          player: currentPlayer,
        }))
    }),

    calculateScores,

    submitAnswer: (_, { gameId, answer }) => updateGame(gameId, (game) => {
      const { player, answer: playerAnswer } = answer;
      const { round } = game;
      const { answers } = round;
      return {
        ...game,
        round: {
          ...round,
          answers: {
            ...answers,
            [player]: playerAnswer,
          },
        },
      };
    })
    .then(publishGameUpdate(gameId))
    .then(() => resolveGame(gameId)),

    submitVote: (_, { gameId, vote }) => updateGame(gameId, (game) => {
      const { round } = game;
      const { votes } = round;
      const { player, vote: votedPlayer } = vote;

      return {
        ...game,
        round: {
          ...round,
          votes: {
            ...votes,
            [player]: votedPlayer,
          },
        },
      };
    })
    .then(publishGameUpdate(gameId))
    .then(() => vote),
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
    answers: ({ answers }) => Object.entries(answers || {}).map(([player, answer]) => ({ player, answer })),
    voteOptions: ({ voteOptions }) => (voteOptions || []).map(([player, answer]) => ({ player, answer })),
    votes: ({ votes }) => Object.entries(votes || {}).map(([player, vote]) => ({ player, vote })),
  },

  Subscription: {
    gameUpdated: {
      subscribe: (_, { gameId }) => pubsub.asyncIterator(`${GAME_UPDATED}.${gameId}`),
    },
  },
};

module.exports = resolvers;
