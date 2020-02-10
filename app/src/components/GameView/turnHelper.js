const ConditionalComponent = (condition) => ({ children }) => (condition && children);

const turnHelper = (currentPlayer, { turnPlayer }) => {
  const isMyTurn = turnPlayer === currentPlayer;

  return {
    isMyTurn,
    WhenMyTurn: ConditionalComponent(isMyTurn),
    WhenNotMyTurn: ConditionalComponent(!isMyTurn),
  };
};

export default turnHelper;
