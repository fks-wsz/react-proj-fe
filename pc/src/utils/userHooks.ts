import { useEffect } from 'react'
import { connectFactory, useAppContext } from '@fe/shared'
import { GET_USER_INFO } from '@/graphql/user'
import { useQuery } from '@apollo/client'
import { UserInfo, UserInfoStore } from '@/types'
import { useLocation } from 'react-router-dom'

type ResponseUserInfo = {
  getUserInfo: {
    data: UserInfo
  }
}

const getInitUserInfo = (): UserInfo => {
  return {
    id: '',
    name: '',
    phoneNumber: '',
  }
}

const USER_INFO_KEY = 'userInfo'
const DEFAULT_USER_INFO: UserInfo = getInitUserInfo()
const DEFAULT_USER_INFO_STORE: UserInfoStore = {
  userInfo: DEFAULT_USER_INFO,
  refetch: () => {},
}

export const useUserInfoContext = <S>() => useAppContext<S>(USER_INFO_KEY)

export const connect = connectFactory(USER_INFO_KEY, DEFAULT_USER_INFO_STORE)

export const useGetUserInfo = () => {
  const { setStore } = useUserInfoContext<UserInfoStore>()
  const { data, refetch } = useQuery<ResponseUserInfo>(GET_USER_INFO)

  useEffect(() => {
    if (typeof data === 'object') {
      const { getUserInfo } = data
      if (Reflect.ownKeys(getUserInfo).length > 0) {
        // 若用户信息存在
        setStore({ userInfo: getUserInfo.data, refetch })
        if (window.location.pathname === '/login') {
          window.location.href = '/'
        }
      } else {
        // 若用户信息不存在 或 token 过期
        if (window.location.pathname !== '/login') {
          window.location.href = `/login?targetUrl=${window.location.pathname}`
        }
        setStore({ userInfo: DEFAULT_USER_INFO, refetch })
      }
    } else {
      // 一般为 用户信息获取失败
      setStore({ userInfo: DEFAULT_USER_INFO, refetch })
    }
  }, [data])
}
