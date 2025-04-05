import { DEFAULT_ANTD_DRAWER_WIDTH } from '@/constants/default'
import { Button, Col, Drawer, Row, Space, Tabs, message } from 'antd'
import { getATColumns, DAYS_ITEMS } from './data'
import { EditableProTable } from '@ant-design/pro-components'
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import { useCommitCourse, useCourse } from '@/services/course'
import { CourseReserverTimeDay, CourseTimeRecord } from '@/types'
import _ from 'lodash'

export type DrawerProps = {
  /** 抽屉打开状态 */
  open: boolean
  /** 课程Id */
  id: string
  /** 关闭抽屉 */
  handleClose: () => void
}

/**
 * @description
 */
const AppointmentTimeDrawer = ({ open, id, handleClose }: DrawerProps) => {
  const [currentDay, setCurrentDay] = useState(DAYS_ITEMS[0])
  const {
    getCourse,
    loading: courseDataLoading,
    data: courseData,
    refresh: refreshCourseList,
  } = useCourse()
  const { handleCommitCourse, commitCourseLoading } = useCommitCourse()
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (open && id) {
      getCourse(id)
    }
  }, [id])

  const reserverTimes = courseData?.reserverTimes || []

  /** @name 当前天可约时间 */
  const reserverTimesForDay = useMemo(() => {
    return reserverTimes.find((item) => item.week === currentDay.key)?.reserverTimes ?? []
  }, [currentDay, reserverTimes])

  /** @description 日期更变 */
  function handleDayChange(activeKey: string) {
    const nextActive = DAYS_ITEMS.find((item) => item.key === activeKey)
    if (nextActive !== void 0) {
      setCurrentDay(nextActive)
    }
  }

  /** @description 更新预约时间 */
  async function resolveTableRowSave(newReserverTimesForDay: CourseTimeRecord[]) {
    const newReserverTimes = _.cloneDeep(reserverTimes)
    const curDayReserverTimesIdx = newReserverTimes.findIndex(
      (item) => item.week === currentDay.key,
    )
    if (curDayReserverTimesIdx > -1) {
      // 更新
      newReserverTimes[curDayReserverTimesIdx].reserverTimes = newReserverTimesForDay
    } else {
      // 新增
      newReserverTimes.push({
        week: currentDay.key,
        reserverTimes: newReserverTimesForDay,
      })
    }
    if (id) {
      updateReserverTimeAndRefresh({ id, reserverTimes: newReserverTimes })
    }
  }

  /** @description 调用接口更新预约时间数据 */
  async function updateReserverTimeAndRefresh(
    params: {
      id: string
      reserverTimes: CourseReserverTimeDay[]
    },
    options?: { message: string },
  ) {
    const { message } = options || {}
    try {
      await handleCommitCourse(params)
      await refreshCourseList()
      if (message) {
        messageApi.success(message)
      }
    } catch {
      messageApi.error('更新课程预约时间失败！')
    }
  }

  const [allSyncBtnLoading, setAllSyncBtnLoading] = useState(false)
  const [workdaySyncBtnLoading, setWorkdaySyncBtnLoading] = useState(false)
  /** @description 多天同步时间 */
  async function handleBundleSync(type: 'ALL' | 'WORKING_DAY') {
    const newReserverTimes: CourseReserverTimeDay[] = []
    if (type === 'ALL') {
      // 全周
      setAllSyncBtnLoading(true)
      DAYS_ITEMS.forEach((week) => {
        newReserverTimes.push({
          week: week.key,
          reserverTimes: [...reserverTimesForDay],
        })
      })
      await updateReserverTimeAndRefresh({ id, reserverTimes: newReserverTimes })
      setAllSyncBtnLoading(false)
    } else if (type === 'WORKING_DAY') {
      // 工作日
      setWorkdaySyncBtnLoading(true)
      DAYS_ITEMS.forEach((week) => {
        if (week.key !== 'Saturday' && week.key !== 'Sunday') {
          newReserverTimes.push({
            week: week.key,
            reserverTimes: [...reserverTimesForDay],
          })
        }
      })
      await updateReserverTimeAndRefresh({ id, reserverTimes: newReserverTimes })
      setWorkdaySyncBtnLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <Drawer
        forceRender
        title="编辑预约时间"
        width={DEFAULT_ANTD_DRAWER_WIDTH}
        open={open}
        onClose={handleClose}
        footer={
          <>
            <Space>
              <Button onClick={() => handleClose()}>取消</Button>
            </Space>
          </>
        }
      >
        <Tabs
          items={DAYS_ITEMS}
          activeKey={currentDay.key}
          type="card"
          onChange={handleDayChange}
        />
        <EditableProTable<CourseTimeRecord>
          headerTitle={
            <span>
              <span className=" text-blue-500 font-bold">
                {`${courseData?.name}-${currentDay.label}`}
              </span>
              上课时间表
            </span>
          }
          loading={courseDataLoading || commitCourseLoading}
          rowKey="key"
          recordCreatorProps={{
            record: (index: number) => ({
              key: index + 1 + '',
              startTime: '08:00:00',
              endTime: '10:00:00',
            }),
          }}
          value={reserverTimesForDay}
          columns={getATColumns()}
          editable={{
            onSave: async (key, record) => {
              const recordIndex = reserverTimesForDay.findIndex((item) => item.key === key)
              const newReserverTimesForDay = [...reserverTimesForDay]
              if (recordIndex > -1) {
                newReserverTimesForDay[recordIndex] = { ..._.omit(record, 'index') }
              } else {
                newReserverTimesForDay.push(_.omit(record, 'index'))
              }
              resolveTableRowSave(newReserverTimesForDay)
            },
          }}
        />
        <Row gutter={24}>
          <Col span={12}>
            <Button
              className="w-full"
              color="blue"
              variant="solid"
              loading={workdaySyncBtnLoading}
              icon={<ClockCircleOutlined />}
              onClick={() => handleBundleSync('WORKING_DAY')}
            >
              全工作日同步
            </Button>
          </Col>
          <Col span={12}>
            <Button
              className="w-full"
              color="cyan"
              variant="solid"
              loading={allSyncBtnLoading}
              icon={<CalendarOutlined />}
              onClick={() => handleBundleSync('ALL')}
            >
              全周同步
            </Button>
          </Col>
        </Row>
      </Drawer>
    </>
  )
}

export default AppointmentTimeDrawer
