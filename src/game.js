import fetch from 'isomorphic-fetch';

const HOST = 'http://dev-1.wips.link:3001';

const DEFAULT_GAME = {
  name: 'Untitled',
  players: 0,
  state: 'not_joined',
};

const DEFAULT_ROUND = {
  state: 'awaiting_prompt',
  prompt: undefined,
  answers: {},
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
  createGame,
  updateGame,
  updateRound,
  fetchGame,
  fetchGames,
  joinGame,
  startGame,
  submitAnswer,
  submitVote,
}
