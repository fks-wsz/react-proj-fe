import OSSUpload from '@/containers/OSSUpload'
import { useCommitOrg, useOrganization } from '@/services/organization'
import { Organization } from '@/types'
import {
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components'
import { Button, Col, Divider, Drawer, DrawerProps, Form, Row, Spin, message } from 'antd'
import { useMemo, useRef } from 'react'

type EditDrawerProps = {
  id: string
  drawerProps: DrawerProps
  closeDrawer: () => void
  handleRefreshList: () => void
}

const EditDrawer = ({ id, drawerProps, closeDrawer, handleRefreshList }: EditDrawerProps) => {
  const { data, loading: queryDataLoading } = useOrganization(id)
  const [handleCommitOrg, commitLoading] = useCommitOrg()

  const initialValue = useMemo(() => {
    const orgData = data?.getOrganization?.data
    if (orgData) {
      return {
        ...orgData,
        tags: orgData.tags.split(','),
        logoUrl: [{ url: orgData.logoUrl }],
        businessLicenseUrl: [{ url: orgData.businessLicenseUrl }],
        idCardFrontUrl: [{ url: orgData.idCardFrontUrl }],
        idCardBackUrl: [{ url: orgData.idCardBackUrl }],
        orgFrontImg: orgData.orgFrontImg.map((img) => ({ url: img.url })),
        orgRoomImg: orgData.orgRoomImg.map((img) => ({ url: img.url })),
        orgOtherImg: orgData.orgOtherImg.map((img) => ({ url: img.url })),
      }
    } else {
      return {}
    }
  }, [data])
  const formRef = useRef<ProFormInstance>(null)

  /** 提交 */
  async function handleSubmitClick() {
    try {
      const values = await formRef.current?.validateFields()
      const formData = {
        ...values,
        ...(id ? { id } : {}),
        tags: values.tags?.join?.(',') ?? '',
        logoUrl: values.logoUrl[0].url,
        businessLicenseUrl: values.businessLicenseUrl[0].url,
        idCardFrontUrl: values.idCardFrontUrl[0].url,
        idCardBackUrl: values.idCardBackUrl[0].url,
        orgFrontImg: values.orgFrontImg?.map((img: { url: string }) => ({ url: img.url })),
        orgRoomImg: values.orgRoomImg?.map((img: { url: string }) => ({ url: img.url })),
        orgOtherImg: values.orgOtherImg?.map((img: { url: string }) => ({ url: img.url })),
      } as Organization
      await handleCommitOrg(formData, () => {
        closeDrawer()
        handleRefreshList()
      })
    } catch (err: any) {
      if (err.errorFields.length > 0) {
        message.error('请填写完整信息')
      }
    }
  }

  if (queryDataLoading) {
    return <Spin fullscreen spinning={queryDataLoading}></Spin>
  }

  return (
    <>
      <div className="container">
        <Drawer
          width="50%"
          placement="right"
          closable={false}
          loading={commitLoading}
          footer={
            <>
              <Button type="primary" onClick={handleSubmitClick}>
                提交
              </Button>
            </>
          }
          {...drawerProps}
        >
          <ProForm
            layout="vertical"
            labelAlign="right"
            formRef={formRef}
            initialValues={initialValue}
            submitter={false}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="门店Logo"
                  name="logoUrl"
                  rules={[{ required: true, message: '请上传门店Logo' }]}
                >
                  <OSSUpload label="上传Logo" maxCount={1} aspect={1 / 1} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <ProFormText
                  label="门店名称"
                  name="organizationName"
                  placeholder="请输入门店名称"
                  rules={[{ required: true, message: '请输入门店名称' }]}
                ></ProFormText>
                <ProFormSelect
                  label="标签"
                  name="tags"
                  fieldProps={{ mode: 'multiple' }}
                  placeholder="请选择门店标签"
                  // rules={[{ required: true, message: '请输入门店标签', type: 'array' }]}
                ></ProFormSelect>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <ProFormText
                  label="地址"
                  name="address"
                  placeholder="请输入门店地址"
                  rules={[{ required: true, message: '请输入门店地址' }]}
                ></ProFormText>
              </Col>
              <Col span={12}>
                <ProFormText
                  label="电话"
                  name="phoneNumber"
                  placeholder="请输入门店电话"
                  rules={[{ required: true, message: '请输入门店电话' }]}
                ></ProFormText>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <ProFormText
                  label="经度"
                  name="longitude"
                  rules={[{ required: true, message: '请输入门店经度' }]}
                ></ProFormText>
              </Col>
              <Col span={12}>
                <ProFormText
                  label="纬度"
                  name="latitude"
                  rules={[{ required: true, message: '请输入门店纬度' }]}
                ></ProFormText>
              </Col>
            </Row>
            <ProFormTextArea
              allowClear
              showCount
              label="门店详情"
              name="description"
              placeholder="请输入门店详情"
              maxLength={500}
              rows={4}
            ></ProFormTextArea>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  label="营业执照"
                  name="businessLicenseUrl"
                  rules={[{ required: true, message: '请上传营业执照' }]}
                >
                  <OSSUpload maxCount={1} aspect={3 / 2}></OSSUpload>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="身份证国徽面"
                  name="idCardFrontUrl"
                  rules={[{ required: true, message: '请上传身份证国徽面' }]}
                >
                  <OSSUpload maxCount={1} aspect={3 / 2}></OSSUpload>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="身份证人像面"
                  name="idCardBackUrl"
                  rules={[{ required: true, message: '请上传身份证人像面' }]}
                >
                  <OSSUpload maxCount={1} aspect={3 / 2}></OSSUpload>
                </Form.Item>
              </Col>
            </Row>
            <Divider>门店图推荐上传9:16 图片 最多上传5 张</Divider>
            <Form.Item
              label="门店正面照"
              name="orgFrontImg"
              rules={[{ required: true, message: '请上传门店正面照' }]}
            >
              <OSSUpload maxCount={5} aspect={9 / 16} />
            </Form.Item>
            <Form.Item
              label="门店内部照"
              name="orgRoomImg"
              rules={[{ required: true, message: '请上传门店内部照' }]}
            >
              <OSSUpload maxCount={5} aspect={9 / 16} />
            </Form.Item>
            <Form.Item label="门店其他照" name="orgOtherImg">
              <OSSUpload maxCount={5} aspect={9 / 16} />
            </Form.Item>
          </ProForm>
        </Drawer>
      </div>
    </>
  )
}

export default EditDrawer
