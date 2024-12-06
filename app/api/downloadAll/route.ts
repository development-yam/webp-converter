import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'

export async function POST(req: NextRequest) {
  const { images } = await req.json()

  const zip = new JSZip()

  images.forEach((image: { name: string; data: string }) => {
    zip.file(`${image.name}.webp`, image.data, { base64: true })
  })

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  const zipBuffer = await zipBlob.arrayBuffer()

  return new NextResponse(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=converted_images.zip',
    },
  })
}

