import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Design from './components/Design';
import * as serviceWorker from './serviceWorker';
import { DEFAULT_GAME, fetchGame } from './game';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from './graphql/ApolloClient';


const [initialGameId, initialCurrentPlayer] = window.location.hash.substr(1).split('.');

const mountApp = (initialGame) => {
  const TheApp = () => (
    <ApolloProvider client={ApolloClient}>
      <App
        initialGameId={initialGameId}
        initialCurrentPlayer={parseInt(initialCurrentPlayer)}
        shouldJoin={initialCurrentPlayer === 'join'}
      />
    </ApolloProvider>
  );
  ReactDOM.render(<TheApp />, document.getElementById('root'));
};


const isDesignPage = window.location.pathname === '/design';

if (isDesignPage) {
  ReactDOM.render(<Design />, document.getElementById('root'));
} else {
  mountApp();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
