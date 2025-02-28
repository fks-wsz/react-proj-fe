import { InMemoryCache } from "@apollo/client";
import { createApolloClient } from "@fe/shared/utils/apollo";

export const client = createApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});
