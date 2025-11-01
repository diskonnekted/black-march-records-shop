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
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('USD')
  const [exchangeRate] = useState(15750) // 1 USD = 15,750 IDR

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
        filtered.sort((a, b) => convertPrice(a.price) - convertPrice(b.price))
        break
      case 'price-high':
        filtered.sort((a, b) => convertPrice(b.price) - convertPrice(a.price))
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

  const convertPrice = (price: number) => {
    if (currency === 'IDR') {
      return Math.round(price * exchangeRate)
    }
    return price
  }

  const formatPrice = (price: number) => {
    const convertedPrice = convertPrice(price)
    if (currency === 'IDR') {
      return `Rp ${convertedPrice.toLocaleString('id-ID')}`
    }
    return `$${convertedPrice.toFixed(2)}`
  }

  const orderViaWhatsApp = (product: Product) => {
    const message = encodeURIComponent(
      `Halo Blackmarch, saya ingin memesan:\n\n` +
      `📀 ${product.artist} - ${product.name}\n` +
      `💿 Format: ${product.format.toUpperCase()}\n` +
      `💰 Harga: ${formatPrice(product.price)}\n` +
      `🏷️ Genre: ${product.genre}${product.subgenre ? ` (${product.subgenre})` : ''}\n` +
      `${product.year ? `📅 Tahun: ${product.year}\n` : ''}` +
      `${product.label ? `🏢 Label: ${product.label}\n` : ''}` +
      `${product.limited ? '⚠️ Limited Edition\n' : ''}` +
      `${product.description ? `📝 Deskripsi: ${product.description}\n` : ''}\n\n` +
      `Mohon informasikan ketersediaan dan cara pemesanannya. Terima kasih!`
    )
    
    const whatsappUrl = `https://wa.me/6281328128315?text=${message}`
    window.open(whatsappUrl, '_blank')
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
              <Select value={currency} onValueChange={(value: 'USD' | 'IDR') => setCurrency(value)}>
                <SelectTrigger className="bg-white border-gray-300 text-black w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="USD">USD $</SelectItem>
                  <SelectItem value="IDR">IDR Rp</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                <a href="/admin">Admin</a>
              </Button>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">Vintage Records & Timeless Merchandise</p>
        </div>
      </header>

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
                  <span className="text-black font-bold text-lg">{formatPrice(product.price)}</span>
                  <Button 
                    onClick={() => orderViaWhatsApp(product)}
                    disabled={!product.inStock}
                    className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Order WA
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