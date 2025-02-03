'use client'

import Image from 'next/image'
import { shimmer, toBase64 } from '@/utils/imageUtils'
import React, { useState, useEffect, useRef } from 'react'
import Lightbox from 'react-spring-lightbox'
import { FaTimes } from 'react-icons/fa'

interface ImageItem {
  title: string
  url: string
}

interface ImageGridProps {
  images: ImageItem[]
}

const ImageItem: React.FC<{ image: ImageItem; index: number; onClick: () => void }> = ({ image, index, onClick }) => {
  return (
    <div className="relative aspect-square cursor-pointer group" onClick={onClick}>
      <Image
        src={image.url}
        alt={image.title || `Image ${index + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover rounded-lg transition-transform duration-300 hover:scale-105"
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        priority={false}
      />
      {image.title && (
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <div className="text-white text-sm text-center truncate w-full text-shadow">
            {image.title}
          </div>
        </div>
      )}
    </div>
  )
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [visibleImages, setVisibleImages] = useState<ImageItem[]>(images.slice(0, 9)) 
  const loaderRef = useRef<HTMLDivElement>(null)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setIsOpen(true)
  }

  const closeLightbox = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleImages((prev) => [
            ...prev,
            ...images.slice(prev.length, prev.length + 4)
          ])
        }
      },
      { threshold: 1.0 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [images])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleImages.map((image, index) => (
          <ImageItem 
            key={index} 
            image={image} 
            index={index} 
            onClick={() => openLightbox(index)} 
          />
        ))}
      </div>

      <div ref={loaderRef} className="h-10"></div>

      {isOpen && (
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
      )}
    </>
  )
}

export default ImageGrid