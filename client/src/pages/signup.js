//Core
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { gql, useMutation } from "@apollo/client";

//graphql
const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      userId username email createdAt
    }
  }
`;

export default function Signup(props) {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, __) => props.history.push("/login"),
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    //you have to name and pass variables because it's what the thing accepts
    registerUser({variables});
  };

  return (
    <div className="containerBody">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div className="signupSection">
          {/* email */}
          <p className={errors.email ? "loginSignupLabel" : null}>{errors.email ?? "Email Address"}</p>
          <input
            placeholder="Email"
            className="emailSignup"
            id="email"
            name="email"
            type="email"
            value={variables.email}
            onChange={(e) =>
              setVariables({ ...variables, email: e.target.value })
            }
          ></input>
          {/* <span className="helper-text">{errors.email}</span> */}
        </div>

        {/* password */}
        <div className="passwordSection">
          <p className={errors.password ? "loginSignupLabel" : null}>
            
            {errors.password ?? "Password (6 characters in length)"}
            </p>
          <input
            placeholder="Password"
            className="passwordSignup"
            id="password"
            name="password"
            type="password"
            value={variables.password}
            onChange={(e) =>
              setVariables({ ...variables, password: e.target.value })
            }
          ></input>
          {/* <span className="helper-text">{errors.password}</span> */}
        </div>
        {/* confrim password */}
        <div className="passwordSection">
          <p className={errors.confirmPassword ? "loginSignupLabel" : null}>
            
            {errors.confirmPassword ?? "Confirm Password"}
            </p>
          <input
            placeholder="Confirm Password"
            className="passwordSignup"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={variables.confirmPassword}
            onChange={(e) =>
              setVariables({ ...variables, confirmPassword: e.target.value })
            }
          ></input>
          {/* <span className="helper-text">{errors.confirmPassword}</span> */}
        </div>
        {/* Handle */}
        <div className="passwordSection">
          <p className={errors.username ? "loginSignupLabel" : null}>
            {errors.username ?? "Username"}
            </p>
          <input
            placeholder="Username"
            className="handle"
            id="handle"
            name="handle"
            type="text"
            value={variables.username}
            onChange={(e) =>
              setVariables({ ...variables, username: e.target.value })
            }
          ></input>
          {/* <span className="helper-text">{errors.handle}</span> */}
        </div>

        <div className="submitSpinner">
          <button
            type="submit"
            class="submitButton"
            // disabled={loading}
          >
            Signup
          </button>
          <div className="spinner">
            {/* {loading === true ? (
                <div>
                  {" "}
                  <ScaleLoader className="spinner" size={240} loading />{" "}
                </div>
              ) : null}{" "} */}
          </div>
        </div>

        <div className="signupErrorsGeneral">
          {/* <span className="helper-text">{errors.general}</span> */}
        </div>
      </form>
      <span>
        Already have an account? Login <Link to="/login">here</Link>
      </span>
    </div>
  );
}

