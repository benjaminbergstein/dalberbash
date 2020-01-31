const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const {
  updateGame,
  getGames,
  getGame,
  setGame,
  resetPlayers,
  setPlayer,
  getPlayers,
} = require('./db/game.js');
const { getConnection } = require('./db/db.js');

const EXTRACT_GAME_ID = /^\/games\/([a-zA-Z0-0-]+)$/;

const sendOk = (res) => () => res.send('ok');

app.use(bodyParser.json());
app.use(cors());

app.use(express.static('build'));

// GET /games
// List games accepting players
//
app.get('/games', (req, res) => {
  return getGames().then((games) => {
    res.send(Object.entries(games).reduce((g, [name, game]) => {
      const { state } = game;
      if (state === 'waiting') return { ...g, [name]: game }
      return g;
    }, {}));
  });
});

// POST /join
// Join a specific game
//
// @bodyParam name:string - The name of the game
//
app.post(/\/join/, (req, res) => {
  const { name } = req.body;
  return getGame(name).then((game) => {
    const { players } = game;
    const currentPlayer = players + 1;
    const updatedGame = {
      ...game,
      name,
      players: players + 1,
      currentPlayer,
    };
    setGame(name, updatedGame).then(() => {
      res.send(updatedGame);
    });
  });
});

const extractGameIdFromPath = (req) => req.path.match(EXTRACT_GAME_ID)[1];

// POST /games/:gameId
// Create game
//
// @urlParam gameId:string
//
app.post(/\/games/, (req, res) => {
  const gameId = extractGameIdFromPath(req);
  return getGame(gameId).then((isExistingGame) => {
    const updatedGame = {
      name: gameId,
      ...req.body,
    };
    Promise.all([
      setGame(gameId, updatedGame),
      resetPlayers(),
    ]).then(() => {
      res.send('ok');
    });
  });
});

// GET /games/:gameId
// Fetch info about a specific game
//
app.get(/\/games/, (req, res) => {
  const gameId = extractGameIdFromPath(req);
  return Promise.all([
    getGame(gameId),
    getPlayers(gameId),
  ]).then(([game, playerNames]) => {
    if (game) {
      res.send({
        ...game,
        playerNames,
      });
      return;
    }
    res.sendStatus(404);
  });
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
  return setPlayer(name, player, playerName)
    .then(sendOk(res));
});

// POST /start
// Trigger a game to start
//
// @bodyParam name:string - The name of the game
//
app.post(/\/start/, (req, res) => {
  const { name } = req.body;
  return updateGame(name, (game) => ({
    ...game,
    state: 'playing',
  })).then(sendOk(res));
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

  return updateGame(name, (game) => {
    const { round } = game;
    const { answers } = round;
    return {
      ...game,
      round: {
        ...round,
        answers: {
          ...answers,
          [player]: answer,
        },
      },
    };
  }).then(sendOk(res));
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

  return updateGame(name, (game) => {
    const { round } = game;
    const { votes } = round;
    return {
      ...game,
      round: {
        ...round,
        votes: {
          ...votes,
          [player]: vote,
        },
      },
    };
  }).then(sendOk(res));
});

app.listen(process.env.PORT || 3001, () => { console.log('Server Started!'); })
