import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Record Format Categories
  const recordFormats = [
    { name: 'Vinyl', type: 'RECORD_FORMAT', description: 'Black vinyl records' },
    { name: 'CD', type: 'RECORD_FORMAT', description: 'Compact discs' },
    { name: 'Cassette', type: 'RECORD_FORMAT', description: 'Tape cassettes' },
    { name: 'Shirt', type: 'RECORD_FORMAT', description: 'Band t-shirts' },
    { name: 'Patch', type: 'RECORD_FORMAT', description: 'Embroidered patches' },
    { name: 'Accessory', type: 'RECORD_FORMAT', description: 'Other merchandise' }
  ]

  // Black Metal Genre Categories
  const blackMetalGenres = [
    { name: 'Black Metal', type: 'MUSIC_GENRE', description: 'Traditional black metal' },
    { name: 'Raw Black Metal', type: 'MUSIC_GENRE', description: 'Lo-fi black metal' },
    { name: 'Symphonic Black Metal', type: 'MUSIC_GENRE', description: 'Orchestral black metal' },
    { name: 'Ambient Black Metal', type: 'MUSIC_GENRE', description: 'Atmospheric black metal' },
    { name: 'Norwegian Black Metal', type: 'MUSIC_GENRE', description: 'Norwegian style black metal' },
    { name: 'Swedish Black Metal', type: 'MUSIC_GENRE', description: 'Swedish style black metal' },
    { name: 'Folk Black Metal', type: 'MUSIC_GENRE', description: 'Folk influenced black metal' },
    { name: 'Depressive Black Metal', type: 'MUSIC_GENRE', description: 'DSBM - depressive suicidal black metal' },
    { name: 'National Socialist Black Metal', type: 'MUSIC_GENRE', description: 'NSBM genre' },
    { name: 'Blackened Death Metal', type: 'MUSIC_GENRE', description: 'Black metal mixed with death metal' },
    { name: 'Viking Metal', type: 'MUSIC_GENRE', description: 'Norse mythology themed metal' },
    { name: 'Pagan Metal', type: 'MUSIC_GENRE', description: 'Pagan themed metal' },
    { name: 'Merchandise', type: 'MUSIC_GENRE', description: 'Band merchandise' }
  ]

  // Insert categories
  for (const format of recordFormats) {
    await prisma.category.upsert({
      where: { name: format.name },
      update: format,
      create: format
    })
  }

  for (const genre of blackMetalGenres) {
    await prisma.category.upsert({
      where: { name: genre.name },
      update: genre,
      create: genre
    })
  }

  // Sample Products
  const sampleProducts = [
    {
      name: 'Transilvanian Hunger',
      artist: 'Darkthrone',
      format: 'VINYL',
      genre: 'Black Metal',
      subgenre: 'Raw Black Metal',
      price: 45.00,
      description: 'Kult album dari pionir black metal Norwegia',
      inStock: true,
      year: 1994,
      label: 'Peaceville Records',
      limited: true
    },
    {
      name: 'De Mysteriis Dom Sathanas',
      artist: 'Mayhem',
      format: 'CD',
      genre: 'Black Metal',
      subgenre: 'Norwegian Black Metal',
      price: 25.00,
      description: 'Album legendaris yang mengubah sejarah black metal',
      inStock: true,
      year: 1994,
      label: 'Deathlike Silence'
    },
    {
      name: 'Filosofem',
      artist: 'Burzum',
      format: 'CASSETTE',
      genre: 'Black Metal',
      subgenre: 'Ambient Black Metal',
      price: 15.00,
      description: 'Masterpiece ambient black metal',
      inStock: true,
      year: 1996,
      limited: true
    },
    {
      name: 'In the Nightside Eclipse',
      artist: 'Emperor',
      format: 'VINYL',
      genre: 'Black Metal',
      subgenre: 'Symphonic Black Metal',
      price: 50.00,
      description: 'Symphonic black metal yang epik',
      inStock: false,
      year: 1994,
      label: 'Candlelight Records'
    },
    {
      name: 'Black Metal Logo Shirt',
      artist: 'Various',
      format: 'SHIRT',
      genre: 'Merchandise',
      subgenre: 'Clothing',
      price: 30.00,
      description: 'Kaos dengan logo band black metal klasik',
      inStock: true
    },
    {
      name: 'Bathory Patch',
      artist: 'Bathory',
      format: 'PATCH',
      genre: 'Merchandise',
      subgenre: 'Accessories',
      price: 8.00,
      description: 'Patch emblem Bathory untuk jaket kulit',
      inStock: true
    }
  ]

  // Insert sample products
  for (const product of sampleProducts) {
    await prisma.product.create({
      data: product
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })