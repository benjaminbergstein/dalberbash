import React, { useState } from 'react';
import StartScreen from './StartScreen';
import WaitingScreen from './WaitingScreen';
import PlayingScreen from './PlayingScreen';

const COMPONENT_MAP = {
  not_joined: StartScreen,
  waiting: WaitingScreen,
  playing: PlayingScreen,
};

const App = ({ initialGame }) => {
  const [game, setGame] = useState(initialGame);
  const Component = COMPONENT_MAP[game.state];
  return <Component game={game} setGame={setGame} />;
};

export default App;
