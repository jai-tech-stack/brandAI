// Shared brand kits storage (in production, replace with database)
export interface BrandKit {
  id: string
  name: string
  url: string
  logo?: string | null
  colors: string[]
  typography: string[]
  style: string
  createdAt: string
}

let brandKits: BrandKit[] = [
  {
    id: '1',
    name: 'Gumroad',
    url: 'gumroad.com',
    colors: ['#FF90E8', '#FFC900', '#000000'],
    typography: ['Inter', 'System Font'],
    style: 'Bold, Playful, Modern',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Ulysses',
    url: 'ulysses.app',
    colors: ['#2C2C2C', '#FFFFFF', '#007AFF'],
    typography: ['SF Pro', 'Helvetica Neue'],
    style: 'Minimal, Clean, Professional',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'HFØ',
    url: 'hfo.com',
    colors: ['#1A1A1A', '#FF6B6B', '#4ECDC4'],
    typography: ['Poppins', 'Arial'],
    style: 'Creative, Bold, Contemporary',
    createdAt: new Date().toISOString(),
  },
]

export function getAllBrandKits(): BrandKit[] {
  return brandKits
}

export function getBrandKitById(id: string): BrandKit | undefined {
  return brandKits.find((kit) => kit.id === id)
}

export function createBrandKit(brandKit: Omit<BrandKit, 'id' | 'createdAt'>): BrandKit {
  const newBrandKit: BrandKit = {
    id: Date.now().toString(),
    ...brandKit,
    createdAt: new Date().toISOString(),
  }
  brandKits.push(newBrandKit)
  return newBrandKit
}

export function deleteBrandKit(id: string): boolean {
  const index = brandKits.findIndex((kit) => kit.id === id)
  if (index !== -1) {
    brandKits.splice(index, 1)
    return true
  }
  return false
}

