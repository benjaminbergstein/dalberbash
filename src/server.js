const express = require('express');
const bodyParser = require('body-parser');
const cors= require('cors');
const app = express();

const EXTRACT_GAME_ID = /^\/games\/([a-zA-Z0-0-]+)$/;

const games = {};

app.use(bodyParser.json());
app.use(cors());

app.use(express.static('build'));

app.get('/games', (req, res) => {
  res.send(Object.entries(games).reduce((g, [name, game]) => {
    const { state } = game;
    if (state === 'waiting') return { ...g, [name]: game }
    return g;
  }, {}));
});

app.get(/\/games/, (req, res) => {
  const gameId = req.path.match(EXTRACT_GAME_ID)[1];
  const game = games[gameId];

  if (game) {
    res.send(game);
    return;
  }

  res.sendStatus(404);
});

app.post(/\/start/, (req, res) => {
  const { name } = req.body;
  const game = games[name];

  games[name] = {
    ...game,
    state: 'playing',
  }
  res.send('ok');
});

app.post(/\/vote/, (req, res) => {
  const { name, player, vote } = req.body;
  const game = games[name];
  const { round } = game;
  const { votes } = round;
  const updatedGame = {
    ...game,
    round: {
      ...round,
      votes: {
        ...votes,
        [player]: vote,
      },
    },
  };
  games[name] = updatedGame;
  res.send('ok');
});

app.post(/\/answer/, (req, res) => {
  const { name, player, answer } = req.body;
  const game = games[name];
  const { round } = game;
  const { answers } = round;
  const updatedGame = {
    ...game,
    round: {
      ...round,
      answers: {
        ...answers,
        [player]: answer,
      },
    },
  };
  games[name] = updatedGame;
  res.send('ok');
});

app.post(/\/join/, (req, res) => {
  const { name } = req.body;
  const game = games[name];
  const { players } = game;
  const currentPlayer = players + 1;
  const updatedGame = {
    ...game,
    name,
    players: players + 1,
    currentPlayer,
  };
  games[name] = updatedGame;

  res.send(updatedGame);
});

app.post(/\/games/, (req, res) => {
  const gameId = req.path.match(EXTRACT_GAME_ID)[1];
  games[gameId] = {
    name: gameId,
    ...req.body,
  };
  res.send('ok');
});

app.listen(3001, () => { console.log('Server Started!'); })
