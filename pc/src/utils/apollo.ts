import { ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'
import { Modal } from 'antd'
import { createApolloClient } from '@fe/shared'
import { USER_TOKEN_KEY, LOCAL_STORAGE_KEYS } from '@/constants'

if (__DEV__) {
  loadDevMessages()
  loadErrorMessages()
}

const httpLink = createHttpLink({
  uri: '//localhost:3000/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem(USER_TOKEN_KEY) || localStorage.getItem(USER_TOKEN_KEY)
  const orgId = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS['SELECT_ORG']) || '{}').value
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      orgId: orgId,
    },
  }
})

// 响应拦截器
const responseInterceptor = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    // 这里可以统一处理响应

    // 可以对响应进行修改或处理
    // 例如：处理通用错误码，更新 token 等
    if (response.errors) {
      // 处理错误情况
      response.errors.forEach((err) => {
        const { statusCode } = (err.extensions!.originalError ?? {}) as Record<string, any>
        if (statusCode === 401 && window.location.pathname !== '/login') {
          // token 过期，跳转登录页
          Modal.error({
            title: '授权信息过期',
            content: '请重新登录',
            onOk: () => {
              window.location.href = `/login?=targetUrl=${window.location.pathname}`
            },
          })
        }
        console.error('[GraphQL 错误]: ', err.message)
        // 可以根据错误码进行不同处理
        // 例如 token 过期自动刷新等
      })
    }

    const successResponse: Record<string, any> = {}
    const errorResponse: Record<string, any> = {}

    const { data: responseData } = response
    for (const key in responseData) {
      const { code, message } = responseData[key]
      if (code !== 200) {
        // 错误响应
        errorResponse[key] = { code, message }
      } else {
        // 成功响应
        successResponse[key] = responseData[key]
      }
    }

    // 打印错误信息
    if (Reflect.ownKeys(errorResponse).length > 0) {
      for (const errKey in errorResponse) {
        const { code, message } = errorResponse[errKey]
        console.error('GraphQL Response Error: ', `${code} ---> ${message}`)
      }
    }

    // 返回处理后的响应
    return response
  })
})

// 错误处理链（可选，与响应拦截器配合使用）
const errorLink = onError(({ networkError }) => {
  // if (graphQLErrors) {
  //   graphQLErrors.forEach(({ message, locations, path }) => {
  //     console.error(`[GraphQL 错误]: Message: ${message}, Location: ${locations}, Path: ${path}`)
  //   })
  // }
  if (networkError) {
    console.error(`[网络错误]: ${networkError}`)
  }
})

// 组合所有链，顺序很重要
export const client = createApolloClient({
  link: ApolloLink.from([
    errorLink, // 首先处理错误
    authLink, // 然后添加认证头
    responseInterceptor, // 再处理响应
    httpLink, // 最后发送请求
  ]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
})
