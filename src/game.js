import fetch from 'isomorphic-fetch';

const HOST = process.env.REACT_APP_HOST;
const WEBSOCKET_HOST = HOST.replace('http', 'ws');

const DEFAULT_GAME = {
  name: '',
  players: 0,
  state: 'not_joined',
};

const DEFAULT_ROUND = {
  state: 'awaiting_prompt',
  prompt: undefined,
  answers: {},
};

const webSockets = {};
const getWebSocket = (gameId) => {
  if (!webSockets[gameId]) {
    webSockets[gameId] = new WebSocket(`${WEBSOCKET_HOST}/sub/games/${gameId}`);
  }
  return webSockets[gameId];
};

const resetWebSocket = (gameId) => {
  webSockets[gameId] = undefined;
};

const fetchGames = () => fetch(`${HOST}/games`).then((res) => res.json());
const fetchGame = (name) => fetch(`${HOST}/games/${name}`).then((res) => res.json());

const createGame = ({ name, ...game }) => fetch(`${HOST}/games/${name}`, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(game),
});
const updateGame = createGame;
const updateRound = (game, round, updates) => {
  const updatedGame = {
    ...game,
    round: {
      ...round,
      ...updates
    },
  };

  updateGame(updatedGame);
}

const joinGame = (name) => fetch(`${HOST}/join`, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name }),
}).then((res) => res.json());

const setPlayer = ({ player, playerName, name }) => fetch(`${HOST}/players`, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ player, playerName, name }),
});

const startGame = (name) => fetch(`${HOST}/start`, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name }),
});

const submitAnswer = (name, player, answer) => fetch(`${HOST}/answer`, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name, player, answer }),
});

const submitVote = (name, player, vote) => fetch(`${HOST}/vote`, {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name, player, vote }),
});

export {
  DEFAULT_GAME,
  DEFAULT_ROUND,
  getWebSocket,
  resetWebSocket,
  createGame,
  setPlayer,
  updateGame,
  updateRound,
  fetchGame,
  fetchGames,
  joinGame,
  startGame,
  submitAnswer,
  submitVote,
}
