export interface User {
  id: string
  email: string
  username: string
  name: string
  phone: string
  role: "USER" | "ADMIN"
}

export interface Product {
  id: string
  productId: string
  name: string
  price: number
  sale: number
  content: string
  count: number
  image: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  parentCategory?: Category
}

export interface CartItem extends Product {
  quantity: number
}

export interface AuthContextType {
  user: User | null
  loginUser: (email: string, password: string) => Promise<void>
  logoutUser: () => Promise<void>
  loading: boolean
}

export interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export interface OrderData {
  items: Array<{
    productId: string
    quantity: number
  }>
  shippingInfo: ShippingInfo
  total: number
}

export interface ShippingInfo {
  name: string
  address: string
  city: string
  postalCode: string
  country: string
}
