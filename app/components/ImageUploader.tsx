'use client'

import { useState } from 'react'

export default function ImageUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [converting, setConverting] = useState(false)
  const [converted, setConverted] = useState<{ name: string, data: string }[]>([])
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const convertFile = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      const result = await response.json()
      return result.convertedImage
    } else {
      throw new Error('Conversion failed')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setConverting(true)
    setConverted([])
    setProgress(0)

    const convertedImages = []
    for (let i = 0; i < files.length; i++) {
      try {
        const convertedImage = await convertFile(files[i])
        convertedImages.push(convertedImage)
        setProgress(((i + 1) / files.length) * 100)
      } catch (error) {
        console.error(`Error converting file ${files[i].name}:`, error)
      }
    }

    setConverted(convertedImages)
    setConverting(false)
  }

  const handleDownloadAll = () => {
    converted.forEach((image) => {
      const link = document.createElement('a')
      link.href = `data:image/webp;base64,${image.data}`
      link.download = `${image.name}.webp`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">WebP Image Converter</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, TIFF, or WebP (MAX. 10 MB)</p>
              </div>
              <input
                type="file"
                id="images"
                name="images"
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
          {files.length > 0 && (
            <div className="text-sm text-gray-600">
              {files.length} file(s) selected
            </div>
          )}
          <button
            type="submit"
            disabled={files.length === 0 || converting}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {converting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Converting... {progress.toFixed(0)}%
              </span>
            ) : (
              'Convert to WebP'
            )}
          </button>
        </form>
      </div>
      {converted.length > 0 && (
        <div className="bg-gray-50 px-6 py-8 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Converted Images</h3>
            <button
              onClick={handleDownloadAll}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
            >
              Download All
            </button>
          </div>
          <ul className="space-y-3">
            {converted.map((image, index) => (
              <li key={index} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                <span className="text-sm text-gray-600">{image.name}.webp</span>
                <a
                  href={`data:image/webp;base64,${image.data}`}
                  download={`${image.name}.webp`}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

