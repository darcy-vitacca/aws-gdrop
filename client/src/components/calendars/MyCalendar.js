//Core
import React, { Component, Fragment } from "react";

import { Link } from "react-router-dom";
import dateFns from "date-fns";
import "../../css/calendar.css";

//Packages
import { v4 as uuid } from 'uuid';
import { ScaleLoader } from "react-spinners";
//Dropdowns
const { TwentyFourHourTime } = require("../../util/dropdowns");

class MyCalendar extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      dayMode: false,
      fetchCalendar: false,
      editing: false,
      TwentyFourHourTime: TwentyFourHourTime,
      time0: "",
      time1: "",
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
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.user.credentials.userId !== undefined &&
      this.state.fetchCalendar !== true
    ) {
      this.props.GetMyCalendar(
        nextProps.user.credentials.userId,
        this.props.history
      );
      this.setState({ fetchCalendar: !this.state.fetchCalendar });
    }

  }
 
  //TODO: handle no availibilites
  //TODO: when unmount change editing to false
  //TODO: bind functions where needed
  //TODO: when suubmitting new dates they aren't coming up in the dom
  //TODO: not updating new months outside of the day 
  //TODO: on unmount say make sure you want to save changes 
  //TODO: when going from home it's stuck on loading
  //TODO: add on signup calendar

  // //HEADER //HEADER //HEADER //HEADER //HEADER //HEADER
  handleChange = (e) => {
    if (e.target.id === "time0") {
      this.setState({ time0: e.target.value });
    } else if (e.target.id === "time1") {
      this.setState({ time1: e.target.value });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { selectedDate } = this.state;
    let { time0, time1 } = this.state;
    const dateFormat = "DD-M-YYYY";
    const formattedDate = dateFns.format(selectedDate, dateFormat);

    let newDate = {
      [formattedDate]: [time0, time1],
    };
    this.props.UpdateAvailibilites(newDate);
  };
  saveChanges = (e) =>{
    const { editing } = this.state;
    const { availabilities } = this.props.user;
    this.setState({ editing: !editing })
    this.props.SaveAvailbilities(availabilities)

  }

  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
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
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1),
    });
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
  renderCells() {
    const { availabilities } = this.props.user;
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

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
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }
            ${
              dateId in availabilities && dateFns.isSameMonth(day, monthStart)
                ? "available"
                : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            {
              //Checks if dateId matches an availibility and either puts out an emmpty day or the time and also checks for same month
              dateId in availabilities &&
              dateFns.isSameMonth(day, monthStart) ? (
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
              )
            }
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

  onDateClick = (day) => {
    this.setState({
      selectedDate: day,
    });
  };
  timeRange = () => {
    const { selectedDate, time0, time1 } = this.state;
    const dateFormat = "DD-M-YYYY";
    const formattedDate = dateFns.format(selectedDate, dateFormat);
    const { availabilities } = this.props.user;

    return (
      <Fragment>
       
        <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
        <p>Set availibity time</p>
          <select
            name={`${formattedDate} 0`}
            className="editTimeInputs"
            id="time0"
            value={time0}
            required
          >
            <option value="" disabled selected hidden>
              Start Time
            </option>
            {TwentyFourHourTime.map((time) => {
              return (
                <option key={uuid()} value={time}>
                  {" "}
                  {time}
                </option>
              );
            })}
          </select>
          :
          <select
            name={`${formattedDate} 1`}
            className="editTimeInputs"
            id="time1"
            value={time1}
            required
          >
            <option value="" disabled selected hidden>
              End Time
            </option>
            {TwentyFourHourTime.map((time) => {
              return (
                <option key={uuid()} value={time}>
                  {" "}
                  {time}
                </option>
              );
            })}
          </select>
          
          <button type="submit">submit</button>
          {formattedDate in availabilities ? (  <img
          className="deleteIcon"
          src={require("../../images/deletedash.png")}
          alt="Delete Availability"
          onClick={() => {
            this.props.DeleteAvailibility(formattedDate);
          }}
        ></img>) : null
        
  }
        </form>
       
      </Fragment>
    );
  };

  renderDaySection = () => {
    const { availabilities } = this.props.user;
    const { selectedDate, editing } = this.state;

    const headerFormat = "DD MMMM";
    const dateFormat = "DD-M-YYYY";
    const formattedDate = dateFns.format(selectedDate, dateFormat);

    if (formattedDate in availabilities) {
      return (
        <Fragment>
          <p>{dateFns.format(selectedDate, headerFormat)}</p>
          <p>Availibilites from:</p>
          <p>{`${availabilities[formattedDate][0]} - ${availabilities[formattedDate][1]}`}</p>
          {editing ? this.timeRange() : null}
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <p>{dateFns.format(selectedDate, headerFormat)}</p>
          <p>No availabilities</p>
          {editing ? this.timeRange() : null}
        </Fragment>
      );
    }
  };


  render() {
    const { errors, message } = this.props.UI;
    const {
      authenticated,
      loading,
      credentials: { exactLocation, userId },
    } = this.props.user;
    const { editing } = this.state;
    return (
      <div>
        {!loading ? (
          !authenticated ? (
            this.props.history.push("/login")
          ) : (
            <Fragment>
              <div className="calendar">
                <p>My Calendar</p>
                <p>
                  {" "}
                  Link to share with people:{" "}
                  {/* <a href={`https://g-drop.firebaseapp.com/calendar/${userId}`}>
                  https://g-drop.firebaseapp.com/calendar/{userId}
                  </a>{" "} */}
                   {/* <a href={`http://localhost:3000/calendar/${userId}`}>
                   http://localhost:3000/calendar/{userId}
                  </a>{" "} */}
      
                  <a href={`https://app.gdrop.co/calendar/${userId}`}>
                  https://app.gdrop.co/calendar/{userId}
                  </a>{" "}
          
                </p>

                <p>
                  My location: {exactLocation}. To change click{" "}
                  <Link to="/settings">here</Link>
                </p>
                {!editing ? (
                  <button onClick={() => this.setState({ editing: !editing })}>
                    Edit
                  </button>
                ) : (
                  //TODO: need to send the request with updated state
                  <button onClick={this.saveChanges}>
                    Save
                  </button>
                )}
                {/* {errors !== null ? (<Fragment>
                  <p>{errors}</p>
                  </Fragment>) : (<Fragment><p>{message}</p></Fragment>)} */}
                  {errors !== null ? (console.log("here"))
                  : (console.log("here1"))}

                {this.renderHeader()}
                {this.renderDays()}
                {this.renderCells()}
              </div>
              <div className="calendar">{this.renderDaySection()}</div>
            </Fragment>
          )
        ) : (
          <div className="spinner">
            {loading === true ? (
              <div>
                {" "}
                <ScaleLoader className="spinner" size={240} loading />{" "}
              </div>
            ) : null}{" "}
          </div>
        )}
      </div>
    );
  }
}


export default MyCalendar;
