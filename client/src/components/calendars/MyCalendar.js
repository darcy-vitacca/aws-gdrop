//Core
import React, { Fragment, useState, useEffect } from "react";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useCalendarDispatch, useCalendarState } from "../../context/calendar";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import dateFns from "date-fns";

import deletedash from "../../images/deletedash.png";
import "../../css/calendar.css"

//Packages
import { v4 as uuid } from "uuid";
// import { ScaleLoader } from "react-spinners";
//Dropdowns
const { TwentyFourHourTime } = require("../../util/dropdowns");

//graphql
const GET_MY_CALENDAR = gql`
  query getMyCalendar($userId: String!) {
    getMyCalendar(userId: $userId) {
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
      state suburb postcode
    }
  }
`;
const SET_AVAILABILITIES = gql`
  mutation setAvail($input: [availabilities]!) {
    setAvail(input: $input) {
          message
    }
  }
`;

//TODO: delete doesn't work on it doesn't update the database

export default function MyCalendar(props) {
  const AuthDispatch = useAuthDispatch();
  const { user } = useAuthState();

  const CalendarDispatch = useCalendarDispatch();
  const { calendar } = useCalendarState();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [edit, setEditing] = useState({
    editing: false,
    time0: "",
    time1: "",
  });

  const [
    getMyCalendar,
    { loading: calendarLoading, data: calendarData, errors },
  ] = useLazyQuery(GET_MY_CALENDAR, {
    onError: (err) => console.log(err),
  });

  const [setAvailabilities] = useMutation(SET_AVAILABILITIES, {
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    getMyCalendar({ variables: { userId: user.userId } });
    if (calendarData) {
      CalendarDispatch({
        type: "SET_MY_CALENDAR",
        payload: {
          availabilities: calendarData.getMyCalendar.availabilities.reduce(
            (obj, item) => Object.assign(obj, { [item.date]: item }),
            {}
          ),
          bookings: calendarData.getMyCalendar.bookings.reduce(
            (obj, item) => Object.assign(obj, { [item.date]: item }),
            {}
          ),
          state: calendarData.getMyCalendar.state,
          suburb: calendarData.getMyCalendar.suburb,
          postcode: calendarData.getMyCalendar.postcode,
        },
      });
    }
  }, [calendarData]);

  if (errors) {
    console.log(errors);
  }

  const handleChange = (e) => {
    if (e.target.id === "time0") {
      setEditing({ ...edit, time0: e.target.value });
    } else if (e.target.id === "time1") {
      setEditing({ ...edit, time1: e.target.value });
    }
  };

  const addAvailability = (e) => {
    e.preventDefault();
    const { time0, time1 } = edit;
    const dateFormat = "DD-M-YYYY";
    const formattedDate = dateFns.format(selectedDate, dateFormat);

    let newDate = {
      [formattedDate]: { start: time0, end: time1, date: formattedDate },
    };

    CalendarDispatch({
      type: "ADD_AVAILABILITY",
      payload: newDate,
    });
  };

  const logout = () => {
    AuthDispatch({ type: "LOGOUT" });
    props.history.push("/login");
  };

  const UpdateAvailibilites = (e) => {
    setEditing({ editing: !editing });
    setAvailabilities({
      variables: {
        input: Object.entries(calendar.availabilities).map((e) => {
          return {
            date: e[1].date,
            start: e[1].start,
            end: e[1].end,
          };
        }),
      },
    });
  };

  // //HEADER //HEADER //HEADER //HEADER //HEADER //HEADER
  const header = () => {
    let availabilities = calendar.availabilities;
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

  const onDateClick = (day) => {
    setSelectedDate(day);
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
    // console.log(availabilities)

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
            onClick={() => onDateClick(dateFns.parse(cloneDay))}
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

  const timeRange = () => {
    const { time0, time1 } = edit;
    let availabilities = calendar.availabilities;
    const dateFormat = "DD-M-YYYY";
    const formattedDate = dateFns.format(selectedDate, dateFormat);

    return (
      <Fragment>
        <form onChange={handleChange} onSubmit={addAvailability}>
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
          {formattedDate in availabilities ? (
            <img
              className="deleteIcon"
              src={deletedash}
              alt="Delete Availability"
              onClick={() => {
                CalendarDispatch({
                  type: "DELETE_AVAILABILITY_DATE",
                  payload: formattedDate,
                });
              }}
            ></img>
          ) : null}
        </form>
      </Fragment>
    );
  };

  const renderDaySection = () => {
    const { editing } = edit;
    let availabilities = calendar.availabilities;
    const headerFormat = "DD MMMM";
    const dateFormat = "DD-M-YYYY";
    const formattedDate = dateFns.format(selectedDate, dateFormat);

    if (formattedDate in availabilities) {
      return (
        <Fragment>
          <p>{dateFns.format(selectedDate, headerFormat)}</p>
          <p>Availibilites from:</p>
          <p>{`${availabilities[formattedDate]["start"]} - ${availabilities[formattedDate]["end"]}`}</p>
          {editing ? timeRange() : null}
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <p>{dateFns.format(selectedDate, headerFormat)}</p>
          <p>No availabilities</p>
          {editing ? timeRange() : null}
        </Fragment>
      );
    }
  };


  const { editing } = edit;
  return (
    <div>
      <Fragment>
        <div className="calendar">
          <p>My Calendar</p>
          <button onClick={logout}>Logout</button>
          <p>
            {" "}
            Link to share with people:{" "}
            {/* <a href={`https://g-drop.firebaseapp.com/calendar/${userId}`}>
                  https://g-drop.firebaseapp.com/calendar/{userId}
                  </a>{" "} */}
            {/* <a href={`http://localhost:3000/calendar/${user.userId}`}>
                   http://localhost:3000/calendar/{user.userId}
                  </a>{" "} */}
            <a href={`https://app.gdrop.co/calendar/${user.userId}`}>
              https://app.gdrop.co/calendar/{user.userId}
            </a>{" "}
          </p>

          <p>
            {/* My location: {exactLocation} */}. To change click to settings...{" "}
            <Link to="/settings">here</Link>
          </p>
          {!editing ? (
            <button onClick={() => setEditing({ editing: !editing })}>
              Edit
            </button>
          ) : (
            //TODO: need to send the request with updated state
            <button onClick={() => UpdateAvailibilites()}>Save</button>
          )}
          {/* {errors !== null ? (<Fragment>
                  <p>{errors}</p>
                  </Fragment>) : (<Fragment><p>{message}</p></Fragment>)} */}
          {/* {errors !== null ? console.log("here") : console.log("here1")} */}

          {header()}
          {renderDays()}
          {renderCells()}
        </div>
        <div className="calendar">{renderDaySection()}</div>
      </Fragment>
      {/* <div className="spinner">
            {loading === true ? (
              <div>
                {" "}
                <ScaleLoader className="spinner" size={240} loading />{" "}
              </div>
            ) : null}{" "}
          </div> */}
    </div>
  );
}
