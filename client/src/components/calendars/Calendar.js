//Core
import React, { Component, Fragment } from "react";

import dateFns from "date-fns";
import "../../css/calendar.css";


//Packages
import { v4 as uuid } from "uuid";
import Autocomplete from "react-google-autocomplete";
//Dropdowns
const { TwentyFourHourTime30mins } = require("../../util/dropdowns");

class Calendar extends Component {
  constructor() {
    super();
    this.state = {
      TwentyFourHourTime30mins: TwentyFourHourTime30mins,
      currentMonth: new Date(),
      selectedDate: new Date(),
      selectedAvailability: [],
      dayMode: false,
      locationCheck: false,
      exactLocation: "",
      postcode: "",
      state: "",
      transportMethod: "driving",
      showModal: false,
      modalInfo: {
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
      },
    };
  }

  componentWillUnmount() {
    if (this.props.UI.errors !== null) {
      this.props.pageChangeErrorClear();
    }
    if (this.props.UI.message !== null) {
      this.props.pageChangeErrorClear();
    }
  }
 
  //TODO: long and lattitude saving twice into calendar table
  //TODO: bug when changing from this calendar to my calednar
  componentDidMount() {
    this.props.GetCalendar(this.props.match.params.userid, this.props.history);
  }

  // //HEADER //HEADER //HEADER //HEADER //HEADER //HEADER
  renderHeader() {
    const dateFormat = "MMMM YYYY";
    let currentMonthLimit = new Date();
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          {currentMonthLimit.getMonth() < this.state.currentMonth.getMonth() ? (
            <div className="icon" onClick={this.prevMonth}>
              chevron_left
            </div>
          ) : (
            <div className="iconDisabled" onClick={this.prevMonth}>
              chevron_left
            </div>
          )}
        </div>
        <div className="col col-center">
          <span>Availability</span>
          <span className="monthTextCalendar">
            {dateFns.format(this.state.currentMonth, dateFormat)}
          </span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1),
    });
  };

  prevMonth = () => {
    let currentMonthLimit = new Date();

    if (currentMonthLimit.getMonth() < this.state.currentMonth.getMonth()) {
      this.setState({
        currentMonth: dateFns.subMonths(this.state.currentMonth, 1),
      });
    }
  };

  //DAYS //DAYS //DAYS //DAYS //DAYS //DAYS //DAYS
  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

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
  }

  //CELLS //CELLS //CELLS  //CELLS  //CELLS  //CELLS
  //TODO: when it get's past january it you can't go backwards
  renderCells() {
    const { availabilities } = this.props.data;
    const { currentMonth, selectedDate } = this.state;
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
              (dateId in availabilities && dateFns.isSameMonth(day, monthStart)) && (day >= currentDay)
                ? "available"
                : ""
            }`}
            key={day}
            onClick={(e) => this.onDateClick(e, dateFns.parse(cloneDay))}
          >
            {//Checks if dateId matches an availibility and either puts out an emmpty day or the time and also checks for same month
            (dateId in availabilities && dateFns.isSameMonth(day, monthStart)) && (day >= currentDay)  ? (
              <Fragment>
                <span
                  className="number"
                  id={`${formattedDate}-${monthRef}-${yearRef}`}
                  key={uuid()}
                >
                  {formattedDate}
                </span>

                <span className="availabilitesTime">{`${
                  availabilities[`${dateId}`][0]
                } - ${availabilities[`${dateId}`][1]}`}</span>
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
  }

  onDateClick = (e, day) => {
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
      this.setState({
        selectedAvailability: [
          selectedAvailability[0],
          selectedAvailability[2],
        ],
        showModal: !this.state.showModal,
      });
    }

    this.setState({
      selectedDate: day,
    });
  };

  modalSubmit = (event) => {
    event.preventDefault();
    let { selectedDate} = this.state;
    let {
      bookingTime,
      location,
      item,
      price,
      paymentMethod,
      buyerName,
      buyerEmail,
      buyerNumber,
      termsConditions,
      marketplace,
    } = this.state.modalInfo;

    const dateFormat = "dddd Do MMMM YYYY";
   
    const formData = {
      selectedDate :  dateFns.format(selectedDate, dateFormat),
      marketplace: marketplace,
      bookingTime: bookingTime,
      location: location,
      item: item,
      price: price,
      paymentMethod: paymentMethod,
      buyerName: buyerName,
      buyerEmail: buyerEmail,
      buyerNumber: buyerNumber,
      termsConditions: termsConditions,
    };
    // console.log(formData)
    this.props.ContactForm(formData, this.props.history);
  };

  handleModalChange = (event) => {
    if (event.target.name === "termsConditions") {
      this.setState({
        modalInfo: {
          ...this.state.modalInfo,
          [event.target.name]: !this.state.modalInfo.termsConditions,
        },
      });
    } else {
      this.setState({
        modalInfo: {
          ...this.state.modalInfo,
          [event.target.name]: event.target.value,
        },
      });
    }
  };
  //render modal
  renderModal = (e) => {
    let { selectedAvailability , selectedDate} = this.state;
    let { errors, message } = this.props.UI;
    const dateformatted = 'dddd Do MMM'

    let { suburb, postcode } = this.props.data.availabilities;
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
    } = this.state.modalInfo;
    return (
      <div className={this.state.showModal ? "modalCont" : "hideModal"}>
        <div className="modal-content">
          <h2 className="modalMessage">{dateFns.format(selectedDate, dateformatted)}</h2>
          <span
            className="close"
            onClick={() => {
              this.onModalClose();
            }}
          >
            &times;
          </span>

          {errors || message === null ? (
            <Fragment>
              <form
                className="modalForm"
                onSubmit={this.modalSubmit}
                onChange={this.handleModalChange}
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
          ) : (
            <Fragment>
              {" "}
              <h2 className="modalMessage">The Next Step..</h2>
              <p className="modalMessage">Booking at: {bookingTime}</p>
              <p className="modalMessage">{errors || message}</p>
              
            </Fragment>
          )}
        </div>
      </div>
    );
  };

  //close modal
  onModalClose = (e) => {
    this.props.pageChangeErrorClear();
    this.setState({
      showModal: !this.state.showModal,
      selectedAvailability: [],
      modalInfo: {
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
      },
    });
  };

  renderDaySection = () => {
    const { availabilities } = this.props.data;
    const { selectedDate } = this.state;

    const headerFormat = "DD MMMM";
    const dateFormat = "DD-M-YYYY";
    const formattedDate = dateFns.format(selectedDate, dateFormat);

    if (formattedDate in availabilities) {
      return (
        <Fragment>
          <p>{dateFns.format(selectedDate, headerFormat)}</p>
          <p>Availibilites from:</p>
          <p>{`${availabilities[formattedDate][0]} - ${availabilities[formattedDate][1]}`}</p>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <p>{dateFns.format(selectedDate, headerFormat)}</p>
          <p>No availabilities</p>
        </Fragment>
      );
    }
  };

  //google autocomplete handlers auto-fill bug
  onFocus = (event) => {
    if (event.target.autocomplete) {
      event.target.autocomplete = "";
    }
  };
  onBlur = (event) => {
    if (this.state.locationCheck === false) {
      event.target.value = "";
    }
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleAddressSubmit = (event) => {
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
  

  render() {
    
    const { availabilities } = this.props.data;
    const { errors } = this.props.UI;
    const {calculatedDistance } = this.props.user;
    const { transportMethod } = this.state;


  
 
    return (
      <div className="calendarContainer">
        {/* about section */}
        <div className="aboutSection">
          <div className="calendarImage">
            <img
              className="exchangeimg"
              src={require("../../images/exchangeimg.svg")}
             alt="calendar images"></img>
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
          <div></div>
          <div className="distanceCalculator">
            <form
              onSubmit={this.handleAddressSubmit}
              onChange={this.handleChange}
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
                  onBlur={this.onBlur}
                  placeholder="Select Location"
                  onPlaceSelected={(place) => {
                    this.setState((prevState) => ({
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
                  onFocus={this.onFocus}
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
                    <b>Duration by {transportMethod}: </b>{" "}
                    {calculatedDistance.duration}{" "}
                  </p>
                  <p className="distanceCalcText">
                    <b>Distance to seller:</b> {calculatedDistance.distance}
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
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${availabilities.suburb}+${availabilities.state}+AU&zoom=14&size=300x300&markers=color:red||${availabilities.suburb}+${availabilities.state}+AU&key=AIzaSyAMx8UE3xmQW9t1o1pN6tsaBsaXM3y8LpM`}
              className="mapImg"
             alt="calendar images"></img>
            <p>
              {availabilities.suburb} {availabilities.postcode}
            </p>
            <p>{availabilities.state}</p>
          </div>
        </div>

        <div className="transactionOptions">
          <div className="deliveryMethods">
            <img
              className="deliveryimg"
              src={require("../../images/deliverymethod.svg")}
             alt="calendar images"></img>
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
              src={require("../../images/paymentmethod.svg")}
             alt="calendar images"></img>
            <div className="paymentMethodsText">
              <h3>Payment Preference:</h3>
              <p>Cash, Paypal, Bank Transfer</p>
              <h3>Deposit Required for delivery:</h3>
              <p>Delivery N/A</p>
            </div>
          </div>
        </div>

        {errors !== null ? (
          <div className="calendar">
            <p>{errors.error}</p>
          </div>
        ) : Object.keys(availabilities).length ? (
          <Fragment>
            <div className="calendar">
              {this.renderHeader()}
              {this.renderDays()}
              {this.renderCells()}
              {this.renderModal()}
            </div>

            {/* <div className="calendar">{this.renderDaySection()}</div> */}
          </Fragment>
        ) : null}
      </div>
    );
  }
}



export default Calendar;
