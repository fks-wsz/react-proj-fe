import { gql } from '@apollo/client'

export const GET_USER_INFO = gql`
  query {
    getUserInfo {
      code
      message
      data {
        id
        name
        desc
        phoneNumber
        avatarUrl
      }
    }
  }
`
export const UPDATE_USER_INFO = gql`
  mutation updateUserInfo($id: String!, $params: UserInput!) {
    updateUserInfo(id: $id, params: $params) {
      code
      message
    }
  }
`
