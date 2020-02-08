const {
  setGame,
  updateGame,
  getGameIds,
  getGame,
  getPlayers,
  setPlayer,
} = require('../../db/game.js');

const calculateScores = (_, { gameId }) => {
  return getGame(gameId).then((game) => {
    // const {
    //   name,
    //   round,
    //   players,
    //   turnPlayer,
    //   roundTallies,
    //   playerNames,
    // } = game;
    // const { answers, voteOptions, votes } = round;

    console.log(game);
  });
};

module.exports = calculateScores;
