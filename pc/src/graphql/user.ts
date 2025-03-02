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
      }
    }
  }
`
