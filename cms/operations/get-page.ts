import { contentStackGetters } from '../getters/contentStackGetters'
import Stack from '../index'

interface PageProps {
  contentTypeUid: string
  referenceFieldPath: Array<string>
  entryUrl: string
}

const getContentStackPage = async (params: PageProps) => {
  if (params.entryUrl) {
    const response = await Stack.getEntry(params)
    const a = contentStackGetters.getContentStackProductDetailPageData(
      response[0][0]?.page_components
    )
    return {
      components:
        contentStackGetters.getContentStackProductDetailPageData(response[0][0]?.page_components) ||
        [],
    }
  } else {
    const response = await Stack.getEntry(params)
    return {
      components:
        contentStackGetters.getContentStackHomePageData(response[0][0]?.page_components) || [],
    }
  }
}

export const getPage = async (params: PageProps) => {
  return getContentStackPage(params)
}
