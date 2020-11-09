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
    uuid: String!
  }
  type Bookings {
    date: String!
    start: String!
    end: String!
    bookingConfirmed: Boolean!
    uuid: String!
  }

  type AvailabilityMessage {
    message: String!
  }
  type UserCalendar {
    availabilities: [Availability]
    bookings: [Bookings]
    state: String
    suburb: String
    postcode: String
  }

  type calculatedData {
    distance: String!
    duration: String!
  }
  type location {
    location: String!
  }

  type Message {
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
    getMyCalendar(userId: String!): UserCalendar! #COMPLETED
    #buyer
    getCalendar(userId: String!): UserCalendar! #COMPLETED
    # queryAvailability(userId: String!, date: String!): [Booking]! //TODO: needed?

    #calculate distance
    calculateDistance(
      sellerId: String!
      buyerLocation: String!
      transportMethod: String!
    ): calculatedData! #COMPLETED
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    # COMPLETED
    #seller
    setAvail(input: [availabilities]!): AvailabilityMessage! #COMPLETED
    setLocation(
      exactLocation: String!
      postcode: String!
      state: String!
      suburb: String!
    ): location! # COMPLETED
    confirmBooking(
      buyerId: String!
      userId: String!
      date: String!
      start: String!
      end: String!
      bookingConfirmed: Boolean!
    ): String!

    storeTempData(
      email: String!
      name: String
      enquiry: String
      handle: String
      contactMethod: String!
    ): Message!

    makeBooking(
      bookingTime: String!
      buyerEmail: String!
      buyerName: String!
      buyerNumber: String!
      item: String!
      location: String!
      marketplace: String!
      paymentMethod: String!
      price: String!
      selectedDate: String!
    ): Message!

    #buyer
    # makeBooking(
    #   userId: String!
    #   date: String!
    #   start: String!
    #   end: String!
    # ): Message!
  }
`;
