//Core
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import ApolloProvider from "./ApolloProvider";
//When something isn't the export default we destrcuture it
import { AuthProvider } from "./context/auth";
import { CalendarProvider } from "./context/calendar";
import DynamicRoute from "./util/DynamicRoute";

//Pages
import Nav from "./components/nav/nav";
import Home from "./pages/home";
import Login from "./pages/login";
import Footer from "./pages/footer";
import Signup from "./pages/signup";
import Contact from "./pages/contact";
import Settings from "./pages/settings";
import Beta from "./pages/beta";
import ComingSoon from "./pages/comingsoon";
import Calendar from "./components/calendars/Calendar.js";
import MyCalendar from "./components/calendars/MyCalendar.js";

//Package
import { v4 as uuid } from "uuid";
import axios from "axios";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <CalendarProvider>
          <Router>
            <div className="container">
              <Route component={Nav} />
              <div className="AppBody">
                <Switch>
                  <Route path="/" exact component={Home} />
                  <DynamicRoute path="/login" component={Login} guest />
                  <DynamicRoute path="/signup" component={Signup} guest />
                  <DynamicRoute
                    path="/mycalendar"
                    component={MyCalendar}
                    authenticated
                  />
                  <DynamicRoute path="/settings" component={Settings} authenticated/>
                  <Route path="/contact" component={Contact} />
                  <Route exact path="/calendar/:userid" component={Calendar} />
                  <Route
                    path="/comingsoon"
                    component={ComingSoon}
                    key={uuid()}
                  />
                  <Route path="/beta" component={Beta} key={uuid()} />
                </Switch>
              </div>
              <Route component={Footer} />
            </div>
          </Router>
        </CalendarProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
