import { createRoot } from 'react-dom/client'

import { ApolloProvider } from '@apollo/client'
import { client } from './utils/apollo'

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { COMMON_ROUTES_CONFIG, menuRoutes } from './routes'

import Layout from '@/components/Layout'
import UserInfo from '@/components/UserInfo'

import './index.css'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ApolloProvider client={client}>
    <BrowserRouter>
      <UserInfo>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/home" />} />
            {menuRoutes.map((route) => {
              return <Route key={route.path} path={route.path} element={<route.element />} />
            })}
          </Route>
          {COMMON_ROUTES_CONFIG.map((route) => {
            return <Route key={route.key} path={route.path} element={<route.element />} />
          })}
        </Routes>
      </UserInfo>
    </BrowserRouter>
  </ApolloProvider>,
  // </StrictMode>,
)
