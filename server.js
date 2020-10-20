const { ApolloServer, gql } = require("apollo-server");
const { sequelize } = require("./models");

//ROUTES
require("dotenv").config();

//TODO: string encryption for password
const typeDefs = require("./graphql/typeDefs");

//HANDLERS OF THESE ROUTES
const resolvers = require("./graphql/resolvers");
const { fromPromise } = require("apollo-link");
const contextMiddleware = require("./util/contextMiddleware");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connected!!");
    })
    .catch((err) => console.log(err));
});