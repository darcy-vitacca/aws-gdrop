import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuthState } from "../context/auth";

//TODO: add settings route

export default function DynamicRoute(props) {
  console.log(props.computedMatch.params)
  
  const { user } = useAuthState()
  if (props.authenticated && !user) {
    return <Redirect to="/login" />;
  } else if (props.guest && user) {
    return <Redirect to="/" />;
  } else {
    return <Route component={props.component} {...props} />;
  }
}
