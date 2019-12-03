import React, { useState } from 'react';
import StartView from './StartView/StartView';
import PreGameView from './PreGameView';
import GameView from './GameView/GameView';

const COMPONENT_MAP = {
  not_joined: StartView,
  waiting: PreGameView,
  playing: GameView,
};

const App = ({ initialGame }) => {
  const [game, setGame] = useState(initialGame);
  const Component = COMPONENT_MAP[game.state];
  return <Component game={game} setGame={setGame} />;
};

export default App;
