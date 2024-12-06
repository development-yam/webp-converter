import ImageUploader from './components/ImageUploader'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">WebP Converter</h1>
        <ImageUploader />
      </div>
    </main>
  )
}

