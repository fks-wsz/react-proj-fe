export type Page = {
  pageSize: number
  pageNum: number
}

export type PageRes = Page & {
  total: number
}
