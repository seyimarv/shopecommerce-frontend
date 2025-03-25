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
        <div className="flex items-center gap-2">
            <PreviewPrice size="lg" price={selectedPrice} />
            {selectedPrice?.price_type === "sale" && (
                <span className="bg-red-100 text-red-600 px-2 py-1 ml-1 text-xs rounded">
                    SALE
                </span>
            )}
        </div>
    )
}

export default ProductPrice