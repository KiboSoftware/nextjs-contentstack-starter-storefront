import { useEffect, useState } from 'react'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { onEntryChange } from '@/cms'
import { CmsComponent } from '@/cms/components'
import { getPage } from '@/cms/operations/get-page'
import { FullWidthLayout } from '@/components/layout'
import getCategoryTree from '@/lib/api/operations/get-category-tree'
import type { CategoryTreeResponse, NextPageWithLayout } from '@/lib/types'

import type { GetServerSidePropsContext } from 'next'

interface HomePageProps {
  cmsPage: any
}

const getCmsHomePageData = async () => {
  const cmsPage = await getPage({
    contentTypeUid: 'home_page',
    referenceFieldPath: [
      'page_components.hero_carousel.hero_carousel_items',
      'page_components.home_page_products.reference',
      'page_components.large_promo_blocks.large_promo_blocks',
      'page_components.small_promo_blocks.small_promo_blocks',
    ],
    entryUrl: '',
  })
  return cmsPage
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale } = context
  const categoriesTree: CategoryTreeResponse = await getCategoryTree()

  const cmsPage = await getCmsHomePageData()

  return {
    props: {
      categoriesTree,
      cmsPage,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}

const Home: NextPageWithLayout<HomePageProps> = (props) => {
  const { cmsPage } = props

  const [cmsPages, setCmsPage] = useState(cmsPage)
  const fetchData = async () => {
    try {
      const cmsPage = await getCmsHomePageData()
      setCmsPage(cmsPage)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    onEntryChange(() => {
      fetchData()
    })
  }, [])

  return (
    <>
      {cmsPages?.components?.map((data: any) => (
        <CmsComponent key={Object.keys(data)[0]} content={data} />
      ))}
    </>
  )
}

Home.getLayout = FullWidthLayout

export default Home
