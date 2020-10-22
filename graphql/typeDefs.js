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
  type AvailabilityResponse {
    availabilities: [Availability]
  }

  type calculatedData {
    distance: String!
    duration: String!
  }
  type location {
    location: String!
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
    login(username: String!, password: String!): User!

    #buyer
    getCalendar(userId: String!): [Availability]!
    queryAvailability(userId: String!, date: String!): [Booking]!
  }
  type Mutation {
    #seller
    setAvail(avail: [availabilities]): AvailabilityResponse!

    setLocation(
      exactLocation: String!,
      postcode: String!,
      state: String!,
      suburb: String!,
    ): location!

    #calculate distance
    calculateDistance(
      sellerId: String!
      buyerLocation: String!
      transportMethod: String!
    ): calculatedData!

    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!

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
    #TODO: set location
  }
`;
