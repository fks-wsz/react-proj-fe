import { gql } from '@apollo/client'

export const GET_COURSES = gql`
  query GetCourses($page: PageInput!, $name: String) {
    getCourses(page: $page, name: $name) {
      code
      message
      data {
        createdAt
        createdBy
        updatedAt
        updatedBy
        deletedAt
        deletedBy
        id
        name
        description
        fitPeople
        baseAbility
        sections
        sectionDuration
        stuCount
        reserveInfo
        refundInfo
        otherInfo
      }
      page {
        pageNum
        pageSize
        total
      }
    }
  }
`

export const GET_COURSE = gql`
  query GetCourse($id: String!) {
    getCourse(id: $id) {
      code
      message
      data {
        createdAt
        createdBy
        updatedAt
        updatedBy
        deletedAt
        deletedBy
        id
        name
        description
        fitPeople
        baseAbility
        sections
        sectionDuration
        stuCount
        reserveInfo
        refundInfo
        otherInfo
        reserverTimes {
          week
          reserverTimes {
            key
            startTime
            endTime
          }
        }
      }
    }
  }
`

export const COMMIT_COURSE = gql`
  mutation CommitCourse($params: PartialCourseInput!) {
    commitCourse(params: $params) {
      code
      message
    }
  }
`
