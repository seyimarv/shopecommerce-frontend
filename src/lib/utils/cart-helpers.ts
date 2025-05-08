import { HttpTypes } from "@medusajs/types";
import toast from 'react-hot-toast';

const isMaxQuantityInCart = (variant: HttpTypes.StoreProductVariant, cart: HttpTypes.StoreCart) => {
    if (!variant.manage_inventory) {
        return false;
    }
    const variantId = variant.id;
    const inventoryQuantity = variant.inventory_quantity ?? 0;
    const cartItem = cart.items?.find(item => item.variant_id === variantId);
    const quantityInCart = cartItem?.quantity ?? 0;
    if (inventoryQuantity <= quantityInCart) {
        toast.error("Maximum available quantity already in cart.");
        return true;
    }
    return false;
};

export default isMaxQuantityInCart;