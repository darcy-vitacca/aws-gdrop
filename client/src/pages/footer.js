//Core
import React, { Component } from "react";
import { Link } from "react-router-dom";
import footerImg from "../images/footerimg.svg";
import footerLogo from "../images/footerlogo.svg";
import facebook from "../images/facebook.svg";
import twitter from "../images/twitter.svg";
import instagram from "../images/instagram.svg";
import linkedin from "../images/linkedin.svg";
import youtube from "../images/youtube.svg";

//Components

class Nav extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
    };
  }

  render() {
    return (
      <div className="footerContainer">
        <p className="footerTextTop">Make it a G'drop for everyone!</p>
        <Link to="/comingsoon"></Link>
        <img
          className="footerimg"
          src={footerImg}
          alt="footer link"
        ></img>
        <footer>
          <div className="footerTop">
            <div className="footerLeft">
              <a href="https://gdrop.co/">
                <img
                  className="footerLogo"
                  src={footerLogo}
                  alt="footer link"
                ></img>
              </a>

              <p className="footerLeftText">Re-Selling made easy!</p>
            </div>

            <div className="footerTopText">
              <ul>
                <div className="footerTopTextLeft">
                  <Link to="/signup">
                    <li>Sign Up</li>
                  </Link>
                  {/* <Link to="/comingsoon">
                    <li>About Us</li>
                  </Link> */}
                  <a href="https://gdrop.co/">
                    <li>About Us</li>
                  </a>
                  <a href="https://gdrop.co/">
                    <li>FAQ's</li>
                  </a>
                  {/* <Link to="/comingsoon">
                    <li>FAQ's</li>
                  </Link> */}
                  <Link to="/comingsoon">
                    <li>Blog</li>
                  </Link>
                </div>
                <div className="footerTopTextRight">
                  <Link to="/contact">
                    <li>Contact Us</li>
                  </Link>
                  <Link to="/comingsoon">
                    <li>Careers</li>
                  </Link>
                  <Link to="/comingsoon">
                    <li>Terms & Conditions</li>
                  </Link>
                  <Link to="/comingsoon">
                    <li>Privacy Policy</li>
                  </Link>
                </div>
              </ul>
            </div>
          </div>

          <div className="footertextBottom">
            <p>Made with &#10084; in Melbourne, Australia</p>
            <div className="footerImages">
              <Link to="/comingsoon">
                <img
                  className="footerSocialImages"
                  src={facebook}
                  alt="footer link"
                ></img>
              </Link>
              <Link to="/comingsoon">
                <img
                  className="footerSocialImages"
                  src={instagram}
                  alt="footer link"
                ></img>
              </Link>
              <Link to="/comingsoon">
                <img
                  className="footerSocialImages"
                  src={twitter}
                  alt="footer link"
                ></img>
              </Link>
              <Link to="/comingsoon">
                <img
                  className="footerSocialImages"
                  src={youtube}
                  alt="footer link"
                ></img>
              </Link>
              <Link to="/comingsoon">
                <img
                  className="footerSocialImages"
                  src={linkedin}
                  alt="footer link"
                ></img>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Nav;
