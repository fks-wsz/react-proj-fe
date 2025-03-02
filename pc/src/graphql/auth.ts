import { gql } from '@apollo/client'

/** 获取登录验证码 */
export const GET_LOGIN_SMS_CODE = gql`
  query getLoginCode($phoneNumber: String!) {
    getLoginSmsMsg(phoneNumber: $phoneNumber) {
      code
      message
    }
  }
`

/** 登录 */
export const LOGIN = gql`
  query login($phoneNumber: String!, $code: String!) {
    login(phoneNumber: $phoneNumber, code: $code) {
      code
      message
      data {
        token
      }
    }
  }
`
