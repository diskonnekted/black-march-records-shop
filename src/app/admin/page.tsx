'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skull, Plus, Edit, Trash2, Save, X, Package, Music, Shirt } from 'lucide-react'

interface Product {
  id: string
  name: string
  artist: string
  format: string
  genre: string
  subgenre?: string
  price: number
  image?: string
  description?: string
  inStock: boolean
  year?: number
  label?: string
  limited: boolean
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  type: string
  description?: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('USD')
  const [exchangeRate] = useState(15750) // 1 USD = 15,750 IDR
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    format: '',
    genre: '',
    subgenre: '',
    price: '',
    image: '',
    description: '',
    inStock: true,
    year: '',
    label: '',
    limited: false
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        year: formData.year ? parseInt(formData.year) : undefined
      }

      let response
      if (isCreating) {
        response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else if (editingProduct) {
        response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (!response.ok) {
        throw new Error('Failed to save product')
      }

      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' })
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      artist: '',
      format: '',
      genre: '',
      subgenre: '',
      price: '',
      image: '',
      description: '',
      inStock: true,
      year: '',
      label: '',
      limited: false
    })
    setEditingProduct(null)
    setIsCreating(false)
    setActiveTab('products')
  }

  const startEdit = (product: Product) => {
    setFormData({
      name: product.name,
      artist: product.artist,
      format: product.format,
      genre: product.genre,
      subgenre: product.subgenre || '',
      price: product.price.toString(),
      image: product.image || '',
      description: product.description || '',
      inStock: product.inStock,
      year: product.year?.toString() || '',
      label: product.label || '',
      limited: product.limited
    })
    setEditingProduct(product)
    setIsCreating(false)
    setActiveTab('add')
  }

  const startCreate = () => {
    resetForm()
    setIsCreating(true)
    setActiveTab('add')
  }

  const getFormatIcon = (format: string) => {
    switch(format.toLowerCase()) {
      case 'vinyl':
      case 'cd':
      case 'cassette':
        return <Music className="w-4 h-4" />
      case 'shirt':
      case 'patch':
      case 'accessory':
        return <Shirt className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getFormatColor = (format: string) => {
    switch(format.toLowerCase()) {
      case 'vinyl': return 'bg-black text-white'
      case 'cd': return 'bg-gray-800 text-white'
      case 'cassette': return 'bg-gray-700 text-white'
      case 'shirt': return 'bg-gray-600 text-white'
      case 'patch': return 'bg-gray-500 text-white'
      case 'accessory': return 'bg-gray-400 text-white'
      default: return 'bg-gray-300 text-black'
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <Skull className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-600">Loading the collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b border-gray-300 bg-gradient-to-b from-gray-100 to-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logo-blackmarch.png" alt="Blackmarch" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-black">BLACKMARCH ADMIN</h1>
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
              <Button 
                variant="outline" 
                className="border-black text-black hover:bg-black hover:text-white"
                onClick={() => window.location.href = '/'}
              >
                Back to Store
              </Button>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">Manage the Collection - Product Administration</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-200 border-gray-300">
            <TabsTrigger value="products" className="data-[state=active]:bg-black data-[state=active]:text-white">
              Products
            </TabsTrigger>
            <TabsTrigger value="add" className="data-[state=active]:bg-black data-[state=active]:text-white">
              Add Product
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Product Management</h2>
              <div className="flex items-center gap-4">
                <Button 
                  onClick={startCreate}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
                <div className="text-sm text-gray-600">
                  Total Products: {products.length}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id} className="bg-white border border-gray-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getFormatColor(product.format)} text-xs`}>
                            <span className="flex items-center gap-1">
                              {getFormatIcon(product.format)}
                              {product.format}
                            </span>
                          </Badge>
                          {product.limited && (
                            <Badge variant="destructive" className="text-xs bg-black text-white">LIMITED</Badge>
                          )}
                          {!product.inStock && (
                            <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-800">OUT OF STOCK</Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-black">{product.artist}</h3>
                        <p className="text-gray-700 font-medium">{product.name}</p>
                        <p className="text-gray-600 text-sm mt-1">
                          {product.genre} • {product.subgenre}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Price: {formatPrice(product.price)}</span>
                          {product.year && <span>Year: {product.year}</span>}
                          {product.label && <span>Label: {product.label}</span>}
                        </div>
                        {product.description && (
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-black text-black hover:bg-black hover:text-white"
                          onClick={() => startEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-black text-black hover:bg-black hover:text-white"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <Card className="bg-white border border-gray-300">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  {isCreating ? <Plus className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                  {isCreating ? 'Add New Product' : 'Edit Product'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="artist">Artist/Band</Label>
                      <Input
                        id="artist"
                        value={formData.artist}
                        onChange={(e) => setFormData({...formData, artist: e.target.value})}
                        className="bg-white border-gray-300 text-black"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Album/Product Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-white border-gray-300 text-black"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="format">Format</Label>
                      <Select value={formData.format} onValueChange={(value) => setFormData({...formData, format: value})}>
                        <SelectTrigger className="bg-white border-gray-300 text-black">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="VINYL">Vinyl</SelectItem>
                          <SelectItem value="CD">CD</SelectItem>
                          <SelectItem value="CASSETTE">Cassette</SelectItem>
                          <SelectItem value="SHIRT">Shirt</SelectItem>
                          <SelectItem value="PATCH">Patch</SelectItem>
                          <SelectItem value="ACCESSORY">Accessory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="genre">Genre</Label>
                      <Input
                        id="genre"
                        value={formData.genre}
                        onChange={(e) => setFormData({...formData, genre: e.target.value})}
                        className="bg-white border-gray-300 text-black"
                        placeholder="Black Metal"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="subgenre">Subgenre</Label>
                      <Input
                        id="subgenre"
                        value={formData.subgenre}
                        onChange={(e) => setFormData({...formData, subgenre: e.target.value})}
                        className="bg-white border-gray-300 text-black"
                        placeholder="Raw Black Metal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="bg-white border-gray-300 text-black"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="bg-white border-gray-300 text-black"
                      />
                    </div>
                    <div>
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        value={formData.label}
                        onChange={(e) => setFormData({...formData, label: e.target.value})}
                        className="bg-white border-gray-300 text-black"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="bg-white border-gray-300 text-black"
                      placeholder="/covers/album-name.jpg"
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <img 
                          src={formData.image} 
                          alt="Product preview" 
                          className="w-32 h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/covers/default-album.jpg'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="bg-white border-gray-300 text-black"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="inStock"
                        checked={formData.inStock}
                        onCheckedChange={(checked) => setFormData({...formData, inStock: checked})}
                      />
                      <Label htmlFor="inStock">In Stock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="limited"
                        checked={formData.limited}
                        onCheckedChange={(checked) => setFormData({...formData, limited: checked})}
                      />
                      <Label htmlFor="limited">Limited Edition</Label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="submit" 
                      className="bg-red-900 hover:bg-red-800 text-white"
                      disabled={saving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : (isCreating ? 'Create Product' : 'Update Product')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-300 text-black hover:bg-black hover:text-white"
                      onClick={resetForm}
                      disabled={saving}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}