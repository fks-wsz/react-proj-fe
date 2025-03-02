import { useEffect } from 'react'
import { connect, useUserInfoContext } from '@/utils/userHooks'
import { UserInfoStore } from '@/types'

/**
 * @description Home
 */
const Home = () => {
  const { store } = useUserInfoContext<UserInfoStore>()
  useEffect(() => {
    console.log(store)
  }, [store])
  return (
    <>
      <div>{store.userInfo.phoneNumber}</div>
    </>
  )
}

export default Home
