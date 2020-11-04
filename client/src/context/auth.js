import React, { createContext, useReducer, useContext } from "react";
import jwtDecode from "jwt-decode";

//we create context to hold the state and dispatch auth
const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

//this is like pasing the original state
let user = null;

const token = localStorage.getItem("token");
if (token) {
  const decodedToken = jwtDecode(token);
  const expiresAt = new Date(decodedToken.exp * 1000);
  if (new Date() > expiresAt) {
    localStorage.removeItem("token");
  } else {
    //this sets if there is a token a user to the context using code
    user = decodedToken;
  }
} else {
  console.log("No token found");
}

//this takes auth actions and sets the to state, state is what we pass in  in the auth provider to revert to is original
const authReducer = (state, action) => {
  switch (action.type) {
    //we set the token here

    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload,
      };

    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

// this uses the children compoent because it's going to take the actual markup through it from the app
export const AuthProvider = ({ children }) => {
  // we pass an initial state here in the second arg because we check for user
  const [state, dispatch] = useReducer(authReducer, { user });
  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

//We export these with use context so we don't have to
export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
