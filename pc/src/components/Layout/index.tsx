import { USER_TOKEN_KEY } from '@/constants'
import { useUserInfoContext } from '@/hooks/userHooks'
import { menuRoutes } from '@/routes'
import { UserInfoStore } from '@/types'
import type { MenuProps } from 'antd'
import { Avatar, Dropdown } from 'antd'
import { MenuDataItem, ProLayout } from '@ant-design/pro-components'
import { Link, useOutlet } from 'react-router-dom'
import OrgSelect from '../OrgSelect'
import { useGoTo } from '@/hooks/routeHooks'

const MenuItem = (itemProps: MenuDataItem, dom: React.ReactNode) => {
  return <Link to={itemProps.path!}>{dom}</Link>
}

/**
 * @description 布局
 */
const Layout = () => {
  const { store: userInfoStore } = useUserInfoContext<UserInfoStore>()
  const outlet = useOutlet()
  const { go } = useGoTo()

  const logout = () => {
    localStorage.removeItem(USER_TOKEN_KEY)
    sessionStorage.removeItem(USER_TOKEN_KEY)
    window.location.href = '/login'
  }

  const dropDownItems: MenuProps['items'] = [
    {
      key: 'my',
      label: (
        <div
          onClick={() => {
            go('MY')
          }}
        >
          我的
        </div>
      ),
    },
    {
      key: 'logout',
      label: <div onClick={logout}>退出登录</div>,
    },
  ]

  return (
    <>
      <ProLayout
        layout="mix"
        avatarProps={{
          render: () => {
            const { avatarUrl, phoneNumber } = userInfoStore.userInfo
            return (
              <Dropdown menu={{ items: dropDownItems }}>
                <div>
                  <Avatar src={avatarUrl || null} />
                  {phoneNumber || ''}
                </div>
              </Dropdown>
            )
          },
        }}
        actionsRender={() => [<OrgSelect />]}
        route={{
          path: '/',
          routes: menuRoutes,
        }}
        menuItemRender={MenuItem}
      >
        {outlet}
      </ProLayout>
    </>
  )
}

export default Layout
