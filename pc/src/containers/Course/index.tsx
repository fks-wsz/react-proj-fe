import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components'
import {
  ATDrawerReducer,
  ConsumeCardDrawerReducer,
  DEFAULT_AT_DRAWER_RECORD,
  DEFAULT_CONSUME_CARD_DRAWER_RECORD,
  DEFAULT_EDIT_DRAWER_RECORD,
  editDrawerReducer,
  getColumns,
} from './data'
import { useUserInfoContext } from '@/hooks/userHooks'
import { UserInfoStore } from '@/types'
import { type Course } from '@/types/course'
import { useCourses } from '@/services/course'
import { DEFAULT_PAGE_INPUT, DEFAULT_PAGE_SIZE } from '@/constants/default'
import { useEffect, useReducer, useRef } from 'react'
import EditDrawer from './components/EditDrawer'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import AppointmentTimeDrawer from './components/AppointmentTimeDrawer'
import ConsumeCardDrawer from './components/ConsumeCardDrawer'

/**
 * @description
 */
const Course = () => {
  const { store } = useUserInfoContext<UserInfoStore>()
  const { refetchForAntdRequest } = useCourses({ page: DEFAULT_PAGE_INPUT }, { skip: true })
  // 编辑课程抽屉
  const [editDrawerRecord, dispatchEditDrawer] = useReducer(
    editDrawerReducer,
    DEFAULT_EDIT_DRAWER_RECORD,
  )
  // 预约时间(AppointmentTime)抽屉
  const [ATDrawerRecord, dispatchATDrawer] = useReducer(ATDrawerReducer, DEFAULT_AT_DRAWER_RECORD)
  const [ConsumeCardDrawerRecord, dispatchConsumeCardDrawer] = useReducer(
    ConsumeCardDrawerReducer,
    DEFAULT_CONSUME_CARD_DRAWER_RECORD,
  )

  const tableActionRef = useRef<ActionType | null>(null)

  useEffect(() => {
    if (store?.selectOrg?.value) {
      tableActionRef.current?.reload()
    }
  }, [store.selectOrg.value])

  // 列
  const columns = getColumns({ dispatchEditDrawer, dispatchATDrawer, dispatchConsumeCardDrawer })

  return (
    <>
      <PageContainer header={{ title: `${store.selectOrg.label} 门店所有课程` }}>
        <ProTable<Course>
          rowKey="id"
          actionRef={tableActionRef}
          columns={columns}
          pagination={{
            pageSize: DEFAULT_PAGE_SIZE,
          }}
          toolBarRender={() => [
            <Button
              key="createCourseBtn"
              type="primary"
              size="middle"
              icon={<PlusOutlined />}
              onClick={() => dispatchEditDrawer({ type: 'create' })}
            >
              新增课程
            </Button>,
          ]}
          request={refetchForAntdRequest}
        ></ProTable>
        {/* 编辑课程抽屉 */}
        <EditDrawer
          open={editDrawerRecord.open}
          id={editDrawerRecord.courseId}
          reloadTable={tableActionRef.current?.reload}
          handleClose={() => dispatchEditDrawer({ type: 'close' })}
        />
        {/* 预约时间抽屉 */}
        <AppointmentTimeDrawer
          open={ATDrawerRecord.open}
          id={ATDrawerRecord.courseId}
          handleClose={() => dispatchATDrawer({ type: 'close' })}
        />
        <ConsumeCardDrawer
          open={ConsumeCardDrawerRecord.open}
          id={ConsumeCardDrawerRecord.courseId}
          handleClose={() => dispatchConsumeCardDrawer({ type: 'close' })}
        />
      </PageContainer>
    </>
  )
}

export default Course
