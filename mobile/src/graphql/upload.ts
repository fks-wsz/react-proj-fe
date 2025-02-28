import { gql } from "@apollo/client";

export const GET_UPLOAD_OSS_SIGNATURE = gql`
  query getOSSSignature {
    ossSignature {
      expire
      policy
      signature
      ossAccessKeyId
      host
      dir
    }
  }
`;
