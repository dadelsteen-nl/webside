/** Window event used to open the cart drawer from anywhere (e.g. after add-to-cart). */
export const OPEN_CART_EVENT = 'dadelsteen:open-cart'

export const openCart = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(OPEN_CART_EVENT))
}
