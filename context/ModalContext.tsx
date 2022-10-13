import { createContext, ReactNode, useContext, useState } from 'react'

interface ModalContextType {
  Component: any
  props?: any
  showModal: (showModalProps: ModalStateType) => void
  closeModal: () => void
}

interface ModalStateType {
  Component: any
  props?: any
}

interface ModalContextProviderProps {
  children: ReactNode
}

const ModalContext = createContext({
  Component: null,
  props: {},
} as ModalContextType)

ModalContext.displayName = 'ModalContext'

export const ModalContextProvider = ({ children }: ModalContextProviderProps) => {
  const [modalState, setModalState] = useState<ModalStateType>({
    Component: null,
    props: {},
  })

  const showModal = (showModalProps: ModalStateType) => {
    setModalState({
      ...showModalProps,
    })
  }

  const closeModal = () => {
    setModalState({
      Component: modalState?.props?.NestedDialog || null,
      props: {
        ...modalState.props,
        isNested: false,
        NestedDialog: null,
      },
    })
  }

  const values = {
    ...modalState,
    showModal,
    closeModal,
  }
  return <ModalContext.Provider value={values}>{children}</ModalContext.Provider>
}

export const useModalContext = () => {
  const context = useContext(ModalContext)
  if (context === undefined) throw new Error('useContext must be inside a Provider with a value')
  return context
}

export const DialogRoot = () => {
  const { Component, props, closeModal } = useModalContext()
  const { isNested, NestedDialog, nestedDialogProps } = props
  if (Component) {
    if (isNested) {
      return (
        <>
          <NestedDialog {...nestedDialogProps} closeModal={closeModal} />
          {Component && <Component {...props} closeModal={closeModal} />}
        </>
      )
    }
    return <Component {...props} closeModal={closeModal} />
  }
  return null
}
