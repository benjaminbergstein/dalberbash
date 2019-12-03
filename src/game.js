import fetch from 'isomorphic-fetch';

const HOST = 'http://dev-1.wips.link:3001';

const DEFAULT_GAME = {
  name: 'Untitled',
  players: 0,
  state: 'not_joined',
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

const watchGame = (game, setGame) => {
  const {
    currentPlayer,
    players,
    name,
  } = game;

  setTimeout(() => {
    fetchGame(name).then((updatedGame) => {
      setGame({
        ...updatedGame,
        currentPlayer,
      })
    });
  }, 1000);
};

export {
  DEFAULT_GAME,
  createGame,
  updateGame,
  fetchGame,
  fetchGames,
  joinGame,
  startGame,
  submitAnswer,
  submitVote,
  watchGame,
}
