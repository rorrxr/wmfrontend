"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart()

  const total = cart.reduce((sum, item) => {
    const itemPrice = item.sale > 0 ? item.price * (1 - item.sale / 100) : item.price
    return sum + itemPrice * item.quantity
  }, 0)

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(itemId, newQuantity)
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">장바구니가 비어있습니다</h2>
        <p className="text-muted-foreground">상품을 담아보세요!</p>
        <Button asChild>
          <Link href="/">쇼핑 계속하기</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-2">
        <ShoppingBag className="h-6 w-6" />
        <h1 className="text-3xl font-bold">장바구니</h1>
        <span className="text-muted-foreground">({cart.length}개 상품)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const itemPrice = item.sale > 0 ? item.price * (1 - item.sale / 100) : item.price

            return (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg?height=80&width=80"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary">{itemPrice.toLocaleString()}원</span>
                        {item.sale > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            {item.price.toLocaleString()}원
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cart.map((item) => {
                  const itemPrice = item.sale > 0 ? item.price * (1 - item.sale / 100) : item.price

                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>{(itemPrice * item.quantity).toLocaleString()}원</span>
                    </div>
                  )
                })}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>총 금액</span>
                <span className="text-primary">{total.toLocaleString()}원</span>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">주문하기</Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/">쇼핑 계속하기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Cart
