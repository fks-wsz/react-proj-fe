import { gql } from "@apollo/client";

export const FIND_USER = gql`
  query find($id: String!) {
    find(id: $id) {
      id
      name
      desc
    }
  }
`;

export const CREATE_USER = gql`
  mutation create($params: UserInput!) {
    create(params: $params)
  }
`;

export const UPDATE_USER = gql`
  mutation update($id: String!, $params: UserInput!) {
    update(id: $id, params: $params)
  }
`;
