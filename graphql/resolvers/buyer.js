const {
    UserInputError,
    AuthenticationError,
    withFilter,
    ForbiddenError,
  } = require("apollo-server");
  const { Op } = require("sequelize");

  const { Bookings, Availabilites, User} = require("../../models");

  module.exports = {
    Query : {
        getCalendar : async (parent, args, context) =>{
            try {

            } catch (err) {
                console.log(err)
                throw err;
            }
        }

    },
    Mutation : {
        

    }
}