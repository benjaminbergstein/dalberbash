const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();

const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema.js');
const resolvers = require('./graphql/resolvers.js');

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

app.use(cors());
app.use(express.static('build'));

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
