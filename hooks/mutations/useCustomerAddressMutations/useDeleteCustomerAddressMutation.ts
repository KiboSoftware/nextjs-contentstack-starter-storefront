/**
 * @module useDeleteCustomerAddressMutation
 */
import { useMutation, useQueryClient } from 'react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { deleteCustomerAccountContact } from '@/lib/gql/mutations'
import { customerAccountContactsKeys } from '@/lib/react-query/queryKeys'

import { CustomerContact } from '@/lib/gql/types'

interface DeleteCustomerAccountContactDetailsParams {
  accountId: number
  contactId: number
}

const deleteCustomerAccountContactDetails = async (
  params: DeleteCustomerAccountContactDetailsParams
) => {
  const client = makeGraphQLClient()

  const response = await client.request({
    document: deleteCustomerAccountContact,
    variables: params,
  })

  return response.deleteCustomerAccountContact
}

/**
 * [Mutation hook] useDeleteCustomerAddressMutation uses the graphQL mutation
 *
 * <b>deleteCustomerAccountContact(accountId: Int!, contactId: Int!): Boolean</b>
 *
 * Description : Delete the customer's contact (address) saved on their account
 *
 * Parameters passed to function deleteCustomerAccountContactDetails(params: DeleteCustomerAccountContactDetailsParams) => expects object of type DeleteCustomerAccountContactDetailsParams containing accountId and contactId.
 *
 * On success, calls invalidateQueries all customerAccountContactsKeys and fetches the updated result.
 *
 * @returns 'response?.deleteCustomerAccountContact', which contains True/False value to identify if customer's contact has been deleted or not.
 */

export const useDeleteCustomerAddressMutation = () => {
  const queryClient = useQueryClient()

  return {
    deleteSavedAddressDetails: useMutation(deleteCustomerAccountContactDetails, {
      onMutate: async (deletedAddress) => {
        await queryClient.cancelQueries(customerAccountContactsKeys.all)

        const previousAddresses: any = queryClient.getQueryData(
          customerAccountContactsKeys.addressById(deletedAddress.accountId)
        )

        const newAddresses = {
          ...previousAddresses,
          items: previousAddresses?.items?.filter(
            (item: CustomerContact) => item.id !== deletedAddress.contactId
          ),
        }
        queryClient.setQueryData(
          customerAccountContactsKeys.addressById(deletedAddress.accountId),
          newAddresses
        )

        return { previousAddresses }
      },
      onError: (_err, _newCart, context: any) => {
        queryClient.setQueryData(customerAccountContactsKeys.all, context?.previousCart)
      },
      onSettled: () => {
        queryClient.invalidateQueries(customerAccountContactsKeys.all)
      },
    }),
  }
}
