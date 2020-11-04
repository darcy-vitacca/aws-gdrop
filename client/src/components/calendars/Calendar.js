//Core
import React, { Fragment, useState, useEffect } from "react";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useCalendarDispatch, useCalendarState } from "../../context/calendar";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import "../../css/calendar.css";

import exchangeimg from "../../images/exchangeimg.svg";
import paymentimg from "../../images/paymentmethod.svg";
import deliverymethod from "../../images/deliverymethod.svg";

//Packages
import { v4 as uuid } from "uuid";
import Autocomplete from "react-google-autocomplete";
import dateFns from "date-fns";
//Dropdowns
const { TwentyFourHourTime30mins } = require("../../util/dropdowns");

//graphql
const GET_CALENDAR = gql`
  query getCalendar($userId: String!) {
    getCalendar(userId: $userId) {
      availabilities {
        date
        start
        end
        uuid
      }
      bookings {
        date
        start
        end
        bookingConfirmed
        uuid
      }
      state
      suburb
      postcode
    }
  }
`;

export default function Calendar(props) {
  const AuthDispatch = useAuthDispatch();
  const { user } = useAuthState();

  const CalendarDispatch = useCalendarDispatch();
  const { calendar } = useCalendarState();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const initialStateModal = {
    showModal: false,
    selectedAvailability: [],
    marketplace: "",
    bookingTime: "",
    location: "",
    item: "",
    price: "",
    paymentMethod: "",
    buyerName: "",
    buyerEmail: "",
    buyerNumber: "",
    termsConditions: false,
  };

  const initialStateLocation = {
    locationCheck: false,
    transportMethod: "driving",
    exactLocation: "",
    postcode: "",
    state: "",
    calculatedDistance: "",
    calculatedDuration: "",
  };

  const [modal, setModal] = useState(initialStateModal);

  const [location, setLocation] = useState(initialStateLocation);

  //   dayMode: false,

  //TODO: bug when changing from this calendar to my calednar

  const [
    getCalendar,
    { loading: calendarLoading, data: calendarData, errors },
  ] = useLazyQuery(GET_CALENDAR, {
    onError: (err) => console.log(err),
  });

  //   const [
  //     getMap,
  //     { loading: mapLoading, data: mapData, errors },
  //   ] = useLazyQuery(GET_CALENDAR, {
  //     onError: (err) => console.log(err),
  //   });

  useEffect(() => {
    getCalendar({ variables: { userId: props.match.params.userid } });
    if (calendarData) {
      CalendarDispatch({
        type: "SET_CALENDAR",
        payload: {
          availabilities: calendarData.getCalendar.availabilities.reduce(
            (obj, item) => Object.assign(obj, { [item.date]: item }),
            {}
          ),
          bookings: calendarData.getCalendar.bookings.reduce(
            (obj, item) => Object.assign(obj, { [item.date]: item }),
            {}
          ),
          state: calendarData.getCalendar.state,
          suburb: calendarData.getCalendar.suburb,
          postcode: calendarData.getCalendar.postcode,
        },
      });
    }
  }, [calendarData]);

  // //HEADER //HEADER //HEADER //HEADER //HEADER //HEADER
  const header = () => {
      
    const dateFormat = "MMMM YYYY";
    let currentMonthLimit = new Date();
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          {dateFns.isAfter(
            dateFns.format(currentMonth, dateFormat),
            dateFns.format(currentMonthLimit, dateFormat)
          ) ? (
            <div className="icon" onClick={prevMonth}>
              chevron_left
            </div>
          ) : (
            <div className="iconDisabled" onClick={prevMonth}>
              chevron_left
            </div>
          )}
        </div>
        <div className="col col-center">
          <span>Availability</span>
          <span className="monthTextCalendar">
            {dateFns.format(currentMonth, dateFormat)}
          </span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  };

  const nextMonth = () => {
    setCurrentMonth(dateFns.addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    const dateFormat = "MMMM YYYY";
    let currentMonthLimit = new Date();
    if (
      dateFns.isAfter(
        dateFns.format(currentMonth, dateFormat),
        dateFns.format(currentMonthLimit, dateFormat)
      )
    ) {
      setCurrentMonth(dateFns.subMonths(currentMonth, 1));
    }
  };

  //DAYS //DAYS //DAYS //DAYS //DAYS //DAYS //DAYS
  const renderDays = () => {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          <div className="hide-desktop">
            {dateFns
              .format(dateFns.addDays(startDate, i), dateFormat)
              .substring(0, 3)}
          </div>
          <div className="show-desktop hide-mobile">
            {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
          </div>
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  };

  //CELLS //CELLS //CELLS  //CELLS  //CELLS  //CELLS
  const renderCells = () => {
    let availabilities = calendar.availabilities;

    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);
    let currentDay = new Date();

    //Date constrcutor for dateId
    let monthRef = currentMonth.getMonth() + 1;
    let yearRef = currentMonth.getFullYear();

    // 11-12-2020: (2) [600, 2400] DB Schema
    const dateFormat = "DD";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);

        let dateId = `${formattedDate}-${monthRef}-${yearRef}`;
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart) || day < currentDay
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate)
                ? "selected"
                : ""
            } ${
              dateId in availabilities &&
              dateFns.isSameMonth(day, monthStart) &&
              day >= currentDay
                ? "available"
                : ""
            }`}
            key={day}
            onClick={(e) => onDateClick(e, dateFns.parse(cloneDay))}
          >
            {//Checks if dateId matches an availibility and either puts out an emmpty day or the time and also checks for same month
            dateId in availabilities &&
            dateFns.isSameMonth(day, monthStart) &&
            day >= currentDay ? (
              <Fragment>
                <span
                  className="number"
                  id={`${formattedDate}-${monthRef}-${yearRef}`}
                  key={uuid()}
                >
                  {formattedDate}
                </span>

                <span className="availabilitiesTime">{`${
                  availabilities[`${dateId}`]["start"]
                } - ${availabilities[`${dateId}`]["end"]}`}</span>
              </Fragment>
            ) : (
              <Fragment>
                <span
                  className="number"
                  id={`${formattedDate}-${monthRef}-${yearRef}`}
                  key={uuid()}
                >
                  {formattedDate}
                </span>
              </Fragment>
            )}
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const onDateClick = (e, day) => {
    console.log(e.target);
    console.log(e.target.innerText);
    console.log(day);
    //TODO: need to handle if they click the number
    let selectedAvailability;

    if (
      e.target.className === "col cell  available" ||
      e.target.className === "availabilitesTime" ||
      e.target.className === "col cell selected available"
    ) {
      if (e.target.innerText.includes("\n")) {
        selectedAvailability = e.target.innerText.split("\n")[1];
        selectedAvailability = selectedAvailability.split(" ");
      } else if (e.target.innerText.includes("")) {
        selectedAvailability = e.target.innerText.split(" ");
      }
      setModal({
        ...modal,
        showModal: !modal.showModal,
        selectedAvailability: [
          selectedAvailability[0],
          selectedAvailability[2],
        ],
      });
    }
    setSelectedDate(day);
  };

  const modalSubmit = (event) => {
    event.preventDefault();
    const dateFormat = "dddd Do MMMM YYYY";

    const formData = {
      ...modal,
      selectedDate: dateFns.format(selectedDate, dateFormat),
    };
    // console.log(formData)
    this.props.ContactForm(formData, this.props.history);
  };

  const handleModalChange = (event) => {
    if (event.target.name === "termsConditions") {
      setModal({
        ...modal,
        [event.target.name]: !modal.termsConditions,
      });
    } else {
      setModal({
        ...modal,
        [event.target.name]: event.target.value,
      });
    }
  };
//   render modal
    const renderModal = (e) => {
      // let { errors, message } = this.props.UI;
      const dateformatted = "dddd Do MMM";

      //TODO: need to add on the backend
      // let { suburb, postcode } = this.props.data.availabilities;
      let {
        bookingTime,
        location,
        marketplace,
        item,
        price,
        paymentMethod,
        buyerName,
        buyerEmail,
        buyerNumber,
        termsConditions,
        selectedAvailability,
        showModal
      } = modal;
      return (
        <div className={showModal ? "modalCont" : "hideModal"}>
          <div className="modal-content">
            <h2 className="modalMessage">
              {dateFns.format(selectedDate, dateformatted)}
            </h2>
            <span
              className="close"
              onClick={() => {
                onModalClose();
              }}
            >
              &times;
            </span>

            {/* {errors || message === null ? ( */}
              <Fragment>
                <form
                  className="modalForm"
                  onSubmit={modalSubmit}
                  onChange={handleModalChange}
                >
                  <label>Time:</label>
                  <select
                    value={bookingTime}
                    name="bookingTime"
                    className="bookingModalInputs"
                    required
                  >
                    <option value="" disabled selected hidden>
                      Book a Time
                    </option>
                    {TwentyFourHourTime30mins.map((time) => {
                      if (
                        time[0] > selectedAvailability[0] &&
                        time[1] <= selectedAvailability[1]
                      ) {
                        return (
                          <option key={uuid()} value={`${time[0]}-${time[1]}`}>
                            {" "}
                            {`${time[0]}-${time[1]}`}
                          </option>
                        );
                      }
                    })}
                  </select>

                  <label>
                    Location:{" "}
                    <p className="modalSubTextLocation">
                      (exact address to be sent on confirmation)
                    </p>
                  </label>
                  <select type="text" name="location" value={location} required>
                    <option value="" disabled selected hidden>
                      Pick a Location
                    </option>
                    <option
                      value={`${suburb}, ${postcode}`}
                    >{`${suburb}, ${postcode}`}</option>
                  </select>
                  <label>Item:</label>
                  <input type="text" name="item" value={item} required></input>
                  <label>Price:</label>
                  <input type="text" name="price" value={price} required></input>
                  <label>Marketplace:</label>
                  <select
                    type="text"
                    name="marketplace"
                    value={marketplace}
                    required
                  >
                    <option value="" disabled selected hidden>
                      Select Marketplace
                    </option>
                    <option value="Facebook">Facebook</option>
                    <option value="Gumtree">Gumtree</option>
                  </select>
                  <label>Payment Method:</label>
                  <select
                    type="text"
                    name="paymentMethod"
                    value={paymentMethod}
                    required
                  >
                    <option value="" disabled selected hidden>
                      Payment Method
                    </option>
                    <option value="Cash">Cash</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  <label>Your Name:</label>
                  <input
                    type="text"
                    name="buyerName"
                    value={buyerName}
                    required
                  ></input>
                  <label>Your Email:</label>
                  <input
                    type="email"
                    name="buyerEmail"
                    value={buyerEmail}
                    required
                  ></input>
                  <label>Your Number:</label>
                  <input
                    type="text"
                    name="buyerNumber"
                    value={buyerNumber}
                    required
                  ></input>
                  <p>
                    <i>Next step the seller will accept/decline the offer</i>
                  </p>
                  <div className="termscondcont">
                    <p>Agree to Terms and Conditions*</p>
                    <input
                      type="checkbox"
                      name="termsConditions"
                      value={termsConditions}
                      required
                    ></input>
                  </div>
                  <div className="modalBtnCont">
                    <button>Confirm and Book</button>
                  </div>
                </form>
              </Fragment>
            {/* ) : ( */}
              <Fragment>
                {" "}
                <h2 className="modalMessage">The Next Step..</h2>
                <p className="modalMessage">Booking at: {bookingTime}</p>
                {/* <p className="modalMessage">{errors || message}</p> */}
              </Fragment>
            {/* )} */}
          </div>
        </div>
      );
    };

  //close modal
  const onModalClose = (e) => {
    setModal(initialStateModal);
  };

  //google autocomplete handlers auto-fill bug
  const onFocus = (event) => {
    if (event.target.autocomplete) {
      event.target.autocomplete = "";
    }
  };
  const onBlur = (event) => {
    if (this.state.locationCheck === false) {
      event.target.value = "";
    }
  };
  const handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  const handleAddressSubmit = (event) => {
    event.preventDefault();
    if (event.target.id === "checkDistance") {
      const locationData = {
        sellerId: this.props.data.availabilities.userId,
        buyerLocation: this.state.exactLocation,
        transportMethod: this.state.transportMethod,
      };
      this.props.CalculateDistance(locationData);
    }
  };

  let availabilities = calendar.availabilities;
  let { state, suburb, postcode } = calendar;

  const { transportMethod, calculatedDistance, calculatedDuration } = location;

  return (
    <div className="calendarContainer">
      {/* about section */}
      <div className="aboutSection">
        <div className="calendarImage">
          <img
            className="exchangeimg"
            src={exchangeimg}
            alt="calendar images"
          ></img>
        </div>
        <div className="pageDescription">
          <div className="pageDescriptionContainer">
            <p>
              You're viewing <b>Hilary's</b> G'Drop
            </p>
            <p>
              <b>G'drop makes re-sellling easier!</b>
            </p>
            <p>
              Continue to discover make a sale from Gumtree, Facebook
              marketplace, but just make it easier by cutting out the back and
              fourth with delivery, payment and scheduling help.
            </p>
          </div>
        </div>
      </div>

      {/* distance calculator */}

      <div className="distanceSection">
        <div className="distanceCalculator">
          <form
            onSubmit={handleAddressSubmit}
            onChange={handleChange}
            autoComplete="off"
            id="checkDistance"
          >
            <input
              className="hiddenInput"
              autoComplete="false"
              name="hidden"
              type="text"
            ></input>
            <div>
              <h3>Distance and options to your address</h3>
              <Autocomplete
                data-id="0"
                name="autoLocation"
                className="checkDistanceInput"
                required
                onBlur={onBlur}
                placeholder="Select Location"
                onPlaceSelected={(place) => {
                  setLocation((prevState) => ({
                    ...prevState,
                    exactLocation: place.formatted_address,
                    postcode:
                      place.address_components[
                        place.address_components.length - 1
                      ].long_name,
                    state:
                      place.address_components[
                        place.address_components.length - 3
                      ].short_name,
                    locationCheck: true,
                  }));
                }}
                types={["address"]}
                componentRestrictions={{ country: "au" }}
                onFocus={onFocus}
              />
            </div>

            <h4>Transport Method</h4>
            <div className="transportMethodBtns">
              <select
                name="transportMethod"
                className="editTimeInputs"
                value={transportMethod}
                required
              >
                <option value="driving" selected>
                  Driving
                </option>
                <option value="walking">Walking</option>
                <option value="bicycling">Bicycle</option>
                <option value="transit">Public Transport</option>
              </select>

              <button type="submit" className="settingsBtn">
                Discover
              </button>
            </div>
            {calculatedDistance !== null ? (
              <div>
                <p className="distanceCalcText">
                  {" "}
                  <b>Duration by {transportMethod}: </b> {calculatedDuration}{" "}
                </p>
                <p className="distanceCalcText">
                  <b>Distance to seller:</b> {calculatedDistance}
                </p>
              </div>
            ) : null}
          </form>
        </div>
        <div className="pickupLocations">
          <h3>Pick up location(s) Options:</h3>
          {/* TODO: hide api key */}
          {/* TODO: change to a loading or not loading so they don't see the empty map */}
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${suburb}+${state}+AU&zoom=14&size=300x300&markers=color:red||${suburb}+${state}+AU&key=AIzaSyAMx8UE3xmQW9t1o1pN6tsaBsaXM3y8LpM`}
            className="mapImg"
            alt="calendar images"
          ></img>
          <p>
            {suburb} {postcode}
          </p>
          <p> {state}</p>
        </div>
      </div>

      <div className="transactionOptions">
        <div className="deliveryMethods">
          <img
            className="deliveryimg"
            src={deliverymethod}
            alt="calendar images"
          ></img>
          <div className="deliveryMethodsText">
            <h3>Delivery:</h3>
            <p>Delivery Available: No</p>
            <p>Charge fee for delivery: No</p>
            <h3>Postage: </h3>
            <p>No</p>
          </div>
        </div>

        <div className="paymentMethods">
          <img
            className="paymentimg"
            src={paymentimg}
            alt="calendar images"
          ></img>
          <div className="paymentMethodsText">
            <h3>Payment Preference:</h3>
            <p>Cash, Paypal, Bank Transfer</p>
            <h3>Deposit Required for delivery:</h3>
            <p>Delivery N/A</p>
          </div>
        </div>
      </div>

      {/* {errors !== null ? (
        <div className="calendar">
          <p>{errors.error}</p>
        </div>
      ) : Object.keys(availabilities).length ? ( */}
      <Fragment>
        <div className="calendar">
          {header()}
          {renderDays()}
          {renderCells()}
          {renderModal()}
        </div>
      </Fragment>
      {/* ) : null} */}
    </div>
  );
}
