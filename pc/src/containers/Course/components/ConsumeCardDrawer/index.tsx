import { DEFAULT_ANTD_DRAWER_WIDTH } from '@/constants/default'
import { ConsumeCard } from '@/types/consume-card'
import { EditableProTable } from '@ant-design/pro-components'
import { Button, Drawer, message, Space } from 'antd'
import { useEffect } from 'react'
import { createConsumeCard, getConsumeCardColumns } from './data'
import { useCommitCard, useConsumeCards, useDeleteCard } from '@/services/consume-card'
import _ from 'lodash'

type ConsumeCardDrawerProps = {
  open: boolean
  id: string
  handleClose: () => void
}

/**
 * @description
 */
const ConsumeCardDrawer = ({ open, id, handleClose }: ConsumeCardDrawerProps) => {
  const {
    data: cardsData,
    loading: cardsLoading,
    query: getCards,
    refresh: refreshCardList,
  } = useConsumeCards()
  const { loading: commitCardLoading, commitCard } = useCommitCard()
  const { loading: deleteCardLoading, deleteCard } = useDeleteCard()
  const [messageApi, contextHolder] = message.useMessage()

  const cardsList = cardsData?.data || ([] as ConsumeCard[])
  const tableLoading = cardsLoading || commitCardLoading || deleteCardLoading

  useEffect(() => {
    if (open && id) {
      getCards({ courseId: id })
    }
  }, [id])

  function handleSaveCards(params: Partial<ConsumeCard> & { courseId: string }) {
    commitCard(params).then((response) => {
      const { code, message } = response
      if (code === 200) {
        refreshCardList().then(() => {
          messageApi.success(message)
        })
      } else {
        messageApi.error(message)
      }
    })
  }

  function handleDeleteCard(id: string) {
    deleteCard(id).then((response) => {
      const { code, message } = response
      if (code === 200) {
        refreshCardList().then(() => {
          messageApi.success(message)
        })
      } else {
        messageApi.error(message)
      }
    })
  }

  return (
    <>
      {contextHolder}
      <Drawer
        forceRender
        title="消费卡管理"
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
        <EditableProTable<ConsumeCard>
          loading={tableLoading}
          rowKey="id"
          recordCreatorProps={{
            record: (index: number) => createConsumeCard(index + 1 + ''),
          }}
          value={cardsList}
          columns={getConsumeCardColumns({ handleDeleteCard })}
          editable={{
            onSave: async (key, record) => {
              const existIdx = cardsList.findIndex((item) => item.id === key)
              let params
              if (existIdx > -1) {
                // 更新
                params = { ..._.omit(record, 'index'), courseId: id }
              } else {
                // 创建
                params = { ..._.omit(record, 'index', 'id'), courseId: id }
              }
              handleSaveCards(params)
            },
          }}
        />
      </Drawer>
    </>
  )
}

export default ConsumeCardDrawer
