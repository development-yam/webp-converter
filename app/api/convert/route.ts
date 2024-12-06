import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export const config = {
  runtime: 'edge',
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('image') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  try {
    const buffer = await file.arrayBuffer()
    const webpBuffer = await sharp(Buffer.from(buffer))
      .webp({ quality: 80 })
      .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
      .toBuffer()

    const base64 = webpBuffer.toString('base64')
    const fileName = file.name.replace(/\.[^/.]+$/, '')

    return NextResponse.json({
      convertedImage: {
        name: fileName,
        data: base64
      }
    })
  } catch (error) {
    console.error('Error converting image:', error)
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 })
  }
}

