import React, { useState, useEffect } from 'react'

import {
  Box,
  Divider,
  ListItem,
  Typography,
  Toolbar,
  styled,
  Link as MuiLink,
  Container,
  Tabs,
} from '@mui/material'
import { usePopupState, bindHover, bindPopover } from 'material-ui-popup-state/hooks'
import HoverPopover from 'material-ui-popup-state/HoverPopover'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

import { KiboImage } from '@/components/common'
import { MegaMenuItem } from '@/components/layout'
import { uiHelpers } from '@/lib/helpers'
import DefaultImage from '@/public/product_placeholder.svg'

import type { Maybe, PrCategory } from '@/lib/gql/types'

interface MegaMenuProps {
  categoryTree: Maybe<PrCategory>[]
  backgroundColor?: string
  onBackdropToggle: (isOpen: boolean) => void
}

interface MegaMenuCategoryProps {
  category: Maybe<PrCategory>
  activeCategory: string
  onBackdropToggle: (isOpen: boolean) => void
  setActiveCategory: (activeCategory: string) => void
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  '&.MuiToolbar-root': {
    backgroundColor: 'inherit',
    position: 'relative',
    minHeight: 55,
    display: 'flex',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: theme.palette.grey[300],
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: theme.palette.grey[300],
    paddingInline: 0,
    whiteSpace: 'nowrap',
    flex: 1,
    color: 'black',
    maxWidth: '90%',
  },
}))

const style = {
  listItem: {
    cursor: 'pointer',
    borderBottom: '4px solid transparent',
    pt: 1.5,
    pb: 1.5,
    '&.Mui-selected': {
      borderBottom: '4px solid',
      borderBottomColor: 'primary.main',
      background: 'transparent',
      '& .MuiTypography-root': {
        textShadow: '0.7px 0px',
      },
    },
  },
  popoverPaper: {
    width: '96.5vw',
    height: '25rem',
    borderRadius: 0,
    boxShadow: 'none',
    borderTop: '1px solid',
    borderTopColor: 'grey.300',
    position: 'relative',
    overflowY: 'scroll',
    marginTop: 0.5,
  },
}

const MegaMenuCategory = (props: MegaMenuCategoryProps) => {
  const { category, activeCategory, onBackdropToggle, setActiveCategory } = props
  const childrenCategories = category?.childrenCategories as PrCategory[]

  const { t } = useTranslation('common')

  const { getCategoryLink } = uiHelpers()
  const popupState = usePopupState({
    variant: 'popover',
    popupId: category?.content?.name,
  })

  const closeBackDrop = () => {
    popupState.close()
  }

  useEffect(() => {
    childrenCategories?.length && onBackdropToggle(popupState.isOpen)
  }, [childrenCategories?.length, popupState.isOpen, onBackdropToggle])

  return (
    <Box {...bindHover(popupState)} role="group" color="text.primary">
      <ListItem
        sx={{ ...style.listItem }}
        onMouseOver={() => setActiveCategory(category?.categoryCode || '')}
        selected={popupState.isOpen && category?.categoryCode === activeCategory}
      >
        <Link href={getCategoryLink(category?.categoryCode as string)} passHref>
          <MuiLink underline="none" color="text.primary">
            {category?.content?.name}
          </MuiLink>
        </Link>
      </ListItem>
      {childrenCategories?.length > 0 && (
        <HoverPopover
          {...bindPopover(popupState)}
          PaperProps={{ sx: { ...style.popoverPaper } }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box display="flex" py={2} aria-label="megamenu-back-drop">
            <Box display="flex" flex={3} flexWrap={'wrap'}>
              {childrenCategories?.map((cat) => {
                return (
                  <MegaMenuItem
                    key={cat?.categoryCode}
                    title={cat?.content?.name as string}
                    categoryChildren={cat?.childrenCategories as PrCategory[]}
                    categoryCode={cat?.categoryCode as string}
                    onBackDropClose={closeBackDrop}
                  />
                )
              })}
            </Box>
            <Divider orientation="vertical" sx={{ minHeight: '20rem', height: '20rem' }} />
            <Box flex={1} px={4}>
              <Box width={'100%'}>
                <Typography variant="subtitle2" pt={0.5} fontWeight="bold">
                  {t('advertisement')}
                </Typography>
                <KiboImage
                  src={DefaultImage}
                  alt={t('advertisement')}
                  width={'100%'}
                  height={'100%'}
                />
              </Box>
            </Box>
          </Box>
        </HoverPopover>
      )}
    </Box>
  )
}

const MegaMenu = (props: MegaMenuProps) => {
  const { categoryTree = [], backgroundColor, onBackdropToggle } = props

  const [activeCategory, setActiveCategory] = useState<string>('')

  return (
    <StyledToolbar data-testid="megamenu-container">
      {/* <Container maxWidth="xl" sx={{ display: 'flex', gap: 2 }}> */}
      <Tabs
        // value={value}
        // onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable auto tabs example"
      >
        {[
          ...categoryTree,
          {
            categoryCode: 'Bike001',
            categoryId: 1,
            updateDate: null,
            content: {
              name: 'Bikes',
            },
          },
          {
            categoryCode: 'Bike001',
            categoryId: 1,
            updateDate: null,
            content: {
              name: 'Hammers',
            },
          },
          {
            categoryCode: 'Bike001',
            categoryId: 1,
            updateDate: null,
            content: {
              name: 'Cameras',
            },
          },
          {
            categoryCode: 'Bike001',
            categoryId: 1,
            updateDate: null,
            content: {
              name: 'Cameras 2',
            },
          },
          {
            categoryCode: 'Bike001',
            categoryId: 1,
            updateDate: null,
            content: {
              name: 'Cameras 4',
            },
          },
        ]?.map((category) => (
          <MegaMenuCategory
            key={category?.categoryCode}
            category={category}
            onBackdropToggle={onBackdropToggle}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        ))}
      </Tabs>
      {/* </Container> */}
    </StyledToolbar>
  )
}
export default MegaMenu
