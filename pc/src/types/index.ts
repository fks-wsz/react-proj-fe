export * from './course'
export * from './organization'
export * from './graphql'

export type UserInfo = {
  id: string
  name: string
  desc: string
  phoneNumber: string
  avatarUrl: string
}

export type UserInfoStore = {
  userInfo: UserInfo
  refetch: () => void
  selectOrg: {
    value: string
    label: string
  }
}

export type Image = {
  id: string
  url: string
  remark?: string
}

export type Weeks =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
