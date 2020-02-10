import React, { useState, useRef } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { FETCH_GAME, WATCH_GAME } from '../graphql/queries';

const useGame = (gameId) => {
  const { loading, data, subscribeToMore } = useQuery(FETCH_GAME, { variables: { gameId } });
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = () => {
    if (!subscribed) {
      setSubscribed(true);
      subscribeToMore({
        document: WATCH_GAME,
        variables: { gameId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const game = subscriptionData.data.gameUpdated;

          return Object.assign({}, prev, { game });
        },
      });
    }
  };

  if (loading) return { game: null, loading: true, subscribe };

  const { game } = data;

  return {
    game,
    loading,
    subscribe,
  };
};

export default useGame;
