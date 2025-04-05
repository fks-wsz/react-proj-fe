import { gql } from '@apollo/client'

export const GET_CARDS = gql`
  query ConsumeCards($courseId: String!) {
    getCards(courseId: $courseId) {
      code
      message
      data {
        id
        name
        type
        times
        days
      }
    }
  }
`

export const COMMIT_CARD = gql`
  mutation CommitCard($params: CardInput!) {
    commitCard(params: $params) {
      code
      message
    }
  }
`

export const DELETE_CARD = gql`
  mutation DeleteCard($id: String!) {
    deleteCard(id: $id) {
      code
      message
    }
  }
`
