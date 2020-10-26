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
    state: String
    suburb: String
    postcode: String
    # TODO: take out
    token: String
  }

  input availabilities {
    date: String
    start: String
    end: String
  }

  type Availability {
    date: String!
    start: String!
    end: String!
  }
  type Bookings {
    date: String!
    start: String!
    end: String!
  }


  type AvailabilityResponse {
    availabilities: [Availability]
  }
  type UserCalendar {
    availabilities: [Availability]
    bookings: [Bookings]
  }

  type calculatedData {
    distance: String!
    duration: String!
  }
  type location {
    location: String!
  }

  type BookingMessage {
    message: String!
  }

  #buyer
  type Booking {
    date: String
    start: String
    end: String
  }

  type Query {
    #seller
    getUsers: [User]!
    login(username: String!, password: String!): User! #COMPLETED
    getMyCalendar(userId: String!): UserCalendar!

    #buyer
    getCalendar(userId: String!): UserCalendar!
    queryAvailability(userId: String!, date: String!): [Booking]!

    #calculate distance
    calculateDistance(
      sellerId: String!
      buyerLocation: String!
      transportMethod: String!
    ): calculatedData! #COMPLETED
  }
  type Mutation {
    #seller
    setAvail(avail: [availabilities]): AvailabilityResponse! #COMPLETED

    setLocation(
      exactLocation: String!
      postcode: String!
      state: String!
      suburb: String!
    ): location! # COMPLETED

    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User! # COMPLETED

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
    ): BookingMessage!
  }
`;
