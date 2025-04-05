import { useUserInfoContext } from '@/hooks/userHooks'
import {
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components'
import { Col, Form, message, Row } from 'antd'
import { useCallback, useEffect, useRef } from 'react'

import { UPDATE_USER_INFO } from '@/graphql/user'
import { UserInfoStore } from '@/types'
import { useMutation } from '@apollo/client'

import OSSUpload from '@/containers/OSSUpload'
import { UploadFile } from 'antd/lib'

type UserInfoForm = {
  name: string
  desc: string
  phoneNumber: string
  avatar: UploadFile[]
}

/**
 * @description
 */
const My = () => {
  const { store: userInfoStore } = useUserInfoContext<UserInfoStore>()
  const formRef = useRef<ProFormInstance>(null)
  const [updateUserInfo] = useMutation(UPDATE_USER_INFO)

  useEffect(() => {
    const { phoneNumber, name, desc, avatarUrl } = userInfoStore.userInfo
    formRef.current?.setFieldsValue({
      phoneNumber: phoneNumber,
      name: name,
      desc: desc,
      avatar: [{ url: avatarUrl || null }],
    })
  }, [userInfoStore.userInfo])

  /** 提交表单 */
  const handleFinish = useCallback(
    async (values: Partial<UserInfoForm>) => {
      const { name, desc, avatar } = values
      const avatarUrl = avatar?.[0]?.url ?? ''

      const res = await updateUserInfo({
        variables: {
          id: userInfoStore.userInfo.id,
          params: { name, desc, avatarUrl },
        },
      })
      if (res?.data?.updateUserInfo?.code === 200) {
        message.success('修改成功')
        userInfoStore.refetch()
      } else {
        message.error('修改失败, 请重试')
      }
    },
    [updateUserInfo, userInfoStore],
  )

  return (
    <>
      <PageContainer>
        <ProForm
          formRef={formRef}
          layout="horizontal"
          labelAlign="right"
          labelCol={{ span: 6 }}
          submitter={{
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
          }}
          onFinish={handleFinish}
        >
          <Row gutter={24}>
            <Col>
              <ProFormText disabled name="phoneNumber" label="手机号" />
              <ProFormText name="name" label="姓名" />
              <ProFormTextArea name="desc" label="签名" />
            </Col>
            <Col>
              <Form.Item name="avatar" label="头像">
                <OSSUpload label="上传头像" maxCount={1} aspect={1 / 1} />
              </Form.Item>
            </Col>
          </Row>
        </ProForm>
      </PageContainer>
    </>
  )
}

export default My
