//Core
import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";

//Packages
import { ScaleLoader } from "react-spinners";
import { gql, useLazyQuery } from "@apollo/client";

//graphql
const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      createdAt
      token
      userId
    }
  }
`;

export default function Login(props) {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const dispatch = useAuthDispatch()

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => {
      setErrors(err.graphQLErrors[0].extensions.errors);
      console.log(err.graphQLErrors[0].extensions.errors);
      console.log(errors);
    },
    onCompleted(data) {
      dispatch({type: 'LOGIN' , payload: data.login})
      props.history.push("/mycalendar");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser({ variables });
  };

  return (
    <div className="containerBody">
      {/* {!forgotPassword ? ( */}
      <Fragment>
        <h1>Login</h1>

        <form onSubmit={handleSubmit} id="loginForm">
          {/* login */}
          <div className="loginSection">
            <p className={errors.username ? "loginSignupLabel" : null}>
              {errors.username ?? "Username"}
            </p>
            <input
              placeholder="Username"
              className="emailLogin"
              id="username"
              name="username"
              type="username"
              value={variables.username}
              onChange={(e) =>
                setVariables({ ...variables, username: e.target.value })
              }
            ></input>
          </div>

          <div className="passwordSection">
            <p className={errors.password ? "loginSignupLabel" : null}>
              {errors.password ?? "Password"}
            </p>
            <input
              placeholder="Password"
              className="passwordLogin"
              id="password"
              name="password"
              type="password"
              value={variables.password}
              onChange={(e) =>
                setVariables({ ...variables, password: e.target.value })
              }
            ></input>
            {/* <span>
                  <Link onClick={handleForgetPassword} id="forgotPassowrd">
                    Forgot Password?
                  </Link>
                </span> */}
          </div>

          <div className="submitSpinner">
            <button
              type="submit"
              className="submitLogin"
              // disabled={loading}
            >
              Login
            </button>

            <div className="spinner">
              {/* {loading === true ? (
                    <div>
                      {" "}
                      <ScaleLoader
                        className="spinner"
                        size={240}
                        loading
                      />{" "}
                    </div>
                  ) : null}{" "} */}
            </div>
          </div>

          <div className="loginErrorsGeneral">
            <span className="helper-text">
              {/* {errors !== null ? errors.general : message} */}
            </span>
          </div>
        </form>

        <span>
          Don't have an account? Sign up <Link to="/signup">here</Link>
        </span>
      </Fragment>
      {/* ) : (
          //FORGOT PASSWORD */}
      <Fragment>
        {/* <h1>Password Reset</h1>

            <form onSubmit={handleSubmit} id="forgotPasswordForm">
              <div className="loginSection">
                <p className={errors.username ? "loginSignupLabel" : null}>username</p>
                <input
                  placeholder="username"
                  className="usernameLogin"
                  id="forgotPasswordusername"
                  name="forgotPasswordusername"
                  type="username"
                  value={variables.forgotPasswordusername}
                  onChange={handleChange}
                ></input>
                <p>Please enter your username associated with your account</p>
              </div>

              <div className="submitSpinner">
                <button
                  type="submit"
                  className="submitLogin"
                  disabled={loading}
                >
                  Reset Password
                </button>

                <div className="spinner">
                  {loading === true ? (
                    <div>
                      {" "}
                      <ScaleLoader
                        className="spinner"
                        size={240}
                        loading
                      />{" "}
                    </div>
                  ) : null}{" "}
                </div>
              </div>

              <div className="loginErrorsGeneral">
                <span className="helper-text">
                  {errors !== null ? errors.error : null}
                </span>
              </div>
            </form>

            <span>
              Don't have an account? Sign up <Link to="/signup">here</Link>
            </span> */}
      </Fragment>
      {/* )} */}
    </div>
  );
}
