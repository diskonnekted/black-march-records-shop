import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMoreProducts() {
  const additionalProducts = [
    {
      name: 'Under a Funeral Moon',
      artist: 'Darkthrone',
      format: 'VINYL',
      genre: 'Black Metal',
      subgenre: 'Raw Black Metal',
      price: 48.00,
      description: 'Raw and cold Norwegian black metal masterpiece',
      inStock: true,
      year: 1993,
      label: 'Peaceville Records',
      limited: true
    },
    {
      name: 'Anthems to the Welkin at Dusk',
      artist: 'Emperor',
      format: 'CD',
      genre: 'Black Metal',
      subgenre: 'Symphonic Black Metal',
      price: 22.00,
      description: 'Epic symphonic black metal from Norway',
      inStock: true,
      year: 1997,
      label: 'Candlelight Records'
    },
    {
      name: 'Hvis Lyset Tar Oss',
      artist: 'Burzum',
      format: 'CASSETTE',
      genre: 'Black Metal',
      subgenre: 'Ambient Black Metal',
      price: 18.00,
      description: 'Atmospheric black metal journey',
      inStock: true,
      year: 1994,
      limited: true
    },
    {
      name: 'Deathcrush',
      artist: 'Mayhem',
      format: 'VINYL',
      genre: 'Black Metal',
      subgenre: 'Norwegian Black Metal',
      price: 55.00,
      description: 'Brutal early Mayhem EP',
      inStock: false,
      year: 1987,
      label: 'Posercorpse',
      limited: true
    },
    {
      name: 'Bergtatt',
      artist: 'Ulver',
      format: 'CD',
      genre: 'Black Metal',
      subgenre: 'Folk Black Metal',
      price: 20.00,
      description: 'Norwegian folk-influenced black metal',
      inStock: true,
      year: 1995,
      label: 'Head Not Found'
    },
    {
      name: 'Stormblåst',
      artist: 'Dimmu Borgir',
      format: 'VINYL',
      genre: 'Black Metal',
      subgenre: 'Symphonic Black Metal',
      price: 42.00,
      description: 'Classic Norwegian symphonic black metal',
      inStock: true,
      year: 1996,
      label: 'Cacophonous Records'
    },
    {
      name: 'In the Nightside Eclipse',
      artist: 'Emperor',
      format: 'SHIRT',
      genre: 'Merchandise',
      subgenre: 'Clothing',
      price: 35.00,
      description: 'Emperor album artwork t-shirt',
      inStock: true
    },
    {
      name: 'Mayhem Logo Patch',
      artist: 'Mayhem',
      format: 'PATCH',
      genre: 'Merchandise',
      subgenre: 'Accessories',
      price: 10.00,
      description: 'Woven Mayhem logo patch',
      inStock: true
    },
    {
      name: 'Filosofem',
      artist: 'Burzum',
      format: 'VINYL',
      genre: 'Black Metal',
      subgenre: 'Ambient Black Metal',
      price: 52.00,
      description: 'Minimalist ambient black metal masterpiece',
      inStock: true,
      year: 1996,
      label: 'Misanthropy Records',
      limited: true
    },
    {
      name: 'De Mysteriis Dom Sathanas',
      artist: 'Mayhem',
      format: 'SHIRT',
      genre: 'Merchandise',
      subgenre: 'Clothing',
      price: 32.00,
      description: 'Classic Mayhem album cover shirt',
      inStock: true
    },
    {
      name: 'Nattens Madrigal',
      artist: 'Ulver',
      format: 'CASSETTE',
      genre: 'Black Metal',
      subgenre: 'Raw Black Metal',
      price: 16.00,
      description: 'Ulver\'s rawest black metal album',
      inStock: true,
      year: 1997,
      label: 'Century Media'
    },
    {
      name: 'Dark Medieval Times',
      artist: 'Satyricon',
      format: 'CD',
      genre: 'Black Metal',
      subgenre: 'Folk Black Metal',
      price: 19.00,
      description: 'Medieval-themed Norwegian black metal',
      inStock: true,
      year: 1994,
      label: 'Moonfog Productions'
    }
  ]

  for (const product of additionalProducts) {
    await prisma.product.create({
      data: product
    })
  }

  console.log('Additional products added successfully!')
}

addMoreProducts()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })