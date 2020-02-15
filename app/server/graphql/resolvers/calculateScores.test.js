const ROUND = {
  answers: {
    '1': 'foo',
    '2': 'bar',
    '3': 'baz',
  },
};

const GAME = {
  name: 'foo',
  players: 3,
  turnPlayer: 1,
  roundTallies: [],
  playerNames: [],
};

const calculateScoresWithMocks= (roundTallies = [], votes = {}) => {
  const game = {
    ...GAME,
    round: { ...ROUND, votes },
    roundTallies,
  };

  const getGame = () => Promise.resolve(game);
  const updateGame = (gameId, updater) => Promise.resolve(updater(game));
  return calculateScores('game-id', getGame, updateGame);
};

const calculateScores = require('./calculateScores');

describe('when everyone is stumped', () => {
  test('player 1 gets 2 points', (done) => {
    calculateScoresWithMocks([], { '2': 3, '3': 2 }).then((updatedGame) => {
      expect(updatedGame.roundTallies.length).toBe(1);
      expect(updatedGame.roundTallies[0]['1']).toBe(2);
      expect(updatedGame.roundTallies[0]['2']).toBe(1);
      expect(updatedGame.roundTallies[0]['3']).toBe(1);
      done();
    });
  });
});

describe('when one player gets all the votes', () => {
  test('only the voted player gets points', (done) => {
    calculateScoresWithMocks([], { '2': 3, '3': 1 }).then((updatedGame) => {
      expect(updatedGame.roundTallies.length).toBe(1);
      expect(updatedGame.roundTallies[0]['1']).toBe(0);
      expect(updatedGame.roundTallies[0]['2']).toBe(0);
      expect(updatedGame.roundTallies[0]['3']).toBe(3);
      done();
    });
  });
});

describe('when a player chooses their own answer', () => {
  test('no one gets any points', (done) => {
    calculateScoresWithMocks([], { '2': 2, '3': 3 }).then((updatedGame) => {
      expect(updatedGame.roundTallies.length).toBe(1);
      expect(updatedGame.roundTallies[0]['1']).toBe(2);
      expect(updatedGame.roundTallies[0]['2']).toBe(0);
      expect(updatedGame.roundTallies[0]['3']).toBe(0);
      done();
    });
  });
});
