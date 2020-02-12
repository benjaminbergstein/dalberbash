import ApolloClient from 'apollo-client';
import { createHttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const HOST = process.env.REACT_APP_HOST;
const GRAPHQL_HOST = `${HOST}/graphql`;
const WS_HOST = `${GRAPHQL_HOST.replace('http', 'ws')}`;

const httpLink = createHttpLink({ uri: GRAPHQL_HOST });

const wsLink = new WebSocketLink({
  uri: WS_HOST,
  options: {
    reconnect: true
  }
});

const linkSplitter = ({ query }) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === 'OperationDefinition' &&
    definition.operation === 'subscription'
  );
};

const link = split(linkSplitter, wsLink, httpLink);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
