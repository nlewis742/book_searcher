const express = require('express');
const path = require('path');
const db = require('./config/connection');
// We donts need this anymore !! --> const routes = require('./routes');
// Import the ApolloServer class
const { ApolloServer } = require('apollo-server-express');
// Import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// console.log("Apollo Server: ", server);

//

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.get('/', (req, res) => {
//   console.log("running in development mode...");
//   res.sendFile(path.join(__dirname, '../client/'));
// });

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  console.log("Server started...");
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    console.log("MongoDB database connection established successfully")
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
  };
  
// Call the async function to start the server
startApolloServer();