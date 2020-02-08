import ApolloClient from 'apollo-boost';

const HOST = process.env.REACT_APP_HOST;

const client = new ApolloClient({
  uri: HOST.replace('3001', '3002'),
});

export default client;
