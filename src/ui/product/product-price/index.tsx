import { getProductPrice } from "@/lib/utils/prices"
import PreviewPrice from "@/ui/common/components/Card/PreviewPrice"
import { HttpTypes } from "@medusajs/types"


interface ProductPriceProps {
    product: HttpTypes.StoreProduct
    variant?: HttpTypes.StoreProductVariant
}

const ProductPrice = ({ product, variant }: ProductPriceProps) => {
    const { cheapestPrice, variantPrice } = getProductPrice({
        product,
        variantId: variant?.id,
    })

    const selectedPrice = variant ? variantPrice : cheapestPrice
    return (
        <PreviewPrice size="lg" price={selectedPrice} />
    )
}

export default ProductPrice