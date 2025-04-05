import { getRouteByKey, PAGE_ROUTE_KEY, PageRouteKeys } from '@/routes'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import { menuRoutes } from '@/routes'
import { useMemo } from 'react'

export const useGoTo = () => {
  const nav = useNavigate()

  const back = () => nav(-1)
  const go = (pageKey: PageRouteKeys, params?: Record<string, string | number>) => {
    if (!pageKey) return nav('/')
    const targetRoute = getRouteByKey(PAGE_ROUTE_KEY[pageKey])
    if (targetRoute && targetRoute.path) {
      if (!params) return nav(`/${targetRoute.path}`)
      const targetPath = targetRoute.path.replace(/\/:(\w+)/g, (_: string, p1: string) => {
        return `/${params[p1]}`
      })
      return nav(`/${targetPath}`)
    }
  }

  return {
    back,
    go,
  }
}

export const useMatchedRoute = () => {
  const r = useLocation()
  const matched = useMemo(
    () =>
      menuRoutes.find((item) => {
        if (item.path) {
          return matchPath(r.pathname, item.path)
        }
        return false
      }),
    [r.pathname],
  )

  return matched
}
