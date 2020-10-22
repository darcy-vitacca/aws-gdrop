const { Availabilities, User } = require("../../models");
module.exports = {
  Query: {},
  Mutation: {
    calculateDistance: async (
      _,
      { sellerId, buyerLocation, transportMethod }
    ) => {
      try {
        console.log("Here");
        const calculatedData = {
          distance: "",
          duration: "",
        };

        const calendar = await User.findOne({
          where: { userId: sellerId },
        });
        console.log(calendar);
        //   return calculatedData
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
