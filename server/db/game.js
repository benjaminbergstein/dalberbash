const { getConnection } = require('./db');

const {
  key,
  get,
  set,
  addToSet,
  getSetMembers,
  getType,
  client,
} = getConnection();

const log = (data) => {
  console.log(data);
  return data;
};

const serialize = (data) => JSON.stringify(data);
const deserialize = (data) => JSON.parse(data);
const orEmptyHash = (data) => data || {};

const setGame = (id, data) => Promise.all([
  addToSet('games', key('game', id)),
  set(key('game', id), serialize(data)),
]).then((args) => {
  client.publish(key('_sub', 'game', id), 'update');
  return args;
})

const getGame = (id) => get(key('game', id)).then(deserialize);
const updateGame = (id, updater) =>
  getGame(id).then((game) =>
    setGame(id, updater(game)));

// Returns hash of games keyed by gameId
//
// { "game:Fun-Game": { ...data } }
const getGames = () => getSetMembers('games')
  .then((gameIds) =>
    Promise.all(
      gameIds.map((gameId) => get(gameId)
        .then(deserialize)
        .then((game) => [gameId, game])
      )
    ).then(
      (games) => games.reduce(
        (memo, [id, data]) => ({ ...memo, [id.split(':')[1]]: data }),
        {},
      )
    )
  );

const resetPlayers = (gameId) => set(
  key('game', gameId, 'players'),
  serialize({})
);

const setPlayer = (gameId, player, name) =>
  getPlayers(gameId)
    .then((players) =>
      set(
        key('game', gameId, 'players'),
        serialize({
          ...players,
          [parseInt(player)]: name,
        })
      )
    )
    .then(() => {
      client.publish(key('_sub', 'game', gameId), 'update');
    });

const getPlayers = (gameId) =>
  get(key('game', gameId, 'players')).then(deserialize).then(orEmptyHash)

module.exports = {
  setGame,
  updateGame,
  getGame,
  getGames,
  resetPlayers,
  setPlayer,
  getPlayers,
};