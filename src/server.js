const express = require('express');
const bodyParser = require('body-parser');
const cors= require('cors');
const app = express();

const EXTRACT_GAME_ID = /^\/games\/([a-zA-Z0-0-]+)$/;

const games = {};
const gamePlayers = {};

app.use(bodyParser.json());
app.use(cors());

app.use(express.static('build'));

// GET /games
// List games accepting players
//
app.get('/games', (req, res) => {
  res.send(Object.entries(games).reduce((g, [name, game]) => {
    const { state } = game;
    if (state === 'waiting') return { ...g, [name]: game }
    return g;
  }, {}));
});

// POST /join
// Join a specific game
//
// @bodyParam name:string - The name of the game
//
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

const extractGameIdFromPath = (req) => req.path.match(EXTRACT_GAME_ID)[1];

// POST /games/:gameId
// Create game
//
// @urlParam gameId:string
//
app.post(/\/games/, (req, res) => {
  const gameId = extractGameIdFromPath(req);
  games[gameId] = {
    name: gameId,
    ...req.body,
  };
  res.send('ok');
});

// GET /games/:gameId
// Fetch info about a specific game
//
app.get(/\/games/, (req, res) => {
  const gameId = extractGameIdFromPath(req);
  const game = games[gameId];

  if (game) {
    res.send(game);
    return;
  }

  res.sendStatus(404);
});

// POST /players
// Update game player's name
//
// @bodyParam name:string - The name of the game
// @bodyParam player:integer - Which player to update
// @bodyParam playerName:string - The new name for the player
//
app.post(/\/players/, (req, res) => {
  const { name, player, playerName } = req.body;
  const gamePlayers = gamePlayers[name];
  gamePlayers[name] {
    ...gamePlayers,
      [player]: playerName,
  };
  res.send('ok');
});

// POST /start
// Trigger a game to start
//
// @bodyParam name:string - The name of the game
//
app.post(/\/start/, (req, res) => {
  const { name } = req.body;
  const game = games[name];

  games[name] = {
    ...game,
    state: 'playing',
  }
  res.send('ok');
});

// POST /answer
// Submit an answer for the current round
//
// @bodyParam name:string - The name of the game
// @bodyParam player:integer - The ID of the player answering
// @bodyParam answer:string - Text of the answer
//
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

// POST /vote
// Submit a vote for the current round
//
// @bodyParam name:string - The name of the game
// @bodyParam player:integer - The ID of the player voting
// @bodyParam vote:integer - The ID of voted answer
//
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

app.listen(3001, () => { console.log('Server Started!'); })
