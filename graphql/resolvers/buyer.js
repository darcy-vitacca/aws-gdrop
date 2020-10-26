const axios = require("axios");
const { Availabilities, User, Bookings } = require("../../models");

module.exports = {
  Query: {
    getCalendar: async (_, { userId }) => {
      try {
        const userCalendar = {
          availabilities: [],
          bookings: [],
        };
        const calendarAvailabilites = await Availabilities.findAll({
          where: { userId: userId },
          order: [["date", "ASC"]],
        });

        let pulledAvailabilites = calendarAvailabilites

        pulledAvailabilites = pulledAvailabilites.map((entry) => {
          userCalendar.availabilities.push(entry);
        });

        console.log(pulledAvailabilites);

        // const calendarBookings = await Bookings.findAll({
        //   where: { sellerId: userId , bookingConfirmed : true},
        //   order: [["date", "ASC"]],
        // });

        // console.log(calendarBookings)

        console.log(userCalendar);
        return userCalendar;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    calculateDistance: async (
      _,
      { sellerId, buyerLocation, transportMethod }
    ) => {
      try {
        const calculatedData = {
          distance: "",
          duration: "",
        };

        const seller = await User.findOne({
          where: { userId: sellerId },
        });
        const sellerLocation = seller.exactLocation;

        const googleRequest = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metricl&origins=${buyerLocation}&destinations=${sellerLocation}&mode=${transportMethod}&key=AIzaSyAMx8UE3xmQW9t1o1pN6tsaBsaXM3y8LpM`;

        const calculatedDistance = await axios.post(googleRequest);

        calculatedDistance.data.rows.forEach((entry) => {
          calculatedData.distance = entry.elements[0].distance.text;
          calculatedData.duration = entry.elements[0].duration.text;
        });

        return calculatedData;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    confirmBooking : async(_, args) =>{

      try{

      }catch (err){
        console.log(err);
        throw err;
      }

    },
    makeBooking : async(_, {userId, date, start, end}) =>{
     
      try{
        console.log(userId, date, start, end)

        const createBookings = await Bookings.create({ userId: userId, date: date , start: start, end: end });

        const message = {
          message : "success"
        }
        return message;

      }catch (err){
        console.log(err);
        throw err;
      }

    }
  },
};
