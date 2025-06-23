"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { getProducts } from "@/lib/api"
import ProductList from "@/components/product-list"
import CategoryList from "@/components/category-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/types"

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [category, setCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getProducts(currentPage, 12, searchTerm, category)
      setProducts(response)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, category, searchTerm])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(0)
    fetchProducts()
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 px-8 py-16 text-white">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">찜콩 Store에 오신 것을 환영합니다</h1>
          <p className="mt-6 text-lg leading-8 text-purple-100">
            최고의 상품을 합리적인 가격에 만나보세요. 다양한 카테고리의 상품들이 여러분을 기다리고 있습니다.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-blue-600/90" />
        <div className="absolute -top-4 -right-4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="space-y-6">
            <CategoryList onSelectCategory={setCategory} selectedCategory={category} />

            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="상품 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    검색
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-square bg-muted animate-pulse" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <ProductList products={products} />
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 text-sm">페이지 {currentPage + 1}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={products.length < 12}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home
