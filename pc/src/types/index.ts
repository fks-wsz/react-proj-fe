export type UserInfo = {
  id: string
  name: string
  phoneNumber: string
}

export type UserInfoStore = {
  userInfo: UserInfo
  refetch: Function
}
