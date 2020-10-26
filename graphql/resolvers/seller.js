const { UserInputError, AuthenticationError } = require("apollo-server");

const { Availabilities } = require("../../models");
const axios = require("axios");
const { User } = require("../../models");

module.exports = {
  Query: {
    // getMyCalendar: async (parent, { userId }) => {
    //   try {
    //     //TODO: use userId to query the database and order them by date created
    //     const calendar = await Availabilities.findAll({
    //       where: { userId: userId },
    //       order: [["date", "ASC"]],
    //     });

    //     //TODO: get bookings also and return them and sub them into the availabilites
    //     // return the calendar

    //     return calendar;
    //   } catch (err) {
    //     console.log(err);
    //     throw err;
    //   }
    // },
  },

  Mutation: {
    //Set availibilites and if new ones have been set they will be overwritter
    setLocation: async (
      _,
      { exactLocation, postcode, state, suburb },
      { user }
    ) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        //TODO: add validation
        const locationDetails = {
          exactLocation: exactLocation,
          postcode: postcode,
          state: state,
          suburb: suburb,
        };

        const locationAdded = await User.update(
          locationDetails,
          { where: { userId: user.userId } }
        );
        
        const location = {
          location: exactLocation,
        };

        return location;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },




    setAvail: async (_, args, { user }) => {
      console.log(user);
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        let newAvailabilities = JSON.parse(JSON.stringify(args.avail));

        //TODO: check if they are the right inputs and all inputs are present
        newAvailabilities.map((e) => {
          Object.assign(e, {
            userId: user.userId,
            id: `${user.userId}-${e.date}`,
          });
        });

        const availabilites = await Availabilities.bulkCreate(
          newAvailabilities,
          {
            updateOnDuplicate: [
              "uuid",
              "userId",
              "date",
              "start",
              "end",
              "updatedAt",
            ],
          }
        );
    
        let uiAvailibilites = JSON.parse(JSON.stringify(args.avail));
        // console.log(uiAvailibilites);

        return availabilites;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
