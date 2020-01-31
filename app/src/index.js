import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Design from './components/Design';
import * as serviceWorker from './serviceWorker';
import { DEFAULT_GAME, fetchGame } from './game';

const mountApp = (initialGame) => {
  ReactDOM.render(<App initialGame={initialGame} />, document.getElementById('root'));
};

const [name, currentPlayer] = window.location.hash.substr(1).split('.');

const isDesignPage = window.location.pathname === '/design';

if (isDesignPage) {
  ReactDOM.render(<Design />, document.getElementById('root'));
} else if (name && currentPlayer) {
  fetchGame(name)
    .then((game) => {
      mountApp({
        ...game,
        currentPlayer: parseInt(currentPlayer),
      });
    })
    .catch(() => {
      mountApp(DEFAULT_GAME);;
    });
} else {
  mountApp(DEFAULT_GAME);;
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
