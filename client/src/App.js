//Core
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import ApolloProvider from "./ApolloProvider";

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
      <Router>
        <div className="container">
          <Route component={Nav} />
          <div className="AppBody">
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/mycalendar" component={MyCalendar} />
              <Route path="/settings" component={Settings} />
              <Route path="/contact" component={Contact} />
              <Route exact path="/calendar/:userid" component={Calendar} />
              <Route path="/comingsoon" component={ComingSoon} key={uuid()} />
              <Route path="/beta" component={Beta} key={uuid()} />
            </Switch>
          </div>
          <Route component={Footer} />
        </div>
      </Router>
      </ApolloProvider>
  );
}

export default App;
