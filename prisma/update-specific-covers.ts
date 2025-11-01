import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateSpecificCovers() {
  const specificUpdates = [
    { name: 'Under a Funeral Moon', image: '/covers/darkthrone-funeral.jpg' },
    { name: 'Bergtatt', image: '/covers/ulver-bergtatt.jpg' },
    { name: 'Stormblåst', image: '/covers/dimmu-stormblast.jpg' },
    { name: 'Anthems to the Welkin at Dusk', image: '/covers/emperor-nightside.jpg' },
    { name: 'Deathcrush', image: '/covers/mayhem-de-mysteriis.jpg' },
    { name: 'Nattens Madrigal', image: '/covers/ulver-bergtatt.jpg' },
    { name: 'Dark Medieval Times', image: '/covers/darkthrone-funeral.jpg' }
  ]

  for (const update of specificUpdates) {
    await prisma.product.updateMany({
      where: { name: update.name },
      data: { image: update.image }
    })
  }

  console.log('Specific album covers updated successfully!')
}

updateSpecificCovers()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })