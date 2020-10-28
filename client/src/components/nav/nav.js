//Core
import React, { Component } from "react";

//Components
import NavFull from "./navFull";

import "../../App.css";

class Nav extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
    };
  }

  render() {
    return (
      <div>
        <header>
          <NavFull history={this.props.history} />
        </header>
      </div>
    );
  }
}


export default Nav;
