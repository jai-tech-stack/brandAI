import { NextRequest, NextResponse } from 'next/server'
import { getAllBrandKits, createBrandKit, deleteBrandKit } from '@/lib/brandKitsStorage'

export async function GET() {
  try {
    const brandKits = getAllBrandKits()
    return NextResponse.json({ success: true, data: brandKits })
  } catch (error) {
    console.error('Failed to get brand kits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand kits' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const brandKit = await request.json()
    const newBrandKit = createBrandKit(brandKit)
    return NextResponse.json({ success: true, data: newBrandKit })
  } catch (error) {
    console.error('Brand kit creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create brand kit' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Brand kit ID is required' },
        { status: 400 }
      )
    }

    const deleted = deleteBrandKit(id)
    if (!deleted) {
      return NextResponse.json(
        { error: 'Brand kit not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Brand kit deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete brand kit' },
      { status: 500 }
    )
  }
}

