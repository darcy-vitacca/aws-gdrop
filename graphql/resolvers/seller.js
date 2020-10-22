const { UserInputError, AuthenticationError } = require("apollo-server");

const { Availabilities } = require("../../models");
const axios = require("axios");

module.exports = {
  Query: {
    getCalendar: async (parent, { userId }) => {
      try {
        //TODO: use userId to query the database and order them by date created
        const calendar = await Availabilities.findAll({
          where: { userId: userId },
          order: [["date", "ASC"]],
        });

        //TODO: get bookings also and return them and sub them into the availabilites
        // return the calendar

        return calendar;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
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

        const locationDetails = {
          exactLocation : exactLocation, 
          postcode: postcode,
          state : state,
          suburb : suburb
          

        }
        console.log(exactLocation, postcode, state, suburb);

       const latlngRequest = await axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=AU&components=postal_code:${postcode}&sensor=false&key=AIzaSyAMx8UE3xmQW9t1o1pN6tsaBsaXM3y8LpM`
        )
        locationDetails.lat = latlngRequest.data.results[0].geometry.location[0];
        locationDetails.lng = latlngRequest.data.results[0].geometry.location[1];

        console.log(locationDetails)

     
        


        const location = {
          location: exactLocation,
        };

        console.log(location);
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
        console.log(newAvailabilities);

        //TODO: check if they are the right inputs and all inputs are present
        newAvailabilities.map((e) => {
          Object.assign(e, {
            userId: user.userId,
            id: `${user.userId}-${e.date}`,
          });
        });

        console.log(newAvailabilities);

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
        console.log(availabilites);
        let uiAvailibilites = JSON.parse(JSON.stringify(args.avail));
        console.log(uiAvailibilites);

        return availabilites;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
