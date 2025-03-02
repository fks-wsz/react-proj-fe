import { useCallback } from 'react'

import { LockOutlined, MobileOutlined } from '@ant-design/icons'
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components'
import { Tabs, message, theme } from 'antd'

import { useQuery } from '@apollo/client'
import { LOGIN, GET_LOGIN_SMS_CODE } from '@/graphql/auth'

import styles from './index.module.less'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { USER_TOKEN_KEY } from '@/constants'
import { useUserInfoContext } from '@/utils/userHooks'
import { UserInfoStore } from '@/types'

type LoginParams = {
  phoneNumber: string
  code: string
  autoLogin: boolean
}

const Login = () => {
  const { token } = theme.useToken()
  const { store: userInfoStore } = useUserInfoContext<UserInfoStore>()
  const { refetch: fetchCode } = useQuery(GET_LOGIN_SMS_CODE, { skip: true })
  const { refetch: fetchLogin } = useQuery(LOGIN, { skip: true })
  const nav = useNavigate()
  const [params] = useSearchParams()

  // 登录
  const login = useCallback(
    async (values: LoginParams) => {
      const {
        data: { login },
      } = await fetchLogin(values)
      const { code, data = {} } = login
      if (code === 200 && data.token) {
        // 登录成功
        const { autoLogin } = values
        if (autoLogin) {
          sessionStorage.removeItem(USER_TOKEN_KEY)
          localStorage.setItem(USER_TOKEN_KEY, data.token)
        } else {
          localStorage.removeItem(USER_TOKEN_KEY)
          sessionStorage.setItem(USER_TOKEN_KEY, data.token)
        }
        userInfoStore.refetch()
        message.success('登录成功！')
        nav(params.get('targetUrl') || '/')
        return
      }
      message.error('登录失败！')
    },
    [fetchLogin, nav, userInfoStore],
  )

  // 获取验证码
  const handleGetCode = useCallback(
    async (phoneNumber: string) => {
      const {
        data: { getLoginSmsMsg },
      } = await fetchCode({ phoneNumber })
      const { code } = getLoginSmsMsg
      if (code === 200) {
        message.success('验证码发送成功！')
      } else {
        message.error('验证码发送失败！')
      }
    },
    [fetchCode],
  )

  return (
    <ProConfigProvider hashed={false}>
      <div className={styles.container} style={{ backgroundColor: token.colorBgContainer }}>
        <LoginForm
          logo="https://github.githubassets.com/favicons/favicon.png"
          title="Github"
          subTitle="全球最大的代码托管平台"
          onFinish={login}
        >
          <Tabs
            centered
            items={[
              {
                key: 'phone',
                label: '手机号登录',
              },
            ]}
          ></Tabs>
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileOutlined className={'prefixIcon'} />,
              }}
              name="phoneNumber"
              placeholder={'手机号'}
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              captchaProps={{
                size: 'large',
              }}
              phoneName="phoneNumber"
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'获取验证码'}`
                }
                return '获取验证码'
              }}
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
              onGetCaptcha={handleGetCode}
            />
          </>
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  )
}

export default Login
