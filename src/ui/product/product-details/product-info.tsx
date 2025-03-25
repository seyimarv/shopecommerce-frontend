import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
    product: HttpTypes.StoreProduct
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
    return (
        <div className="text-sm py-6">
            <div className="grid grid-cols-2 gap-x-8">
                <div className="flex flex-col gap-y-4">
                    <div>
                        <span className="font-semibold">Material</span>
                        <p>{product.material ? product.material : "-"}</p>
                    </div>
                    <div>
                        <span className="font-semibold">Type</span>
                        <p>{product.type ? product.type.value : "-"}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-y-4">
                    <div>
                        <span className="font-semibold">Weight</span>
                        <p>{product.weight ? `${product.weight} g` : "-"}</p>
                    </div>
                    <div>
                        <span className="font-semibold">Dimensions</span>
                        <p>
                            {product.length && product.width && product.height
                                ? `${product.length}L x ${product.width}W x ${product.height}H`
                                : "-"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductInfoTab