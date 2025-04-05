import Course from '@/containers/Course'
import Home from '@/containers/Home'
import Login from '@/containers/Login'
import My from '@/containers/My'
import Organization from '@/containers/Organization'
import Page404 from '@/containers/Page404'
import { HomeOutlined, PicRightOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons'
import { MenuDataItem } from '@ant-design/pro-components'

export type PageRouteKeys = keyof typeof PAGE_ROUTE_KEY

export enum PAGE_ROUTE_KEY {
  HOME = 'home',
  LOGIN = 'login',
  MY = 'my',
  ORGANIZATION = 'organization',
  COURSE = 'course',
  PAGE404 = '404',
}

export const MENU_ROUTES_CONFIG: Record<string, MenuDataItem> = {
  [PAGE_ROUTE_KEY.HOME]: {
    path: 'home',
    key: PAGE_ROUTE_KEY.HOME,
    element: Home,
    name: '首页',
    icon: <HomeOutlined />,
  },
  [PAGE_ROUTE_KEY.MY]: {
    path: 'my',
    key: PAGE_ROUTE_KEY.MY,
    element: My,
    hideInMenu: true,
    name: '我的',
    icon: <UserOutlined />,
  },
  [PAGE_ROUTE_KEY.ORGANIZATION]: {
    path: 'organization',
    key: PAGE_ROUTE_KEY.ORGANIZATION,
    element: Organization,
    hideInMenu: true,
    name: '门店',
    icon: <ShopOutlined />,
  },
  [PAGE_ROUTE_KEY.COURSE]: {
    path: 'course',
    key: PAGE_ROUTE_KEY['COURSE'],
    element: Course,
    name: '课程',
    icon: <PicRightOutlined />,
  },
  [PAGE_ROUTE_KEY.PAGE404]: {
    path: '*',
    key: PAGE_ROUTE_KEY.PAGE404,
    element: Page404,
    name: '404',
    hideInMenu: true,
  },
}

export const menuRoutes = Object.values(MENU_ROUTES_CONFIG)

export const getRouteByKey = (key: string) => {
  return MENU_ROUTES_CONFIG[key]
}

export const COMMON_ROUTES_CONFIG = [
  {
    key: PAGE_ROUTE_KEY.LOGIN,
    path: '/login',
    element: Login,
    name: '登录',
  },
]
