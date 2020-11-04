const { UserInputError, AuthenticationError } = require("apollo-server");

const { Availabilities , Bookings} = require("../../models");
const { User } = require("../../models");

module.exports = {
  Query: {
    getMyCalendar: async (_, {userId}, {user}) => {
      try {

        const userCalendar = {
          availabilities: [],
          bookings: [],
          state: "",
          suburb: "",
          postcode: ""
        };

        const seller = await User.findOne({
          where: { userId: userId },
        });

        userCalendar.suburb = seller.suburb
        userCalendar.state = seller.state
        userCalendar.postcode = seller.postcode
        
        //Availabilities
        const calendarAvailabilites = await Availabilities.findAll({
          where: { userId: userId },
          order: [["date", "ASC"]],
        });
        let pulledAvailabilites = calendarAvailabilites
        pulledAvailabilites = pulledAvailabilites.map((entry) => {
          userCalendar.availabilities.push(entry);
        });
      


       //Bookings
       //TODO: need to add a bookingConfirmed check or maybe just return them all
        const calendarBookings = await Bookings.findAll({
          where: { userId: userId},
          order: [["date", "ASC"]],
        });
        let pulledBookings = calendarBookings
        pulledBookings = pulledBookings.map((entry) => {
          userCalendar.bookings.push(entry);
        });
        
        // console.log(userCalendar); 
        return userCalendar;
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
        console.log(user)
        if (!user) throw new AuthenticationError("Unauthenticated");
        //TODO: add validation
        const locationDetails = {
          exactLocation: exactLocation,
          postcode: postcode,
          state: state,
          suburb: suburb,
        };

        const locationAdded = await User.update(locationDetails, {
          where: { userId: user.userId },
        });

        const location = {
          location: exactLocation,
        };

        return location;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    //TODO: when this confirms we need to delete all other bookings from other people at the same time 
    confirmBooking: async (_, args) => {
      try {
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    setAvail: async (_, args, { user }) => {
      console.log(user);
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        let newAvailabilities = JSON.parse(JSON.stringify(args.input));
        console.log("here")
        
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

        let uiAvailibilites = JSON.parse(JSON.stringify(args.input));
        console.log(uiAvailibilites);
        const AvailabilityMessage = {
          message: "Success"
        }

        return AvailabilityMessage;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
