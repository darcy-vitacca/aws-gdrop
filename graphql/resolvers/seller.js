const bcrypt = require("bcryptjs");
const { User } = require("../../models");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const { Availabilities } = require("../../models");
module.exports = {
  Query: {
    set: () => {
      console.log("here");
      return [
        {
          date: "1",
          start: "2",
          end: "3",
        },
        {
          date: "4",
          start: "5",
          end: "6",
        },
        {
          date: "7",
          start: "8",
          end: "9",
        },
      ];
    },

    getCalendar: async (parent, args) => {
      try {
        return args;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    setAvail: async (_, args, { user }) => {
      // console.log(JSON.parse(JSON.stringify(args.avail)))
      console.log(user);
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        let newAvailabilities = JSON.parse(JSON.stringify(args.avail));
        console.log(newAvailabilities);
        // Map the userId to the new object
        newAvailabilities.map((e) => {
          Object.assign(e, { userId: user.userId });
        });

        console.log(newAvailabilities);
        // [
        //   {
        //     date: '1',
        //     start: '1',
        //     end: '1',
        //     userId: 'c02c968a-0ea3-42c4-a82e-1e72e30bf9c4'
        //   },
        //   {
        //     date: '2',
        //     start: '2',
        //     end: '1',
        //     userId: 'c02c968a-0ea3-42c4-a82e-1e72e30bf9c4'
        //   }
        // ]

        //update where date and userId == the same else create new
        //TODO: MAYBE COMBINE userId and date 
        const availabilites = await Availabilities.bulkCreate(newAvailabilities, 
          { 
            updateOnDuplicate: ["userId"]
          }
        );

        return availabilites;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
