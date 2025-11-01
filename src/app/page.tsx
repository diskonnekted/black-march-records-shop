'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Search, Filter, Skull, Music, Shirt } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Product {
  id: string
  name: string
  artist: string
  format: 'vinyl' | 'cd' | 'cassette' | 'shirt' | 'patch' | 'accessory'
  genre: string
  subgenre: string
  price: number
  image: string
  description: string
  inStock: boolean
  year?: number
  label?: string
  limited?: boolean
}

export default function BlackMetalRecordStore() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFormat, setSelectedFormat] = useState<string>('all')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [cart, setCart] = useState<Product[]>([])
  const [showCart, setShowCart] = useState(false)
  const [sortBy, setSortBy] = useState<string>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products || [])
      setFilteredProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to sample data if API fails
      const sampleProducts: Product[] = [
        {
          id: '1',
          name: 'Transilvanian Hunger',
          artist: 'Darkthrone',
          format: 'vinyl',
          genre: 'Black Metal',
          subgenre: 'Raw Black Metal',
          price: 45.00,
          image: '/api/placeholder/300/300',
          description: 'Kult album dari pionir black metal Norwegia',
          inStock: true,
          year: 1994,
          label: 'Peaceville Records',
          limited: true
        },
        {
          id: '2',
          name: 'De Mysteriis Dom Sathanas',
          artist: 'Mayhem',
          format: 'cd',
          genre: 'Black Metal',
          subgenre: 'Norwegian Black Metal',
          price: 25.00,
          image: '/api/placeholder/300/300',
          description: 'Album legendaris yang mengubah sejarah black metal',
          inStock: true,
          year: 1994,
          label: 'Deathlike Silence'
        },
        {
          id: '3',
          name: 'Filosofem',
          artist: 'Burzum',
          format: 'cassette',
          genre: 'Black Metal',
          subgenre: 'Ambient Black Metal',
          price: 15.00,
          image: '/api/placeholder/300/300',
          description: 'Masterpiece ambient black metal',
          inStock: true,
          year: 1996,
          limited: true
        },
        {
          id: '4',
          name: 'In the Nightside Eclipse',
          artist: 'Emperor',
          format: 'vinyl',
          genre: 'Black Metal',
          subgenre: 'Symphonic Black Metal',
          price: 50.00,
          image: '/api/placeholder/300/300',
          description: 'Symphonic black metal yang epik',
          inStock: false,
          year: 1994,
          label: 'Candlelight Records'
        },
        {
          id: '5',
          name: 'Black Metal Logo Shirt',
          artist: 'Various',
          format: 'shirt',
          genre: 'Merchandise',
          subgenre: 'Clothing',
          price: 30.00,
          image: '/api/placeholder/300/300',
          description: 'Kaos dengan logo band black metal klasik',
          inStock: true
        },
        {
          id: '6',
          name: 'Bathory Patch',
          artist: 'Bathory',
          format: 'patch',
          genre: 'Merchandise',
          subgenre: 'Accessories',
          price: 8.00,
          image: '/api/placeholder/300/300',
          description: 'Patch emblem Bathory untuk jaket kulit',
          inStock: true
        }
      ]
      setProducts(sampleProducts)
      setFilteredProducts(sampleProducts)
    }
  }

  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.subgenre && product.subgenre.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedFormat !== 'all') {
      filtered = filtered.filter(product => product.format === selectedFormat)
    }

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(product => 
        product.genre === selectedGenre || product.subgenre === selectedGenre
      )
    }

    // Sorting
    switch(sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'artist-asc':
        filtered.sort((a, b) => a.artist.localeCompare(b.artist))
        break
      case 'newest':
      default:
        filtered.sort((a, b) => b.id.localeCompare(a.id))
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, selectedFormat, selectedGenre, sortBy, products])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const addToCart = (product: Product) => {
    setCart([...cart, product])
  }

  const getProductImage = (product: Product) => {
    if (product.image && product.image !== '/api/placeholder/300/300') {
      return product.image
    }
    return '/covers/default-album.jpg'
  }

  const getFormatIcon = (format: string) => {
    switch(format) {
      case 'vinyl':
      case 'cd':
      case 'cassette':
        return <Music className="w-4 h-4" />
      case 'shirt':
      case 'patch':
      case 'accessory':
        return <Shirt className="w-4 h-4" />
      default:
        return <Skull className="w-4 h-4" />
    }
  }

  const getFormatColor = (format: string) => {
    switch(format) {
      case 'vinyl': return 'bg-black text-white'
      case 'cd': return 'bg-gray-800 text-white'
      case 'cassette': return 'bg-gray-700 text-white'
      case 'shirt': return 'bg-gray-600 text-white'
      case 'patch': return 'bg-gray-500 text-white'
      case 'accessory': return 'bg-gray-400 text-white'
      default: return 'bg-gray-300 text-black'
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b border-gray-300 bg-gradient-to-b from-gray-100 to-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logo-blackmarch.png" alt="Blackmarch" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-black">BLACKMARCH</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-black text-black hover:bg-black hover:text-white"
                onClick={() => setShowCart(!showCart)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart ({cart.length})
              </Button>
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                <a href="/admin">Admin</a>
              </Button>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">Vintage Records & Timeless Merchandise</p>
        </div>
      </header>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-300 z-50 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-black">CART</h3>
            <Button variant="ghost" onClick={() => setShowCart(false)} className="text-gray-600">
              ×
            </Button>
          </div>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <div className="space-y-2">
              {cart.map((item, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded text-sm">
                  <p className="font-semibold">{item.artist} - {item.name}</p>
                  <p className="text-black">${item.price.toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t border-gray-300 pt-2 mt-4">
                <p className="text-lg font-bold text-black">
                  Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </p>
                <Button className="w-full mt-2 bg-black hover:bg-gray-800 text-white">
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url(/hero-retro.jpg)' }}>
        <div className="absolute inset-0 bg-white bg-opacity-80"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-black mb-4">TIMELESS COLLECTIONS</h2>
            <p className="text-xl text-gray-700 mb-8">Vintage Vinyl & Classic Merchandise Since 1964</p>
            <div className="flex justify-center space-x-4">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                Browse Collection
              </Button>
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white px-8 py-3">
                New Arrivals
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                placeholder="Search our collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 text-black placeholder-gray-500"
              />
            </div>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger className="bg-white border-gray-300 text-black">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="vinyl">Vinyl</SelectItem>
                <SelectItem value="cd">CD</SelectItem>
                <SelectItem value="cassette">Cassette</SelectItem>
                <SelectItem value="shirt">Shirts</SelectItem>
                <SelectItem value="patch">Patches</SelectItem>
                <SelectItem value="accessory">Accessories</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="bg-white border-gray-300 text-black">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="Black Metal">Black Metal</SelectItem>
                <SelectItem value="Raw Black Metal">Raw Black Metal</SelectItem>
                <SelectItem value="Symphonic Black Metal">Symphonic Black Metal</SelectItem>
                <SelectItem value="Ambient Black Metal">Ambient Black Metal</SelectItem>
                <SelectItem value="Norwegian Black Metal">Norwegian Black Metal</SelectItem>
                <SelectItem value="Swedish Black Metal">Swedish Black Metal</SelectItem>
                <SelectItem value="Folk Black Metal">Folk Black Metal</SelectItem>
                <SelectItem value="Depressive Black Metal">Depressive Black Metal</SelectItem>
                <SelectItem value="Blackened Death Metal">Blackened Death Metal</SelectItem>
                <SelectItem value="Viking Metal">Viking Metal</SelectItem>
                <SelectItem value="Pagan Metal">Pagan Metal</SelectItem>
                <SelectItem value="Merchandise">Merchandise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white border-gray-300 text-black">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="artist-asc">Artist: A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Results count */}
          <div className="text-sm text-gray-600">
            Found {filteredProducts.length} products in our collection
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <Card key={product.id} className="bg-white border border-gray-300 hover:border-black transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge className={`${getFormatColor(product.format)} text-xs`}>
                    <span className="flex items-center gap-1">
                      {getFormatIcon(product.format)}
                      {product.format.toUpperCase()}
                    </span>
                  </Badge>
                  {product.limited && (
                    <Badge variant="destructive" className="text-xs bg-black text-white">LIMITED</Badge>
                  )}
                </div>
                <CardTitle className="text-black text-lg">{product.artist}</CardTitle>
                <p className="text-gray-700 text-sm font-medium">{product.name}</p>
                {product.year && (
                  <p className="text-gray-600 text-xs">{product.year} • {product.label}</p>
                )}
              </CardHeader>
              <CardContent className="pb-2">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img 
                    src={getProductImage(product)} 
                    alt={`${product.artist} - ${product.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/covers/default-album.jpg'
                    }}
                  />
                </div>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-800">
                    {product.genre}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-800">
                    {product.subgenre}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex justify-between items-center w-full">
                  <span className="text-black font-bold text-lg">${product.price.toFixed(2)}</span>
                  <Button 
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {paginatedProducts.length === 0 && (
          <div className="text-center py-12">
            <Skull className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">No products found in our collection</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              className="border-gray-300 text-black hover:bg-black hover:text-white"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  className={currentPage === page 
                    ? "bg-black hover:bg-gray-800 text-white" 
                    : "border-gray-300 text-black hover:bg-black hover:text-white"
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              className="border-gray-300 text-black hover:bg-black hover:text-white"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">© 2024 Blackmarch - Vintage Record Store</p>
            <p className="text-xs">Curating Timeless Music Since 1964</p>
          </div>
        </div>
      </footer>
    </div>
  )
}