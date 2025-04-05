import {
  COMMIT_ORGANIZATION,
  DELETE_ORGANIZATION,
  GET_ORGANIZATION,
  GET_ORGANIZATIONS,
  GET_ORGANIZATIONS_SIMPLE,
} from '@/graphql/organization'
import { QueryList, QueryRecord } from '@/types'
import { Organization } from '@/types'
import { useMutation, useQuery } from '@apollo/client'
import { Page } from '@fe/shared'
import { message } from 'antd'

export const useOrganizations = (
  page: Page = { pageNum: 1, pageSize: 10 },
  simple: boolean = false,
  organizationName: string = '',
) => {
  const { loading, data, refetch } = useQuery<QueryList<Organization>>(
    simple ? GET_ORGANIZATIONS_SIMPLE : GET_ORGANIZATIONS,
    {
      variables: {
        page: {
          pageSize: page.pageSize,
          pageNum: page.pageNum,
        },
        organizationName,
      },
    },
  )

  return {
    loading,
    data,
    refetch,
  }
}

type QueryOrganization = QueryRecord<Organization>

export const useOrganization = (id: string) => {
  const { loading, data } = useQuery<QueryOrganization>(GET_ORGANIZATION, {
    variables: {
      id,
    },
    skip: !id,
  })

  return {
    loading,
    data,
  }
}

export const useCommitOrg = (): [typeof handleCommitOrg, boolean] => {
  const [commitOrg, { loading }] = useMutation(COMMIT_ORGANIZATION)

  const handleCommitOrg = async (params: Organization, success?: () => void) => {
    const res = await commitOrg({ variables: { params } })
    const data = res.data?.commitOrganization
    if (data.code === 200) {
      message.success(data?.message || '提交成功')
      if (typeof success === 'function') {
        success()
      }
      return
    }
    message.error(data?.message || '提交失败')
  }

  return [handleCommitOrg, loading]
}

export const useDelOrg = (): [(id: string, success: () => void) => void, boolean] => {
  const [del, { loading }] = useMutation(DELETE_ORGANIZATION)

  const handleDelOrg = async (id: string, success?: () => void) => {
    const res = await del({ variables: { id } })
    const data = res.data?.deleteOrganization
    if (data?.code === 200) {
      message.success(data?.message || '删除成功')
      if (typeof success === 'function') {
        success()
      }
    } else {
      message.error(data?.message || '删除失败')
    }
  }

  return [handleDelOrg, loading]
}
