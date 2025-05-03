'use client'

import Image from 'next/image'
import { shimmer, toBase64 } from '@/utils/imageUtils'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Lightbox from 'react-spring-lightbox'
import { FaTimes } from 'react-icons/fa'

interface ImageItem {
  title: string
  url: string
}

interface ImageGridProps {
  images: ImageItem[]
}

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={`animate-spin h-5 w-5 text-current ${className || ''}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const useColumnCount = () => {
  const [columnCount, setColumnCount] = useState(1)

  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth
      let columns = 1
      if (width >= 640) columns = 2
      if (width >= 768) columns = 3
      if (width >= 1024) columns = 4
      setColumnCount(columns)
    }

    updateColumnCount()
    window.addEventListener('resize', updateColumnCount)
    return () => window.removeEventListener('resize', updateColumnCount)
  }, [])

  return columnCount
}

const ImageItem: React.FC<{ image: ImageItem; index: number; onClick: () => void }> = ({ 
  image, 
  index, 
  onClick 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
      )}
      <Image
        src={image.url}
        alt={image.title || `Image ${index + 1}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        className={`object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoadingComplete={() => setIsLoaded(true)}
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        onClick={onClick}
      />
      {image.title && isLoaded && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="text-white text-sm font-medium truncate text-center">
            {image.title}
          </div>
        </div>
      )}
    </div>
  )
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const columnCount = useColumnCount()
  const [visibleImages, setVisibleImages] = useState<ImageItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return

    setIsLoading(true)
    const currentLength = visibleImages.length
    const nextLength = currentLength + columnCount * 2
    const nextImages = images.slice(currentLength, nextLength)

    await Promise.all(
      nextImages.map(
        (img) =>
          new Promise((resolve) => {
            const image = new window.Image()
            image.src = img.url
            image.onload = resolve
            image.onerror = resolve
          })
      )
    )

    setVisibleImages((prev) => [...prev, ...nextImages])
    setHasMore(nextLength < images.length)
    setIsLoading(false)
  }, [columnCount, hasMore, images, isLoading, visibleImages.length])

  useEffect(() => {
    const initialCount = columnCount * 2
    setVisibleImages(images.slice(0, initialCount))
    setHasMore(images.length > initialCount)
  }, [columnCount, images])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentLoader = loaderRef.current
    if (currentLoader) observer.observe(currentLoader)

    return () => {
      if (currentLoader) observer.unobserve(currentLoader)
    }
  }, [hasMore, isLoading, loadMore])

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setIsOpen(true)
  }

  const closeLightbox = () => setIsOpen(false)

  return (
    <div className="space-y-8">
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      >
        {visibleImages.map((image, index) => (
          <ImageItem
            key={image.url}
            image={image}
            index={index}
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>

      <div ref={loaderRef} className="h-20 flex items-center justify-center">
        {isLoading && (
          <div className="flex items-center gap-3 text-gray-500">
            <Spinner className="w-6 h-6" />
            <span className="text-sm">
              加载中... {visibleImages.length}/{images.length}
            </span>
          </div>
        )}
        {!hasMore && visibleImages.length > 0 && (
          <div className="text-center text-gray-500 text-sm">
            所有图片加载完毕
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 ">

          <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/50">
            <Lightbox
              isOpen={isOpen}
              images={[{ src: visibleImages[currentImageIndex].url, alt: visibleImages[currentImageIndex].title }]}
              currentIndex={0}
              onClose={closeLightbox}
              onNext={() => {}}
              onPrev={() => {}}
              singleClickToZoom
              className="custom-lightbox"
              style={{ background: 'transparent' }}
              pageTransitionConfig={{
                from: { transform: "scale(0.75)", opacity: 0 },
                enter: { transform: "scale(1)", opacity: 1 },
                leave: { transform: "scale(0.75)", opacity: 0 },
                config: { mass: 1, tension: 320, friction: 32 }
              }}
              renderHeader={() => (
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 text-white text-2xl z-50 hover:text-gray-300 transition-colors"
                  aria-label="Close lightbox"
                >
                  <FaTimes />
                </button>
              )}
              renderFooter={() => (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white z-50 text-shadow">
                {visibleImages[currentImageIndex].title && (
                  <div className="text-lg font-semibold mb-1">
                      {visibleImages[currentImageIndex].title}
                    </div>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGrid