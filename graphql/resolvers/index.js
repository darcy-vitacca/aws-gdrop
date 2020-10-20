const userResolvers = require("./users");
const buyerResolvers = require("./buyer");
const sellerResolvers = require("./seller");
const { Availabilites, Bookings, User } = require("../../models");

module.exports = {
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  // Seller: {},
  // Buyer: {},

  Query: {
    ...userResolvers.Query,
    ...buyerResolvers.Query,
    ...sellerResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Query,
    ...buyerResolvers.Query,
    ...sellerResolvers.Query,
  },

};
