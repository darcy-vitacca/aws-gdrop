//Core
import React, { Component } from "react";



//Packages
import Autocomplete from "react-google-autocomplete";
import ReactTooltip from "react-tooltip";
import { ScaleLoader } from "react-spinners";
// import { uuid } from "uuidv4";

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      exactLocation: "",
      postcode: "",
      state: "",
      suburb: "",
      locationCheck: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      password: "",
      newEmail: "",
      changingEmail: false,
      changingPassword: false,
      changingLocation: false,
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
  

  //google autocomplete handlers auto-fill bug
  onFocus = (event) => {
    if (event.target.autocomplete) {
      event.target.autocomplete = "";
    }
  };
  onBlur = (event) => {
    if (this.state.locationCheck === false) {
      event.target.value = "";
    }
  };
  handleChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      }
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (event.target.id === "updateLocation") {
      const newUserData = {
        exactLocation: this.state.exactLocation,
        postcode: this.state.postcode,
        state: this.state.state,
        suburb: this.state.suburb,
      };
      this.props.SetUserLocation(newUserData, this.props.history);
      this.setState({
        changingEmail: false,
        changingPassword: false,
        changingLocation: false,
      });
    }
    if (event.target.id === "updatePassword") {
      const newUserData = {
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword,
        confirmPassword: this.state.confirmPassword,
        email: this.props.user.credentials.email,
      };
      this.props.ChangePassword(newUserData, this.props.history);
      this.setState({
        changingEmail: false,
        changingPassword: false,
        changingLocation: false,
      });
    } else if (event.target.id === "updateEmail") {
      const newUserData = {
        newEmail: this.state.newEmail,
        password: this.state.password,
        oldEmail: this.props.user.credentials.email,
        handle: this.props.user.credentials.handle,
      };
      this.props.ChangeEmail(newUserData, this.props.history);
      this.setState({
        changingEmail: false,
        changingPassword: false,
        changingLocation: false,
      });
    }
  };
  //TODO: on submission update user
  render() {
    const {
      UI: { loading, errors, message },
      user: {
        authenticated,
        credentials: { userId, handle },
      },
    } = this.props;
    const { changingEmail, changingPassword, changingLocation } = this.state;
    return (
      <div className="settingsContainer">
        {!loading ? (
          !authenticated ? (
            this.props.history.push("/login")
          ) : (
            <div className="accountContainer">
              <h1 className="accountHeader">Settings</h1>
              <div className="settingsCard">
                {/* TODO: set delivery radius */}
                <h4>Set Location</h4>
                <img
                  className="editDeleteIcon"
                  src={require("../images/editdash.png")}
                  alt="Set Location Details"
                  data-tip="Set Location Details"
                  data-place="bottom"
                  onClick={() => {
                    if (window.confirm(`Set Location?`))
                      this.setState({
                        changingPassword: false,
                        changingLocation: !this.state.changingLocation,
                        changingEmail: false,
                      });
                  }}
                ></img>
                <ReactTooltip />
              </div>

              <p className="settingsText">
                Set your location and delivery radius
              </p>

              <div className="settingsCard">
                <h4>Edit Account Details</h4>
                <img
                  className="editDeleteIcon"
                  src={require("../images/editdash.png")}
                  alt="Change Account Details"
                  data-tip="Change Account Details"
                  data-place="bottom"
                  onClick={() => {
                    if (
                      window.confirm(`Are you sure you want edit your email?`)
                    )
                      this.setState({
                        changingEmail: !this.state.changingEmail,
                        changingPassword: false,
                        changingLocation: false,
                      });
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
                  src={require("../images/editdash.png")}
                  alt="Change Password"
                  data-tip="Change Password"
                  data-place="bottom"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want change your password?`
                      )
                    )
                      this.setState({
                        changingPassword: !this.state.changingPassword,
                        changingEmail: false,
                        changingLocation: false,
                      });
                  }}
                ></img>
                <ReactTooltip />
              </div>
              <p className="settingsText">
                Change your password that you login with
              </p>

              <div className="settingsCard">
                <h4>Delete Account</h4>
                <img
                  className="editDeleteIcon"
                  src={require("../images/deletedash.png")}
                  alt="Delete Account"
                  data-tip="Delete Account"
                  data-place="bottom"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete your account?`
                      )
                    )
                      this.props.DeleteAccount(
                        handle,
                        userId,
                        this.props.history
                      );
                  }}
                ></img>
                <ReactTooltip />
              </div>
              <p className="settingsText">Delete your account of G'drop</p>

              <span className="helper-text">
                {errors !== null ? errors.error : message}
              </span>

              {/* Email */
              /* Email */
              /* Email */
              /* Email */
              /* Email */
              /* Email */
              /* Email */
              /* Email */
              /* Email */}
              <div className="settingsUpdate">
                {changingEmail ? (
                  <form
                    id="updateEmail"
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}
                  >
                    <div className="updateEmails">
                      <h4>New Email</h4>
                      <input
                        type="email"
                        placeholder="New email"
                        name="newEmail"
                        value={this.state.newEmail}
                      ></input>

                      <h4>Enter password</h4>
                      <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        placeholder="Enter password to confirm email update"
                      ></input>
                    </div>
                    <button type="submit" className="settingsBtn">
                      Submit
                    </button>
                  </form>
                ) : null}

                {/* Password */
                /* Password */
                /* Password */
                /* Password */
                /* Password */
                /* Password */
                /* Password */}
                {changingPassword ? (
                  <form
                    id="updatePassword"
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}
                  >
                    <div className="updatePassword">
                      <h4>Old Password</h4>
                      <input
                        type="password"
                        name="oldPassword"
                        value={this.state.oldPassword}
                        placeholder="Old password"
                      ></input>
                      <h4>New Password</h4>
                      <input
                        type="password"
                        name="newPassword"
                        value={this.state.newPassword}
                        placeholder="New password"
                      ></input>
                      <h4>Confirm Password</h4>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={this.state.confirmPassword}
                        placeholder="Confirm new password"
                      ></input>
                    </div>
                    <button type="submit" className="settingsBtn">
                      Submit
                    </button>
                  </form>
                ) : null}

                {/* change location */
                /* change location */
                /* change location */
                /* change location */
                /* change location */}
                {changingLocation ? (
                  <form
                    onSubmit={this.handleSubmit}
                    autoComplete="off"
                    id="updateLocation"
                  >
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
                        onBlur={this.onBlur}
                        placeholder="Select a Location from the dropdown"
                        onPlaceSelected={(place) => {
                          this.setState((prevState) => ({
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
                        onFocus={this.onFocus}
                      />
                    </div>
                    <button type="submit" className="settingsBtn">
                      Submit
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
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

export default Settings;
