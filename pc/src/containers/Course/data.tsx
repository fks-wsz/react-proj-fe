import { Course } from '@/types/course'
import { ProColumns } from '@ant-design/pro-components'
import { Space } from 'antd'

/** 课程信息编辑 reducer */
type EditDrawerRecord = {
  open: boolean
  courseId?: string
}
type EditDrawerAction =
  | { type: 'edit'; value: Partial<EditDrawerRecord> }
  | { type: 'close' | 'create' }

export const DEFAULT_EDIT_DRAWER_RECORD = {
  open: false,
  courseId: '',
}
export const editDrawerReducer = (state: EditDrawerRecord, action: EditDrawerAction) => {
  const { type } = action
  switch (type) {
    case 'edit': {
      // 编辑
      const { courseId } = action.value
      return {
        ...state,
        open: true,
        courseId: courseId,
      }
    }
    case 'create': {
      // 创建
      return {
        ...state,
        open: true,
        courseId: '',
      }
    }
    case 'close': {
      // 关闭抽屉
      return {
        ...state,
        open: false,
        courseId: '',
      }
    }
    default: {
      return state
    }
  }
}

/** 课程预约时间抽屉 */
type ATDrawerRecord = {
  open: boolean
  courseId: string
}
type ATDrawerAction = { type: 'edit'; value: Omit<ATDrawerRecord, 'open'> } | { type: 'close' }

export const DEFAULT_AT_DRAWER_RECORD = {
  open: false,
  courseId: '',
}
export const ATDrawerReducer = (state: ATDrawerRecord, action: ATDrawerAction) => {
  const { type } = action
  switch (type) {
    case 'edit': {
      // 编辑
      const { courseId } = action.value
      return {
        ...state,
        open: true,
        courseId: courseId,
      }
    }
    case 'close': {
      // 关闭抽屉
      return {
        ...state,
        open: false,
        courseId: '',
      }
    }
    default: {
      return state
    }
  }
}

/** 课程消费卡抽屉 */
type ConsumeCardDrawerRecord = {
  open: boolean
  courseId: string
}
type ConsumeCardDrawerAction =
  | { type: 'edit'; value: Omit<ConsumeCardDrawerRecord, 'open'> }
  | { type: 'close' }

export const DEFAULT_CONSUME_CARD_DRAWER_RECORD = {
  open: false,
  courseId: '',
}
export const ConsumeCardDrawerReducer = (
  state: ConsumeCardDrawerRecord,
  action: ConsumeCardDrawerAction,
) => {
  const { type } = action
  switch (type) {
    case 'edit': {
      // 编辑
      const { courseId } = action.value
      return {
        ...state,
        open: true,
        courseId: courseId,
      }
    }
    case 'close': {
      // 关闭抽屉
      return {
        ...state,
        open: false,
        courseId: '',
      }
    }
    default: {
      return state
    }
  }
}

/** 课程表格列 */
export const getColumns = ({
  dispatchEditDrawer,
  dispatchATDrawer,
  dispatchConsumeCardDrawer,
}: {
  dispatchEditDrawer: (actions: EditDrawerAction) => void
  dispatchATDrawer: (actions: ATDrawerAction) => void
  dispatchConsumeCardDrawer: (actions: ConsumeCardDrawerAction) => void
}): ProColumns<Course>[] => {
  return [
    {
      title: '课程名',
      dataIndex: 'name',
      copyable: true,
      align: 'center',
    },
    {
      title: '适宜人群',
      dataIndex: 'fitPeople',
      search: false,
      align: 'center',
    },
    {
      title: '适合基础',
      dataIndex: 'baseAbility',
      search: false,
      align: 'center',
    },
    {
      title: '课程节数',
      dataIndex: 'sections',
      width: 75,
      search: false,
      align: 'center',
    },
    {
      title: '节课时长(分钟)',
      dataIndex: 'sectionDuration',
      width: 120,
      search: false,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      width: 250,
      align: 'center',
      render: (_, record) => (
        <Space>
          <a
            key="edit"
            onClick={() => {
              dispatchEditDrawer({ type: 'edit', value: { courseId: record.id } })
            }}
          >
            编辑
          </a>
          <a
            key="at"
            onClick={() => dispatchATDrawer({ type: 'edit', value: { courseId: record.id } })}
          >
            预约时间
          </a>
          <a
            key="card"
            onClick={() =>
              dispatchConsumeCardDrawer({ type: 'edit', value: { courseId: record.id } })
            }
          >
            消费卡管理
          </a>
        </Space>
      ),
    },
  ]
}
