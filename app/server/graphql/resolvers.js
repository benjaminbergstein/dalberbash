const { PubSub } = require('apollo-server');

const {
  getGames,
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

const resolveGame = (gameId, resolvedGame = undefined) => (resolvedGame || getGame(gameId)).then(({ players, ...game }) => ({
  countPlayers: players,
  name: gameId,
  ...game,
}));

const NEW_ROUND = {
  votes: {},
  answers: {},
  state: 'awaiting_prompt',
  prompt: undefined,
};

const NEW_GAME = {
  state: 'waiting',
  players: 1,
  turnPlayer: 1,
  roundTallies: [],
  round: NEW_ROUND,
};

const pubsub = new PubSub();
const GAME_UPDATED = 'GAME_UPDATED';
const GAMES_LIST = 'GAMES_LIST';

const resolveGameList = () => getGames()
  .then((games) =>
    Object.entries(games)
      .filter(([name, { state }]) => state === 'waiting')
  )
  .then((games) => games.map(([name, game]) => resolveGame(name, Promise.resolve(game))));

const publishGameList = () => resolveGameList().then((games) => pubsub.publish(GAMES_LIST, { games }));

const publishGameUpdate = (gameId) => (returnValue) => {
  resolveGame(gameId).then((gameUpdated) => {
    console.log('publishing:', gameUpdated);
    pubsub.publish([`${GAME_UPDATED}.${gameId}`], { gameUpdated });
  });
  return returnValue;
};

const setRoundState = (state) => (game) => {
  const { round } = game;
  const { votes } = round;

  return {
    ...game,
    round: {
      ...round,
      state,
    },
  };
};

const resolvers = {
  Query: {
    games: resolveGameList,
    game: (_, { gameId }) => resolveGame(gameId),
    gamePlayers: (_, { gameId }) => gamePlayers(gameId),
  },

  Mutation: {
    createGame: (_, { game }) => {
      const { name } = game;
      return new Promise((res, rej) => setGame(name, NEW_GAME)
        .then(() => publishGameList())
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
    .then(() => Promise.all([
      publishGameList(),
      publishGameUpdate(gameId)(),
      resolveGame(gameId),
    ]))
    .then(([_, __, game]) => game),

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

    calculateScores: (_, { gameId }) => calculateScores(gameId)
    .then(publishGameUpdate(gameId))
    .then(() => resolveGame(gameId)),

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

    startVoting: (_, { gameId }) => updateGame(
      gameId,
      setRoundState('voting')
    )
    .then(publishGameUpdate(gameId))
    .then(() => resolveGame(gameId)),

    startNewRound: (_, { gameId }) => updateGame(gameId, (game) => {
      const { turnPlayer, players: countPlayers } = game;
      console.log(turnPlayer, countPlayers);

      return {
        ...game,
        turnPlayer: (turnPlayer % countPlayers) + 1,
        round: NEW_ROUND,
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

    games: {
      subscribe: (_, { gameId }) => pubsub.asyncIterator(GAMES_LIST),
    }
  },
};

module.exports = resolvers;
