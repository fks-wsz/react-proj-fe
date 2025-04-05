import { useDelOrg, useOrganizations } from '@/services/organization'
import { PageContainer, ProList } from '@ant-design/pro-components'
import { Button, DrawerProps, Popconfirm, Tag } from 'antd'
import { useState } from 'react'
import EditDrawer from './components/EditOrg'

import style from './index.module.less'

/**
 * @description
 */
const OrganizationList = () => {
  const [page, setPage] = useState({ pageSize: 10, pageNum: 1 })
  const { loading, data, refetch } = useOrganizations(page)
  const [handleDelOrg] = useDelOrg()

  const list = data?.getOrganizations.data.map((item) => ({
    title: item.organizationName,
    subTitle: (
      <>
        {item.tags.split(',').map((tag) => (
          <Tag color="#5BD8A6" key={tag}>
            {tag}
          </Tag>
        ))}
      </>
    ),
    content: item.description,
    actions: [
      <a key="run" onClick={() => handleEditClick(item.id)}>
        编辑
      </a>,
      <Popconfirm
        title="删除门店"
        description="确认删除该门店?"
        onConfirm={() =>
          handleDelOrg(item.id, () => {
            handleRefreshList()
          })
        }
      >
        <a key="delete">删除</a>
      </Popconfirm>,
    ],
    avatar: item.logoUrl,
  }))

  /** 编辑门店 */
  function handleEditClick(id: string = '') {
    setCurId(id)
    setDrawerProps({
      ...drawerProps,
      open: true,
      title: id ? '编辑门店' : '新增门店',
    })
  }

  /** 页码更变 */
  function handlePageChange(pageNum: number, pageSize: number) {
    setPage({ pageSize, pageNum })
    refetch({
      page: {
        pageSize,
        pageNum,
      },
    })
  }

  /** 刷新当前列表 */
  function handleRefreshList() {
    refetch({ page })
  }

  // -------------------- Drawer --------------------
  const [drawerProps, setDrawerProps] = useState<DrawerProps>({
    title: '',
    open: false,
    maskClosable: true,
    onClose: () => {
      closeDrawer()
    },
  })
  function closeDrawer() {
    setDrawerProps({ ...drawerProps, open: false })
  }
  const [curId, setCurId] = useState('')

  return (
    <>
      <div className={style.container}>
        <PageContainer
          header={{
            title: '门店列表',
            extra: [
              <Button key="1" type="primary" onClick={() => handleEditClick()}>
                新增门店
              </Button>,
            ],
          }}
        >
          <ProList
            loading={loading}
            ghost={true}
            pagination={{
              defaultPageSize: page.pageSize,
              total: data?.getOrganizations.page.total,
              showSizeChanger: false,
              onChange: handlePageChange,
            }}
            grid={{ gutter: 16, column: 2 }}
            metas={{
              title: {
                render: (dom, item) => {
                  return <p className="mx-1 text-lg font-bold ">{item.title}</p>
                },
              },
              subTitle: {},
              avatar: {},
              content: {},
              actions: { cardActionProps: 'actions' },
            }}
            dataSource={list}
          />
          <EditDrawer
            key={curId}
            drawerProps={drawerProps}
            id={curId}
            handleRefreshList={handleRefreshList}
            closeDrawer={closeDrawer}
          />
        </PageContainer>
      </div>
    </>
  )
}

export default OrganizationList
