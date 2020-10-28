//Core
import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../../App.css";


class NavFull extends Component {
  constructor() {
    super();
    this.state = {
      menu: "show-desktop hide-mobile nav-links",
      avatar: "show-menu",
    };
  }

  handleClick = (e) => {
    if (e.target.id === "menu" || e.target.className === "show-menu") {
      if (e.target.id === "avatarItems") {
        this.setState({
          menu: "show-desktop hide-mobile nav-links",
        });
      } else {
        this.setState({
          menu: "show-desktop nav-links",
        });
      }
    } else if (
      e.target.id === "exit_menu" ||
      (e.target.className === "nav-links" && e.target.id !== "avatar")
    ) {
      if (e.target.id === "logout") {
        this.logoutUserBtn(e);
      }
      this.setState({
        menu: "show-desktop hide-mobile nav-links",
        avatar: "show-menu",
      });
    } else if (e.target.id === "avatar" || e.target.id === "avatarItems") {
      if (this.state.avatar === "show-menu" && e.target.id === "avatarItems") {
        this.setState({
          avatar: "hide-menu",
        });
      } else if (this.state.avatar === "show-menu") {
        this.setState({
          avatar: "hide-menu",
        });
      } else if (this.state.avatar === "hide-menu") {
        this.setState({
          avatar: "show-menu",
        });
      }
    } else if (e.target.id === "home") {
      this.setState({
        menu: "show-desktop hide-mobile nav-links",
        avatar: "show-menu",
      });
    }
  };

  logoutUserBtn = (e) => {
    e.preventDefault();
    if (e.target.id === "logout") {
      this.props.logoutUser(this.props.history);
    }
  };

  searchStateInput() {
    let { menu } = this.state;
    // let { authenticated } = this.props.user;
    // if (authenticated === false) {
      return (
        <div className={menu}>
          {/* <Link to="/login">
            <li className="nav-links" onClick={this.handleClick}>
              Login
            </li>
          </Link> */}
          <Link to="/signup">
            <li className="nav-links" onClick={this.handleClick}>
              Sign up
            </li>
          </Link>
        </div>
      );
    // } else {
    //   return (
    //     <div className={menu}>
    //       <Link to="/mycalendar">
    //         <li className="nav-links" onClick={this.handleClick}>
    //           My Calendar
    //         </li>
    //       </Link>
    //       <Link to="/settings">
    //         <li
    //           className="nav-links"
    //           onClick={this.handleClick}
    //           id="avatarItems"
    //         >
    //           Settings
    //         </li>
    //       </Link>

    //       <Link to="/login">
    //         <li className="nav-links" id="logout" onClick={this.handleClick}>
    //           Logout
    //         </li>
    //       </Link>
    //     </div>
    //   );
    // }
  }

  render() {
    let { menu } = this.state;
    return (
      <nav>
        <div className="navLeft">
          {/* <Link to="/">
            <img
              className="logo"
              src={require("../../images/logo.svg")}
            ></img>
          </Link> */}

          

          <a href="https://gdrop.co/">
          <img
              className="logo"
              src={require("../../images/logo.svg")}
            ></img>
                  </a>
        </div>

        <div className="navRight ">
          <p className="hide-desktop" onClick={this.handleClick}>
            <span className="menu" id="menu">
              &#9776;
            </span>
          </p>

          <ul className={menu} id="nav">
            <li
              className="exit-btn hide-desktop"
              alt="exit menu"
              id="exit_menu"
              onClick={this.handleClick}
            >
              &#10005;
            </li>

            {this.searchStateInput()}
            <Link to="/contact">
              <li className="nav-links" onClick={this.handleClick}>
                Contact
              </li>
            </Link>
          </ul>
        </div>
      </nav>
    );
  }
}


export default NavFull;
