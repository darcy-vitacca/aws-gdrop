const bcrypt = require("bcryptjs");
const { User } = require("../../models");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        let users = await User.findAll({
          attributes: ["username", "imageUrl", "createdAt"],
          where: { username: { [Op.ne]: user.username } },
        });

        const allUserMessages = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.username }, { to: user.username }],
          },
          order: [["createdAt", "DESC"]],
        });

        users = users.map(otherUser => {
          const latestMessage = allUserMessages.find(
            (m) => m.from === otherUser.username || m.to === otherUser.username
          );
          otherUser.latestMessage = latestMessage;

          return otherUser;
        });
        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },


    login: async (_, args) => {
        const { username, password } = args;
        let errors = {};
        console.log("here")
        try {
          if (username.trim() === "")
            errors.username = "Username must not be empty";
          if (password === "") errors.password = "Password must not be empty";
  
          if (Object.keys(errors).length > 0) {
            throw new UserInputError("Bad Input", { errors });
          }
  
          const user = await User.findOne({
            where: { username },
          });
  
          if (!user) {
            errors.username = "User not found";
            throw new UserInputError("User not found", { errors });
          }
  
          //the graphql schema won't expose the password becuase we aren't calling it
          const correctPassword = await bcrypt.compare(password, user.password);
          if (!correctPassword) {
            errors.password = "password is incorrect";
            throw new UserInputError("Password is incorrect", { errors });
          }
          const token = jwt.sign({ username }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60,
          });
  
          return {
            ...user.toJSON(),
            token: token,
          };
  
          return user;
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
  },
  
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args;
      let errors = {};
      try {
        
        //Validate input data adn checks if they are empty
        if (email.trim() === "") errors.email = "Email must not be empty";
        if (username.trim() === "")
          errors.username = "Username must not be empty";
        if (password.trim() === "")
          errors.password = "Password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "Repeat password must not be empty";

        if (password !== confirmPassword)
          errors.confirmPassword = "Passwords do not match";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }
        
        //encrypt password
        password = await bcrypt.hash(password, 6);

        const user = await User.create({
          username,
          email,
          password,
        });
        console.log(user)
        return user;

      } catch (err) {
          //Checks if sequelize has an error 
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(
            (e) =>
              (errors[e.path.split(".")[1]] = `${
                e.path.split(".")[1]
              } is already taken`)
          );
        } else if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad Input", { errors });
      }
    },
  },
};