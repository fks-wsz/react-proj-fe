import { gql } from '@apollo/client'

export const GET_ORGANIZATIONS = gql`
  query getOrgs($page: PageInput!) {
    getOrganizations(page: $page) {
      code
      message
      data {
        id
        organizationName
        logoUrl
        tags
        description
      }
      page {
        pageNum
        pageSize
        total
      }
    }
  }
`

export const GET_ORGANIZATIONS_SIMPLE = gql`
  query getOrgs($page: PageInput!, $organizationName: String) {
    getOrganizations(page: $page, organizationName: $organizationName) {
      code
      message
      data {
        id
        organizationName
      }
      page {
        pageNum
        pageSize
        total
      }
    }
  }
`

export const GET_ORGANIZATION = gql`
  query getOrg($id: String!) {
    getOrganization(id: $id) {
      code
      message
      data {
        id
        organizationName
        logoUrl
        tags
        businessLicenseUrl
        idCardFrontUrl
        idCardBackUrl
        description
        address
        longitude
        latitude
        phoneNumber
        orgFrontImg {
          id
          url
        }
        orgRoomImg {
          id
          url
        }
        orgOtherImg {
          id
          url
        }
        createdAt
        updatedAt
      }
    }
  }
`

export const COMMIT_ORGANIZATION = gql`
  mutation commitOrg($params: OrganizationInput!) {
    commitOrganization(params: $params) {
      code
      message
    }
  }
`

export const DELETE_ORGANIZATION = gql`
  mutation deleteOrg($id: String!) {
    deleteOrganization(id: $id) {
      code
      message
    }
  }
`
