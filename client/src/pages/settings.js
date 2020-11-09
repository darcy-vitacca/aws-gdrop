//Core
import React, { Fragment, useState } from "react";
import { useAuthDispatch, useAuthState } from "../context/auth";
import { gql, useMutation } from "@apollo/client";

import deletedash from "../images/editdash.png";
import editdash from "../images/editdash.png";

//Packages
import Autocomplete from "react-google-autocomplete";
import ReactTooltip from "react-tooltip";
// import { ScaleLoader } from "react-spinners";
// import { uuid } from "uuidv4";
//TODO: need to add change username and change password

const SET_LOCATION = gql`
  mutation setLocation(
    $exactLocation: String!
    $postcode: String!
    $state: String!
    $suburb: String!
  ) {
    setLocation(
      exactLocation: $exactLocation
      postcode: $postcode
      state: $state
      suburb: $suburb
    ) {
      location
    }
  }
`;

export default function Settings(props) {
  const AuthDispatch = useAuthDispatch();
  const { user } = useAuthState();

  const initialStateLocation = {
    locationCheck: false,
    changingLocation: false,
    exactLocation: "",
    postcode: "",
    state: "",
    suburb: "",
  };
  const initialStatePassword = {
    changingPassword: false,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  const initialStateEmail = {
    changingEmail: false,
    newEmail: "",
    emailPassword: "",
  };

  const [location, setLocation] = useState(initialStateLocation);
  const [password, setPassword] = useState(initialStatePassword);
  const [email, setEmail] = useState(initialStateEmail);

  const [updateLocation] = useMutation(SET_LOCATION, {
    onError: (err) => console.log(err),
  });
  // const [updatePassword] = useMutation(SET_AVAILABILITIES, {
  //   onError: (err) => console.log(err),
  // });
  // const [updateEmail] = useMutation(SET_AVAILABILITIES, {
  //   onError: (err) => console.log(err),
  // });

  //google autocomplete handlers auto-fill bug
  const onFocus = (event) => {
    if (event.target.autocomplete) {
      event.target.autocomplete = "";
    }
  };
  const onBlur = (event) => {
    if (location.locationCheck === false) {
      event.target.value = "";
    }
  };
  const handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event.target.id);
    if (event.target.id === "updateLocation") {
      console.log(location);
      updateLocation({
        variables: location,
      });
      setEmail({ initialStateEmail });
      setLocation({ initialStateLocation });
      setPassword({ initialStatePassword });
    }
    if (event.target.id === "updatePassword") {
      setEmail({ initialStateEmail });
      setLocation({ initialStateLocation });
      setPassword({ initialStatePassword });
    } else if (event.target.id === "updateEmail") {
      setEmail({ initialStateEmail });
      setLocation({ initialStateLocation });
      setPassword({ initialStatePassword });
    }
  };

  const { 
    // exactLocation, postcode, state, suburb, 
    changingLocation } = location;
  const {
    oldPassword,
    newPassword,
    confirmPassword,
    changingPassword,
  } = password;
  const { 
    // emailPassword,
    newEmail,  changingEmail } = email;

  let settingsMarkup;
  if (changingLocation) {
    settingsMarkup = (
      <Fragment>
        <form onSubmit={handleSubmit} autoComplete="off" id="updateLocation">
          <input
            className="hiddenInput"
            autoComplete="false"
            name="hidden"
            type="text"
          ></input>
          <div>
            <h3>Set Location</h3>
            <Autocomplete
              data-id="0"
              name="autoLocation"
              required
              onBlur={onBlur}
              placeholder="Select a Location from the dropdown"
              onPlaceSelected={(place) => {
                setLocation((prevState) => ({
                  ...prevState,
                  exactLocation: place.formatted_address,
                  suburb:
                    place.address_components[
                      place.address_components.length - 5
                    ].long_name,

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
              onFocus={onFocus}
            />
          </div>
          <button type="submit" className="settingsBtn">
            Submit
          </button>
        </form>
      </Fragment>
    );
  } else if (changingEmail) {
    settingsMarkup = (
      <Fragment>
        <form id="updateEmail" onChange={handleChange} onSubmit={handleSubmit}>
          <div className="updateEmails">
            <h4>New Email</h4>
            <input
              type="email"
              placeholder="New email"
              name="newEmail"
              value={newEmail}
            ></input>

            <h4>Enter password</h4>
            <input
              type="password"
              name="password"
              value={newPassword}
              placeholder="Enter password to confirm email update"
            ></input>
          </div>
          <button type="submit" className="settingsBtn">
            Submit
          </button>
        </form>
      </Fragment>
    );
  } else if (changingPassword) {
    settingsMarkup = (
      <Fragment>
        <form
          id="updatePassword"
          onChange={handleChange}
          onSubmit={handleSubmit}
        >
          <div className="updatePassword">
            <h4>Old Password</h4>
            <input
              type="password"
              name="oldPassword"
              value={oldPassword}
              placeholder="Old password"
            ></input>
            <h4>New Password</h4>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              placeholder="New password"
            ></input>
            <h4>Confirm Password</h4>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm new password"
            ></input>
          </div>
          <button type="submit" className="settingsBtn">
            Submit
          </button>
        </form>
      </Fragment>
    );
  } else {
    settingsMarkup = null;
  }

  return (
    <div className="settingsContainer">
      {/* {!loading ? (
       */}
      <div className="accountContainer">
        <h1 className="accountHeader">Settings</h1>
        <div className="settingsCard">
          {/* TODO: set delivery radius */}
          <h4>Set Location</h4>
          <img
            className="editDeleteIcon"
            src={deletedash}
            alt="Set Location Details"
            data-tip="Set Location Details"
            data-place="bottom"
            onClick={() => {
              if (window.confirm(`Set Location?`))
                setLocation({
                  changingLocation: true,
                });
              setEmail({ initialStateEmail });
              setPassword({ initialStatePassword });
            }}
          ></img>
          <ReactTooltip />
        </div>

        <p className="settingsText">Set your location and delivery radius</p>

        <div className="settingsCard">
          <h4>Edit Account Details</h4>
          <img
            className="editDeleteIcon"
            src={editdash}
            alt="Change Account Details"
            data-tip="Change Account Details"
            data-place="bottom"
            onClick={() => {
              if (window.confirm(`Are you sure you want edit your email?`))
                setEmail({
                  changingEmail: true,
                });
              setPassword({ initialStatePassword });
              setLocation({ initialStateLocation });
            }}
          ></img>
          <ReactTooltip />
        </div>

        <p className="settingsText">
          Edit your account details that you use to login with and recieve
          correspondance to
        </p>

        <div className="settingsCard">
          <h4>Change Password</h4>
          <img
            className="editDeleteIcon"
            src={editdash}
            alt="Change Password"
            data-tip="Change Password"
            data-place="bottom"
            onClick={() => {
              if (window.confirm(`Are you sure you want change your password?`))
                setPassword({
                  changingPassword: true,
                });
              setEmail({ initialStateEmail });
              setLocation({ initialStateLocation });
            }}
          ></img>
          <ReactTooltip />
        </div>
        <p className="settingsText">Change your password that you login with</p>

        <div className="settingsCard">
          <h4>Delete Account</h4>
          <img
            className="editDeleteIcon"
            src={deletedash}
            alt="Delete Account"
            data-tip="Delete Account"
            data-place="bottom"
            onClick={() => {
              if (
                window.confirm(`Are you sure you want to delete your account?`)
              )
                this.props.DeleteAccount(
                  user.username,
                  user.userId,
                  this.props.history
                );
            }}
          ></img>
          <ReactTooltip />
        </div>
        <p className="settingsText">Delete your account of G'drop</p>

        <span className="helper-text">
          {/* {errors !== null ? errors.error : message} */}
        </span>
        <div className="settingsUpdate">{settingsMarkup}</div>
      </div>
      {/* ) ) : ( */}
      {/* <div className="spinner">
        {loading === true ? (
          <div>
            {" "}
            <ScaleLoader className="spinner" size={240} loading />{" "}
          </div>
        ) : null}{" "}
      </div> */}
      {/* )} */}
    </div>
  );
}
