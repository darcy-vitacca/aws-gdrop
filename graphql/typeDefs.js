const { gql } = require("apollo-server");

module.exports = gql`
  #seller
  type User {
    userId: String!
    username: String!
    email: String!
    password: String
    createdAt: String
    updatedAt: String
    exactLocation: String
    lat: String
    lng: String
    state: String
    suburb: String
  }
  input Availabilities {
    date: String!
    start: String!
    end: String!
  }

  #buyer
  type Availability {
    date: String!
    start: String!
    end: String!
  }
  type Booking {
    date: String!
    start: String!
    end: String!
  }

  type Query {
    #seller
    getUsers: [User]!
    login(username: String!, password: String!): User!

    #buyer
    getCalendar(userId: String!): [Availability]!
    queryAvailability(userId: String!, date: String!): [Booking]!
   
  }
  type Mutation {

    #seller
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!

    setAvailabilities(availabilities: [Availabilities!]!): String!

    confirmBooking(
      buyerId: String!
      userId: String!
      date: String!
      start: String!
      end: String!
      bookingConfirmed: Boolean!
    ): String!
  

    #buyer
    makeBooking(
      userId: String!
      date: String!
      start: String!
      end: String!
    ): String!
  }
`;
