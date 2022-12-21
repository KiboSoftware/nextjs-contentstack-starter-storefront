import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import getConfig from 'next/config'
import { useRouter } from 'next/router'

import { MySubscription } from '@/components/my-account'

import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { locale } = context
  const { publicRuntimeConfig } = getConfig()
  const isSubscriptionEnabled = publicRuntimeConfig.isSubscriptionEnabled

  if (!isSubscriptionEnabled) return { notFound: true }
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}
const SubscriptionPage: NextPage = () => {
  const router = useRouter()
  const handleAccountTitleClick = () => router.push('/my-account')
  return (
    <>
      <MySubscription onAccountTitleClick={handleAccountTitleClick} />
    </>
  )
}
export default SubscriptionPage
