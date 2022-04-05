import CartItem from '../CartItem/CartItem'

import { CartItem as CartItemType } from '@/lib/gql/types'

interface CartItemListProps {
  cartItems: CartItemType[]
}

const CartItemList = (props: CartItemListProps) => {
  const { cartItems } = props

  return (
    <>
      {cartItems.map((item: CartItemType, index: number) => (
        <CartItem key={index} cartItem={item}></CartItem>
      ))}
    </>
  )
}

export default CartItemList
