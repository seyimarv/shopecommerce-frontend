import { HttpTypes } from "@medusajs/types"
import { CartWithInventory } from "../data/cart"

export function getCheckoutStep(cart: CartWithInventory) {
    if (!cart?.shipping_address?.address_1 || !cart.email) {
      return "address"
    } else if (cart?.shipping_methods?.length === 0) {
      return "delivery"
    } else {
      return "payment"
    }
  }