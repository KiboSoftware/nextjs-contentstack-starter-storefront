const getContentStackHomePageData = (contentStackPageData: any) =>
  contentStackPageData.map((obj: any) => {
    if (!('home_page_products' in obj)) return obj
    if ('home_page_products' in obj) {
      return {
        home_page_products: {
          reference: obj.home_page_products.reference.map((ref: any) => ({
            ...ref,
            home_page_products: ref.home_page_products.map((obj: any) => obj.productCode),
          })),
        },
      }
    }
  })
const formatContentStackProductDetailsData = (cmsProducts: any) => {
  return cmsProducts.map((products: any) => {
    if (products?.recommendations) {
      return {
        recommendations: {
          title: products?.recommendations?.title,
          product_recommendations: products?.recommendations?.product_recommendations?.map(
            (code: any) => code?.productCode
          ),
        },
      }
    } else {
      return {
        customers_also_bought: {
          title: products?.customers_also_bought?.title,
          customers_also_bought: products?.customers_also_bought?.customers_also_bought?.map(
            (code: any) => code?.productCode
          ),
        },
      }
    }
  })
}

const getContentStackProductDetailPageData = (amplienceProductData: any) =>
  formatContentStackProductDetailsData(amplienceProductData)

export const contentStackGetters = {
  getContentStackHomePageData,
  getContentStackProductDetailPageData,
}
