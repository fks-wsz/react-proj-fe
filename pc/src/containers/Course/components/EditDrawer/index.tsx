import { useCommitCourse, useCourse } from '@/services/course'
import { Button, Col, Drawer, Form, Input, InputNumber, Row, Space } from 'antd'
import { useEffect } from 'react'

export type EditorDrawerProps = {
  open: boolean
  id?: string
  handleClose: () => void
  reloadTable?: () => Promise<void>
}

/**
 * @description
 */
const EditDrawer = ({ open, id, handleClose, reloadTable }: EditorDrawerProps) => {
  const { getCourse, loading: loadingCourse } = useCourse()
  const [formInstance] = Form.useForm()
  const { handleCommitCourse, commitCourseLoading } = useCommitCourse()

  const isEdit = id ? true : false
  const drawerTitle = isEdit ? '编辑课程' : '新增课程'

  useEffect(() => {
    let ignore = false
    if (id) {
      getCourse(id).then((courseInfo) => {
        if (!ignore) {
          formInstance.setFieldsValue(courseInfo)
        }
      })
    } else {
      formInstance.resetFields()
    }
    return () => {
      ignore = true
    }
  }, [id])

  function handleSubmitClick() {
    formInstance.validateFields().then((values) => {
      const params = { ...values }
      if (isEdit) params.id = id
      handleCommitCourse(params).then(() => {
        formInstance.resetFields()
        handleClose()
        reloadTable?.()
      })
    })
  }

  return (
    <>
      <Drawer
        width="50%"
        forceRender
        title={drawerTitle}
        open={open}
        loading={loadingCourse}
        onClose={handleClose}
        footer={
          <>
            <Space>
              <Button type="primary" loading={commitCourseLoading} onClick={handleSubmitClick}>
                提交
              </Button>
              <Button onClick={() => handleClose()}>取消</Button>
            </Space>
          </>
        }
      >
        <Form form={formInstance} layout="vertical">
          <Form.Item
            name="name"
            label="课程名称"
            rules={[{ required: true, message: '课程名称不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="sections"
                label="课程节数"
                rules={[{ required: true, message: '课程节数不能为空' }]}
              >
                <InputNumber min={1} addonAfter="节" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sectionDuration"
                label="节课时长"
                rules={[{ required: true, message: '节课时长不能为空' }]}
              >
                <InputNumber min={1} addonAfter="分钟" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="fitPeople"
                label="适宜人群"
                rules={[{ required: true, message: '适宜人群不能为空' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="baseAbility"
                label="适合基础"
                rules={[{ required: true, message: '适合基础不能为空' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="课程简介">
            <Input.TextArea rows={4} maxLength={200} style={{ resize: 'none' }} />
          </Form.Item>
          <Form.Item name="reserverInfo" label="预约信息">
            <Input.TextArea rows={4} maxLength={200} style={{ resize: 'none' }} />
          </Form.Item>
          <Form.Item name="refundInfo" label="退款信息">
            <Input.TextArea rows={4} maxLength={200} style={{ resize: 'none' }} />
          </Form.Item>
          <Form.Item name="otherInfo" label="其他说明信息">
            <Input.TextArea rows={4} maxLength={200} style={{ resize: 'none' }} />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default EditDrawer
