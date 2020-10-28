//Core
import React, { Component } from "react";

import emailjs from "emailjs-com";

class Contact extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      name: "",
      email: "",
      enquiry: "",
      status: "",
    };
  }


  componentWillReceiveProps(nextProps) {
      window.scrollTo(0, 0);
  }
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: this.state.name,
      email: this.state.email,
      enquiry: this.state.enquiry,
    };
    emailjs
      .send(
        "service_ofgh1ss",
        "template_tr58yka",
        formData,
        "user_7ru8oUIpeipD9H7n6wOaF"
      )
      .then(
        (res) => {
          this.props.contact(formData, this.props.history)
          this.setState({status: `Enquiry sent, we will be in touch with you shortly.`})
        },
        (err) => {
            this.setState({status: "Failed"})
        }
      );
  };






  render() {
    let { name, email, enquiry ,status} = this.state;
    return (
      <div className="containerBody">
        <h1>Contact</h1>
        <form
          className="contactForm"
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        >
          <div className="formTopRow">
            <div className="contactInput">
              <h3>Full Name</h3>
              <input
                type="text"
                value={name}
                name="name"
                className=""
                placeholder="Full Name"
                required
              ></input>
            </div>
            <div className="contactInput">
              <h3>Email</h3>
              <input
                type="email"
                className=""
                name="email"
                required
                placeholder="Email"
                value={email}
              ></input>
            </div>
          </div>

          <h3>Enquiry</h3>
          <textarea
            className="enquiry"
            name="enquiry"
            value={enquiry}
            placeholder="Enquiry:"
          ></textarea>
        {<p className="contactMessage">{status}</p>}
          <button type="submit" className="submitButton">
            Submit Enquiry
          </button>
        </form>
      </div>
    );
  }
}


export default Contact;