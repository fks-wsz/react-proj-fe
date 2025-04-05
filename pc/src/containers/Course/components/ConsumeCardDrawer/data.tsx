import { ConsumeCard, ConsumeCardType } from '@/types/consume-card'
import { ProColumns } from '@ant-design/pro-components'
import { Popconfirm, Space } from 'antd'

export const createConsumeCard = (id: string) => {
  return {
    id: id,
    name: '',
    type: ConsumeCardType['TIMES'],
    times: 0,
    days: 0,
  }
}

type GetConsumeCardColumnsProps = {
  handleDeleteCard: (id: string) => void
}

export const getConsumeCardColumns = ({
  handleDeleteCard,
}: GetConsumeCardColumnsProps): ProColumns<ConsumeCard>[] => {
  return [
    {
      title: '序号',
      dataIndex: 'id',
      width: 50,
      editable: false,
      align: 'center',
      render: (_1, _2, index) => index + 1,
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
      align: 'center',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '消费卡名称不得为空',
          },
        ],
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'select',
      align: 'center',
      fieldProps: {
        options: [
          {
            label: '次卡',
            value: ConsumeCardType['TIMES'],
          },
          {
            label: '时长卡',
            value: ConsumeCardType['DURATION'],
          },
        ],
      },
    },
    {
      title: '次数',
      dataIndex: 'times',
      valueType: 'digit',
      align: 'center',
    },
    {
      title: '有效期',
      dataIndex: 'days',
      valueType: 'digit',
      align: 'center',
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
              action?.startEditable(record.id || '')
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="提醒"
            description="确认要删除吗？"
            onConfirm={() => {
              const { id } = record
              if (id) {
                handleDeleteCard(id)
              }
            }}
          >
            <a key="delete">删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]
}
