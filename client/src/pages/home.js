//Core
import React, { Component} from "react";

class Home extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleChange = (e) => {};

  handleSubmit = (event) => {
    event.preventDefault();
  };

  render() {
    return (
      <div className="containerBody">
        <h1>G'drop</h1>
        <p className="homeSubhead">Re-selling made easy</p>
        <div>
          <div className="homePageContainer">
            <div className="homePageImage"></div>
            <div className="homeCenter">
              <div className="homeSearchButtons"></div>
            </div>
          </div>
          <div className="loginSignupHome"></div>
        </div>
      </div>
    );
  }
}

export default Home;
