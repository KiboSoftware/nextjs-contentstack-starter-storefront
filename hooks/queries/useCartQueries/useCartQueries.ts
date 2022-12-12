import { useQuery } from 'react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { getCartQuery } from '@/lib/gql/queries'
import { cartKeys } from '@/lib/react-query/queryKeys'

import type { CrCart } from '@/lib/gql/types'

export interface UseCartType {
  data: CrCart
  isLoading: boolean
  isSuccess: boolean
}

const getCurrentCart = async () => {
  const client = makeGraphQLClient()
  const response = await client.request({
    document: getCartQuery,
    variables: {},
  })
  return response?.currentCart
}

export const useCartQueries = (initialData: CrCart): UseCartType => {
  try {
    const {
      data = {},
      isLoading,
      isSuccess,
    } = useQuery(cartKeys.all, getCurrentCart, {
      initialData,
      refetchOnWindowFocus: false,
    })

    return { data, isLoading, isSuccess }
  } catch (err) {
    throw new Error()
  }
}
