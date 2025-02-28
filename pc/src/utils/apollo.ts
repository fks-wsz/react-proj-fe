import { createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createApolloClient } from "@fe/shared";

const httpLink = createHttpLink({
  uri: "//localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = createApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
