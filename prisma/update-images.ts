import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateProductImages() {
  const imageUpdates = [
    { name: 'Transilvanian Hunger', image: '/covers/darkthrone-transilvanian.jpg' },
    { name: 'De Mysteriis Dom Sathanas', image: '/covers/mayhem-de-mysteriis.jpg' },
    { name: 'Filosofem', image: '/covers/burzum-filosofem.jpg' },
    { name: 'In the Nightside Eclipse', image: '/covers/emperor-nightside.jpg' },
    { name: 'Black Metal Logo Shirt', image: '/covers/black-metal-shirt.jpg' },
    { name: 'Bathory Patch', image: '/covers/bathory-patch.jpg' },
    { name: 'Under a Funeral Moon', image: '/covers/darkthrone-transilvanian.jpg' },
    { name: 'Anthems to the Welkin at Dusk', image: '/covers/emperor-nightside.jpg' },
    { name: 'Hvis Lyset Tar Oss', image: '/covers/burzum-filosofem.jpg' },
    { name: 'Deathcrush', image: '/covers/mayhem-de-mysteriis.jpg' },
    { name: 'Bergtatt', image: '/covers/burzum-filosofem.jpg' },
    { name: 'Stormblåst', image: '/covers/emperor-nightside.jpg' },
    { name: 'In the Nightside Eclipse', image: '/covers/emperor-nightside.jpg' },
    { name: 'Mayhem Logo Patch', image: '/covers/bathory-patch.jpg' },
    { name: 'Filosofem', image: '/covers/burzum-filosofem.jpg' },
    { name: 'De Mysteriis Dom Sathanas', image: '/covers/mayhem-de-mysteriis.jpg' },
    { name: 'Nattens Madrigal', image: '/covers/burzum-filosofem.jpg' },
    { name: 'Dark Medieval Times', image: '/covers/darkthrone-transilvanian.jpg' }
  ]

  for (const update of imageUpdates) {
    await prisma.product.updateMany({
      where: { name: update.name },
      data: { image: update.image }
    })
  }

  console.log('Product images updated successfully!')
}

updateProductImages()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })