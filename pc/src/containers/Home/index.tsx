import { useGoTo } from '@/hooks/routeHooks'
import { useUserInfoContext } from '@/hooks/userHooks'
import { UserInfoStore } from '@/types'
import { useTitle } from '@fe/shared'
import { Button } from 'antd'
import { PAGE_ROUTE_KEY } from '@/routes'

/**
 * @description Home
 */
const Home = () => {
  const { store } = useUserInfoContext<UserInfoStore>()
  const { go } = useGoTo()
  useTitle('首页')

  return (
    <>
      <div>{store.userInfo.phoneNumber}</div>
      <div>
        <Button onClick={() => go(PAGE_ROUTE_KEY['MY'])}></Button>
      </div>
    </>
  )
}

export default Home
