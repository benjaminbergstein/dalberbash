const {
  updateGame,
  getGame,
} = require('../../db/game.js');

const calculateScores = (gameId) => {
  return getGame(gameId).then((game) => {
    const {
      name,
      round,
      players,
      turnPlayer,
      roundTallies,
      playerNames,
    } = game;
    const { answers, votes } = round;

    const didPlayerChoseCorrectly = (player) => isPlayerTurnPlayer(votes[player]) === turnPlayer;

    const isPlayerTurnPlayer= (player) => parseInt(player) === turnPlayer;

    const getVoteCountForPlayer = (player) => {
      return Object.values(votes).reduce((count, answerNumber) => {
        return player === answerNumber ? count + 1 : count;
      }, 0);
    };

    const getPointsForPlayer = (player) => {
      if (isPlayerTurnPlayer(player)) {
        return getVoteCountForPlayer(player) === 0 ? 2 : 0
      } else {
        return (didPlayerChoseCorrectly(player) ? 2 : 0) + getVoteCountForPlayer(player);
      }
    };

    const points = Object.entries(answers).reduce((totals, [player]) => {
      return { ...totals, [player]: getPointsForPlayer(player) };
    }, {});

    const updatedRoundTallies = [...roundTallies, points];

    const totals = updatedRoundTallies.reduce((t1, tally) => {
      return Object.entries(t1).reduce((t2, [player, score]) => ({
        ...t2,
        [player]: score + tally[player],
      }), {});
    });

    return updateGame(gameId, (game) => ({
      ...game,
      round: {
        ...round,
        state: 'scoring',
      },
      roundTallies: updatedRoundTallies,
    }));
  });
};

module.exports = calculateScores;
