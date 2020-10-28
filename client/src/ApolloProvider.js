import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

//props come from app js so need to spread
export default function ApolloProvider(props) {
  return <Provider client={client} {...props} />;
}
