import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as nextRouter from 'next/router'

import { categoryTreeDataMock } from '@/__mocks__/stories/categoryTreeDataMock'
import ProductDetailPage, { getStaticPaths, getStaticProps } from '@/pages/product/[productCode]'
import { cmsProductDetailMock } from '@/__mocks__/stories/cmsProductDetailMock'

nextRouter.useRouter = jest.fn()
const mockCategoryTreeData = categoryTreeDataMock
const mockProductDetailResult = {
  components: cmsProductDetailMock,
}

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    maxCookieAge: 10,
    contentstack: {
      apiKey: 'api_key',
      deliveryToken: 'delivery_token',
      environment: 'environment',
      managementToken: 'management_token',
      apiHost: 'api_host',
    },
  },
  serverRuntimeConfig: {
    revalidate: 60,
    pageSize: 100,
  },
}))

jest.mock('@/cms', () => ({
  onEntryChange: jest.fn(),
}))

jest.mock('@/lib/api/util', () => ({
  fetcher: jest.fn(() => {
    return Promise.resolve({
      data: {
        product: {
          productCode: 'mocked-product',
        },
        categoriesTree: { items: mockCategoryTreeData.categoriesTree?.items },
        cmsProductDetail: mockProductDetailResult,
        products: {
          items: [
            {
              productCode: 'mocked-productCode-1',
            },
            {
              productCode: 'mocked-productCode-2',
            },
          ],
        },
      },
    })
  }),
}))

jest.mock('next-i18next/serverSideTranslations', () => ({
  serverSideTranslations: jest.fn(() => {
    return Promise.resolve({
      _nextI18Next: {
        initialI18nStore: { 'mock-locale': [{}], en: [{}] },
        initialLocale: 'mock-locale',
        userConfig: { i18n: [{}] },
      },
    })
  }),
}))

jest.mock('next/config', () => {
  return () => ({
    publicRuntimeConfig: {
      maxCookieAge: 0,
      productListing: {
        sortOptions: [
          { value: 'Best Match', id: '' },
          { value: 'Price: Low to High', id: 'price asc' },
          { value: 'Price: High to Low', id: 'price desc' },
          { value: 'Latest', id: 'createDate desc' },
          { value: 'Oldest', id: 'createDate asc' },
        ],
        pageSize: 16,
      },
    },
    serverRuntimeConfig: {
      revalidate: 60,
      pageSize: 100,
      cacheKey: 'categoryTree',
      cacheTimeOut: 10000,
    },
  })
})

const ProductDetailTemplateMock = () => <div data-testid="productDetailTemplate-mock" />
jest.mock(
  '@/components/page-templates/ProductDetail/ProductDetailTemplate.tsx',
  () => () => ProductDetailTemplateMock()
)
const ProductDetailSkeletonMock = () => <div data-testid="productDetailSkeleton-mock" />
jest.mock(
  '@/components/page-templates/ProductDetail/ProductDetailSkeleton.tsx',
  () => () => ProductDetailSkeletonMock()
)

describe('[page] Product Details Page', () => {
  it('should run getStaticProps method', () => {
    const context = {
      params: {
        productCode: 'MS-BTL-001',
      },
      locale: 'mock-locale',
    }

    const response = getStaticProps(context)
    expect(response).resolves.toStrictEqual({
      props: {
        productCode: 'MS-BTL-001',
        product: {
          productCode: 'mocked-product',
        },
        categoriesTree: mockCategoryTreeData.categoriesTree.items,
        cmsProductDetail: mockProductDetailResult,
        _nextI18Next: {
          initialI18nStore: { 'mock-locale': [{}], en: [{}] },
          initialLocale: 'mock-locale',
          userConfig: { i18n: [{}] },
        },
      },
      revalidate: 60,
    })
  })

  it('should run getStaticPaths method', () => {
    const response = getStaticPaths()
    expect(response).resolves.toStrictEqual({
      paths: [`/product/mocked-productCode-1`, `/product/mocked-productCode-2`],
      fallback: true,
    })
  })

  it('should render the ProductDetail page template if isFallback is false', () => {
    nextRouter.useRouter.mockImplementation(() => ({ isFallback: false }))
    render(<ProductDetailPage />)

    const productDetailTemplate = screen.getByTestId('productDetailTemplate-mock')
    expect(productDetailTemplate).toBeVisible()
  })

  it('should render the Fallback page if isFallback is true', () => {
    nextRouter.useRouter.mockImplementation(() => ({ isFallback: true }))
    render(<ProductDetailPage />)

    expect(screen.getByTestId(/productDetailSkeleton-mock/)).toBeVisible()
  })
})
