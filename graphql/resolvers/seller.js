const {
    UserInputError,
    AuthenticationError,
    withFilter,
    ForbiddenError,
  } = require("apollo-server");
  const { Op } = require("sequelize");

  const { Bookings, Availabilites, User } = require("../../models");


  module.exports = {
      Query : {
          getCalendar : async (parent, args, context) =>{
              
           
              try {
              
               
                  return args;

              } catch (err) {
                  console.log(err)
                  throw err;
              }
          }

      },
      Mutation : {
        setAvailabilities : async (parent, args, context) =>{
            console.log("here")
            console.log(args)
              try {
                 args.forEach((e) =>{
                     console.log(e)
                 })
                  return args;

            } catch (err) {
                console.log(err)
                throw err;
            }
        }

      }
  }