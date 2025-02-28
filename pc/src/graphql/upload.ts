import { gql } from "@apollo/client";

/** 获取OSS签名 */
export const GET_UPLOAD_OSS_SIGNATURE = gql`
  query getOSSSignature {
    ossSignature {
      code
      message
      data {
        expire
        policysignature
        host
        dir
      }
    }
  }
`;
