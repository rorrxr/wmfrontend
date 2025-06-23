"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/types"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
  }

  const discountedPrice = product.sale > 0 ? product.price * (1 - product.sale / 100) : product.price

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/product/${product.productId}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.sale > 0 && <Badge className="absolute top-2 left-2 bg-red-500">{product.sale}% OFF</Badge>}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/product/${product.productId}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center space-x-2 mb-2">
          <span className="text-2xl font-bold text-primary">{discountedPrice.toLocaleString()}원</span>
          {product.sale > 0 && (
            <span className="text-sm text-muted-foreground line-through">{product.price.toLocaleString()}원</span>
          )}
        </div>

        <p className="text-sm text-muted-foreground">재고: {product.count}개</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full" disabled={product.count === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          장바구니 담기
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
