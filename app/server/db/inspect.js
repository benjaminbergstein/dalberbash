const { getGames, getGame } = require('./game.js');

getGames().then((gameIds) => {
  console.log(JSON.stringify(gameIds));
});
