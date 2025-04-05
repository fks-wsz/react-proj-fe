import { Page } from '@fe/shared'

/** 分页相关 */
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGE_INPUT: Page = {
  pageNum: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}

/** gql */
export const DEFAULT_GQL_QUERY_OPT = {
  skip: false,
}
export const DEFAULT_GQL_LAZY_QUERY_OPT = {
  force: false,
}

/** Drawer 相关 */
export const DEFAULT_ANTD_DRAWER_WIDTH = '50%'
