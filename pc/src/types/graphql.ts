import { PageRes } from '@fe/shared'

type QueryListRecordValue<T extends Record<string, any>> = {
  data: (T & { __typename?: string })[]
  page: PageRes
} & BaseResponseRecordValue

export type BaseResponseRecordValue = {
  code: number
  message: string
}

/** @name 分页列表用 */
export type QueryList<T extends Record<string, any>> = Record<string, QueryListRecordValue<T>>

/** @name 不分页列表 */
export type QueryListWithoutPage<T extends Record<string, any>> = Record<
  string,
  Omit<QueryListRecordValue<T>, 'page'>
>

/** @name 普通数据 */
export type QueryRecord<T extends Record<string, any>> = Record<
  string,
  { __typename?: string; data: T } & BaseResponseRecordValue
>

export type BaseResponse = Record<string, { __typename?: string } & BaseResponseRecordValue>

/** @name useQuery选项提取 */
export type UseQueryOptionsType = {
  skip: boolean
}
/** @name 自定义useLazyQuery选项,避免一些问题 */
export type UseLazyQueryOptionsType = {
  /** @name 不使用缓存 */
  force: boolean
}
