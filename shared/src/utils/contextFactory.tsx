import React, { useContext, useMemo, useState } from 'react'
import { JSX, createContext } from 'react'
import { PropChild } from '@/types'

type Store<S> = {
  key: string
  store: S
  setStore: (store: S) => void
}

// 上下文缓存
const ctxCache = new Map<string, Context<any>>()

const getAppProvider =
  <S,>(key: string, defaultValue: S, AppContext: React.Context<Store<S>>) =>
  ({ children }: PropChild) => {
    const [store, setStore] = useState<S>(defaultValue)

    const value = useMemo(
      () => ({
        key,
        store,
        setStore,
      }),
      [store],
    ) as Store<S>

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
  }

class Context<S> {
  private readonly defaultStore: Store<S>
  readonly AppContext: React.Context<Store<S>>
  readonly AppProvider: ({ children }: PropChild) => JSX.Element

  constructor(key: string, defaultValue: S) {
    this.defaultStore = {
      key,
      store: defaultValue,
      setStore: () => {},
    }
    this.AppContext = createContext(this.defaultStore)
    this.AppProvider = getAppProvider(key, defaultValue, this.AppContext)
    ctxCache.set(key, this)
  }
}

export const useAppContext = <S,>(key: string) => {
  const ctx = ctxCache.get(key)!
  const ctxValue = useContext<Store<S>>(ctx.AppContext)
  return {
    key: ctxValue.key,
    store: ctxValue.store,
    setStore: ctxValue.setStore,
  }
}

export const connectFactory = <S,>(key: string, defaultValue: S) => {
  const ctx = ctxCache.get(key)
  let CTX: null | Context<S> = null
  if (typeof ctx === 'undefined') {
    CTX = new Context<S>(key, defaultValue)
  } else {
    CTX = ctx
  }
  return <P,>(Child: React.FC<P>) =>
    (props: any): JSX.Element => (
      <CTX.AppProvider>
        <Child {...props} />
      </CTX.AppProvider>
    )
}
