import { ApolloClient, ApolloClientOptions, NormalizedCacheObject } from '@apollo/client'

export const createApolloClient = (options: ApolloClientOptions<NormalizedCacheObject>) => {
  return new ApolloClient(options)
}
