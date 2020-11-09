//Core
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import emailjs from "emailjs-com";

//graphql
const CONTACT_DATA = gql`
  mutation storeTempData(
    $email: String!
      $name: String
      $enquiry: String
      $handle: String
      $contactMethod: String!
  ) {
    storeTempData(
      email:  $email
      name:  $name
      enquiry: $enquiry
      handle: $handle
      contactMethod: $contactMethod
    ) {
      message
    }
  }
`;

export default function Contact(props) {
  const [variables, setVariables] = useState({
    name: "",
    email: "",
    enquiry: "",
    status: "",
  });

  const [contactData, { data, errors }] = useMutation(CONTACT_DATA, {
    onError: (err) => console.log(err),
    onCompleted: (data) => {
      console.log(data)
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: variables.name,
      email: variables.email,
      enquiry: variables.enquiry,
      contactMethod: "Contact Form",
    };
  
    contactData({ variables: formData });
    emailjs
      .send(
        "service_ofgh1ss",
        "template_tr58yka",
        formData,
        "user_7ru8oUIpeipD9H7n6wOaF"
      )
      .then(
        (res) => {
          setVariables({
            status: `Enquiry sent, we will be in touch with you shortly.`,
          });
        },
        (err) => {
          setVariables({ status: "Failed" });
        }
      );
  };

  let { name, email, enquiry, status } = variables;
  return (
    <div className="containerBody">
      <h1>Contact</h1>
      <form className="contactForm" onSubmit={handleSubmit}>
        <div className="formTopRow">
          <div className="contactInput">
            <h3>Full Name</h3>
            <input
              type="text"
              value={name}
              name="name"
              className=""
              placeholder="Full Name"
              onChange={(e) =>
                setVariables({ ...variables, name: e.target.value })
              }
              required
            ></input>
          </div>
          <div className="contactInput">
            <h3>Email</h3>
            <input
              type="email"
              className=""
              name="email"
              placeholder="Email"
              onChange={(e) =>
                setVariables({ ...variables, email: e.target.value })
              }
              value={email}
              required
            ></input>
          </div>
        </div>

        <h3>Enquiry</h3>
        <textarea
          className="enquiry"
          name="enquiry"
          value={enquiry}
          placeholder="Enquiry:"
          onChange={(e) =>
            setVariables({ ...variables, enquiry: e.target.value })
          }
          required
        ></textarea>
        {<p className="contactMessage">{status}</p>}
        <button type="submit" className="submitButton">
          Submit Enquiry
        </button>
      </form>
    </div>
  );
}
