import { CourseTimeRecord, Weeks } from '@/types'
import { ProColumns } from '@ant-design/pro-components'
import { Popconfirm, Space } from 'antd'
import dayjs from 'dayjs'

export const DAYS_ITEMS: { key: Weeks; label: string }[] = [
  {
    key: 'Monday',
    label: '周一',
  },
  {
    key: 'Tuesday',
    label: '周二',
  },
  {
    key: 'Wednesday',
    label: '周三',
  },
  {
    key: 'Thursday',
    label: '周四',
  },
  {
    key: 'Friday',
    label: '周五',
  },
  {
    key: 'Saturday',
    label: '周六',
  },
  {
    key: 'Sunday',
    label: '周日',
  },
]

export const getATColumns = (): ProColumns<CourseTimeRecord>[] => {
  return [
    {
      title: '序号',
      dataIndex: 'key',
      width: 50,
      editable: false,
      align: 'center',
      render: (_1, _2, index) => index + 1,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      valueType: 'time',
      align: 'center',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '开始时间不得为空',
          },
        ],
      },
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'time',
      align: 'center',
      formItemProps(form, { rowKey }) {
        return {
          rules: [
            {
              validator(rule, value) {
                const { startTime } = form.getFieldValue(rowKey)
                const { $d } = value
                const sTime = dayjs(startTime, 'HH:mm:ss')
                if (dayjs($d).isBefore(sTime)) {
                  return Promise.reject('结束时间不得小于开始时间')
                }
                return Promise.resolve()
              },
            },
          ],
        }
      },
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (text, record, _, action) => (
        <Space>
          <a
            key="edit"
            onClick={() => {
              action?.startEditable(record.key || '')
            }}
          >
            编辑
          </a>
          <Popconfirm title="提醒" description="确认要删除吗？">
            <a key="delete">删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]
}
