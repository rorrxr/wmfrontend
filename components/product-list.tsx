import React from "react"
import ProductCard from "./product-card"
import type { Product } from "@/types"

interface ProductListProps {
  products: Product[]
}

const ProductList: React.FC<ProductListProps> = React.memo(({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">상품이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
})

ProductList.displayName = "ProductList"

export default ProductList
