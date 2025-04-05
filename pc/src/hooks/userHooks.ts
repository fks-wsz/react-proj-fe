import { useEffect } from 'react'
import { connectFactory, useAppContext } from '@fe/shared'
import { GET_USER_INFO } from '@/graphql/user'
import { useQuery } from '@apollo/client'
import { UserInfo, UserInfoStore } from '@/types'
import { useLocation, useNavigate } from 'react-router-dom'
import { LOCAL_STORAGE_KEYS } from '@/constants'

type ResponseUserInfo = {
  getUserInfo: {
    data: UserInfo
  }
}

const getInitUserInfo = (): UserInfo => {
  return {
    id: '',
    name: '',
    desc: '',
    phoneNumber: '',
    avatarUrl: '',
  }
}

const USER_INFO_KEY = 'userInfo'
const DEFAULT_USER_INFO: UserInfo = getInitUserInfo()
const DEFAULT_USER_INFO_STORE: Partial<UserInfoStore> = {
  userInfo: DEFAULT_USER_INFO,
  selectOrg: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS['SELECT_ORG']) || '{}'),
  refetch: () => {},
}

export const useUserInfoContext = <S>() => useAppContext<S>(USER_INFO_KEY)

export const connect = connectFactory(USER_INFO_KEY, DEFAULT_USER_INFO_STORE)

export const useGetUserInfo = () => {
  const { setStore } = useUserInfoContext<UserInfoStore>()
  const { data, loading, refetch } = useQuery<ResponseUserInfo>(GET_USER_INFO)
  const location = useLocation()
  const nav = useNavigate()

  useEffect(() => {
    if (typeof data === 'object') {
      const { getUserInfo } = data
      if (Reflect.ownKeys(getUserInfo).length > 0) {
        // 若用户信息存在
        setStore((s) => ({ ...s, userInfo: getUserInfo.data, refetch }))
        if (location.pathname === '/login') {
          nav('/')
        }
      } else {
        // 若用户信息不存在 或 token 过期
        if (location.pathname !== '/login') {
          nav(`/login?targetUrl=${location.pathname}`)
        }
        setStore((s) => ({ ...s, userInfo: DEFAULT_USER_INFO, refetch }))
      }
    } else {
      // 一般为 用户信息获取失败
      setStore((s) => ({ ...s, userInfo: DEFAULT_USER_INFO, refetch }))
    }
  }, [data])

  return {
    loading,
  }
}
