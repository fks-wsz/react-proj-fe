import { connect, useGetUserInfo } from '@/hooks/userHooks'
import { PropChild } from '@fe/shared'
import { Spin } from 'antd'

import styles from './index.module.less'

/**
 * @description 用户信息
 */
const UserInfo: React.FC<PropChild> = ({ children }) => {
  const { loading } = useGetUserInfo()

  return (
    <>
      <Spin spinning={loading} size="large">
        <div className={styles.container}>{children}</div>
      </Spin>
    </>
  )
}

export default connect(UserInfo)
