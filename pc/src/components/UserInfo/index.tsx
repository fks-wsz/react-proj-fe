import { connect, useGetUserInfo } from '@/utils/userHooks'
import { PropChild } from '@fe/shared'

/**
 * @description 用户信息
 */
const UserInfo: React.FC<PropChild> = ({ children }) => {
  useGetUserInfo()

  return children
}

export default connect(UserInfo)
