const url = require('url');
const WebSocket = require('ws');
const { getConnection } = require('./db/db.js');
const { getGame, getPlayers } = require('./db/game.js');

const subscribeToGame = (ws, gameId) => {
  const { client, key } = getConnection();
  client.subscribe(key('_sub', 'game', gameId))
  const refreshClient = () => {
    Promise.all([
      getGame(gameId),
      getPlayers(gameId),
    ]).then(([game, playerNames]) => {
      ws.send(JSON.stringify({ ...game, playerNames }));
    });
  };
  refreshClient();
  client.on("message", refreshClient);
  ws.on("message", (message) => {
    if (message !== 'p') refreshClient();
  });
  ws.on("close", () => { client.quit(); });
};

const initWebsocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const { pathname } = url.parse(req.url);
    const [_, gameId] = pathname.match(/\/games\/([a-zA-Z0-9-]+)/);

    subscribeToGame(ws, gameId);
  });
};

module.exports = initWebsocket;
