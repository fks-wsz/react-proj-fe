import { DEFAULT_GQL_QUERY_OPT, DEFAULT_PAGE_INPUT, DEFAULT_PAGE_SIZE } from '@/constants/default'
import { COMMIT_COURSE, GET_COURSE, GET_COURSES } from '@/graphql/course'
import { QueryList, QueryRecord } from '@/types'
import { Course } from '@/types/course'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Page } from '@fe/shared'
import { message } from 'antd'

export const useCourses = (
  params: {
    page: Page
    name?: string
  } = { page: DEFAULT_PAGE_INPUT },
  options: {
    skip: boolean
  } = DEFAULT_GQL_QUERY_OPT,
) => {
  const { loading, data, refetch } = useQuery<QueryList<Course>>(GET_COURSES, {
    variables: params,
    ...options,
  })

  const refetchForAntdRequest = async (params?: {
    current?: number
    pageSize?: number
    name?: string
  }) => {
    const res = await refetch({
      page: {
        pageNum: params?.current ?? 1,
        pageSize: params?.pageSize ?? DEFAULT_PAGE_SIZE,
      },
      name: params?.name ?? '',
    })

    const isSuccess = !res.errors

    const data = res.data.getCourses

    return {
      data: data.data,
      success: isSuccess,
      total: data.page.total,
    }
  }

  return {
    loading,
    data,
    refetch,
    refetchForAntdRequest,
  }
}

/**
 * @description 获取课程详情
 */
export const useCourse = () => {
  const [getData, { loading, data, refetch }] = useLazyQuery<QueryRecord<Course>>(GET_COURSE)

  const getCourse = async (id: string): Promise<Course | undefined> => {
    const res = await getData({
      variables: {
        id: id,
      },
    })

    return res.data?.getCourse?.data
  }

  const refresh = async () => {
    const res = await refetch()
    return res?.data?.getCourse?.data
  }

  return {
    loading: loading,
    data: data?.getCourse?.data,
    getCourse: getCourse,
    refresh,
  }
}

/** @description 创建/更新课程 */
export const useCommitCourse = () => {
  const [commit, { loading }] = useMutation(COMMIT_COURSE)

  const handleCommitCourse = async (params: Partial<Course>) => {
    const res = await commit({
      variables: {
        params: params,
      },
    })

    if (res.errors) {
      message.error('提交课程信息失败')
      return
    }

    const data = res.data.commitCourse
    if (data.code === 200) {
      message.success(data.message)
      return
    } else {
      message.error(data.message || '更新课程失败')
    }
  }

  return {
    commitCourseLoading: loading,
    handleCommitCourse,
  }
}
