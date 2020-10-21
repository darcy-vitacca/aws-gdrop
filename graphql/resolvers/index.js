const userResolvers = require("./users");
const buyerResolvers = require("./buyer");
const sellerResolvers = require("./seller");
const { User, Message } = require("../../models");

// You can perform changes like in message here because it isn't top level from the resolvers it's getting passed down so we can access value within the parent
// Subscriptions of messages get's spread
module.exports = {
  User: {
    // createdAt: (parent) => parent.createdAt.toISOString(),
  },

  Query: {
    ...userResolvers.Query,
    ...buyerResolvers.Query,
    ...sellerResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...buyerResolvers.Mutation,
    ...sellerResolvers.Mutation,
  },
};
