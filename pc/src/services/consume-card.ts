import { COMMIT_CARD, DELETE_CARD, GET_CARDS } from '@/graphql/consume-card'
import { BaseResponse, BaseResponseRecordValue, QueryListWithoutPage } from '@/types'
import { ConsumeCard } from '@/types/consume-card'
import { useLazyQuery, useMutation } from '@apollo/client'

/** @description 消费卡列表(不分页) */
export const useConsumeCards = () => {
  const [query, { data, loading, refetch }] =
    useLazyQuery<QueryListWithoutPage<ConsumeCard>>(GET_CARDS)

  const getList = async (variables: { courseId: string }): Promise<ConsumeCard[]> => {
    const res = await query({
      variables: variables,
    })
    return res?.data?.getCards?.data ?? []
  }

  const refresh = async () => {
    const res = await refetch()
    return res?.data?.getCards?.data ?? []
  }

  return {
    data: data?.getCards,
    loading,
    query: getList,
    refresh,
  }
}

/** @description 更新卡片 */
export const useCommitCard = () => {
  const [mutate, { loading }] = useMutation<BaseResponse>(COMMIT_CARD)

  const commitCard = async (params: Partial<ConsumeCard> & { courseId: string }) => {
    const res = await mutate({
      variables: {
        params,
      },
    })
    const response = res.data?.commitCard ?? ({} as BaseResponseRecordValue)
    return response
  }

  return {
    loading,
    commitCard,
  }
}

export const useDeleteCard = () => {
  const [mutate, { loading }] = useMutation<BaseResponse>(DELETE_CARD)

  const deleteCard = async (id: string) => {
    const res = await mutate({
      variables: {
        id: id,
      },
    })
    const response = res?.data?.deleteCard ?? ({} as BaseResponseRecordValue)
    return response
  }

  return {
    loading,
    deleteCard,
  }
}
