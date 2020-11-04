import React, { createContext, useReducer, useContext } from "react";

const CalendarStateContext = createContext();
const CalendarDispatchContext = createContext();

const calendarReducer = (state, action) => {
  switch (action.type) {
    case "SET_MY_CALENDAR":
      return {
        calendar: {
          ...state.calendar,
          availabilities: action.payload.availabilities,
          bookings: action.payload.bookings,
          state: action.payload.state,
          suburb: action.payload.suburb,
          postcode: action.payload.postcode,
        },
      };
      case "SET_CALENDAR":
        return {
          calendar: {
            ...state.calendar,
            availabilities: action.payload.availabilities,
            bookings: action.payload.bookings,
            state: action.payload.state,
            suburb: action.payload.suburb,
            postcode: action.payload.postcode,
          },
        };

    case "ADD_AVAILABILITY":
      return {
        calendar: {
          ...state.calendar,
          availabilities: {
            ...state.calendar.availabilities,
            [Object.keys(action.payload)[0]]: Object.entries(action.payload)[0][1],
          },
        },
      };

    case "DELETE_AVAILABILITY_DATE":
      console.log(state.calendar.availabilities);
      delete state.calendar.availabilities[action.payload];
      return {
        ...state,
        //   availabilities: state.availabilities,
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const CalendarProvider = ({ children }) => {
  //we are going to fetch and store messages here and each time we click on another user it will get stored in the context
  const [state, dispatch] = useReducer(calendarReducer, {
    calendar: {
      availabilities: [],
      bookings: [],
    },
  });
  return (
    <CalendarDispatchContext.Provider value={dispatch}>
      <CalendarStateContext.Provider value={state}>
        {children}
      </CalendarStateContext.Provider>
    </CalendarDispatchContext.Provider>
  );
};

export const useCalendarState = () => useContext(CalendarStateContext);
export const useCalendarDispatch = () => useContext(CalendarDispatchContext);
