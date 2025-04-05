import { useOrganizations } from '@/services/organization'
import { Button, Select, Space } from 'antd'
import _ from 'lodash'
import { useUserInfoContext } from '@/hooks/userHooks'
import { UserInfoStore } from '@/types'
import { LOCAL_STORAGE_KEYS } from '@/constants'
import { ShopOutlined } from '@ant-design/icons'
import { useGoTo } from '@/hooks/routeHooks'

/**
 * @description
 */
const OrgSelect = () => {
  const { store, setStore } = useUserInfoContext<UserInfoStore>()
  const { data, refetch } = useOrganizations({ pageNum: 1, pageSize: 10 }, true)
  const { go } = useGoTo()

  const options =
    data?.getOrganizations?.data?.map((item) => {
      return {
        label: item.organizationName,
        value: item.id,
      }
    }) ?? []

  const handleSelectSearch = _.debounce((value: string) => {
    refetch({
      organizationName: value,
    })
  }, 500)

  function handleSelectChange(value: { label: string; value: string }) {
    const org = {
      value: value.value,
      label: value.label,
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS['SELECT_ORG'], JSON.stringify(org))
    setStore((s) => ({ ...s, selectOrg: org }))
  }

  return (
    <>
      <Space style={{ padding: 0 }}>
        <span>门店选择: </span>
        <Select
          showSearch
          labelInValue
          placeholder="请选择门店"
          defaultValue={store.selectOrg || {}}
          options={options}
          filterOption={false}
          style={{ width: '200px' }}
          onSearch={handleSelectSearch}
          onSelect={handleSelectChange}
        ></Select>
        <Button
          icon={<ShopOutlined />}
          onClick={() => {
            go('ORGANIZATION')
          }}
        ></Button>
      </Space>
    </>
  )
}

export default OrgSelect
