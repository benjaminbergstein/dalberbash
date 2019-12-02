const express = require('express');
const bodyParser = require('body-parser');
const cors= require('cors');
const app = express();

const EXTRACT_GAME_ID = /^\/games\/(\w+)$/;

const games = {};

app.use(bodyParser.json());
app.use(cors());

app.get('/games', (req, res) => {
  res.send(games);
});

app.get(/\/games/, (req, res) => {
  const gameId = req.path.match(EXTRACT_GAME_ID)[1];

  res.send(games[gameId]);
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

app.post(/\/answer/, (req, res) => {
  const { name, player, answer } = req.body;
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
