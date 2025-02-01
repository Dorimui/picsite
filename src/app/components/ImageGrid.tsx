'use client'

import Image from 'next/image'
import { shimmer, toBase64 } from '@/utils/imageUtils'
import React, { useState, useEffect } from 'react'
import Lightbox from 'react-spring-lightbox'
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa'

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

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setIsOpen(true)
  }

  const closeLightbox = () => {
    setIsOpen(false)
  }

  const gotoPrevious = () => {
    currentImageIndex > 0 && setCurrentImageIndex(currentImageIndex - 1)
  }

  const gotoNext = () => {
    currentImageIndex + 1 < images.length && setCurrentImageIndex(currentImageIndex + 1)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox() 
      } else if (event.key === 'ArrowLeft') {
        gotoPrevious()
      } else if (event.key === 'ArrowRight') {
        gotoNext()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, currentImageIndex])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <ImageItem 
            key={index} 
            image={image} 
            index={index} 
            onClick={() => openLightbox(index)} 
          />
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/50">
          <Lightbox
            isOpen={isOpen}
            onPrev={gotoPrevious}
            onNext={gotoNext}
            images={images.map((image) => ({ src: image.url, alt: image.title }))}
            currentIndex={currentImageIndex}
            onClose={closeLightbox}
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
            renderPrevButton={({ canPrev }) => (
              canPrev && (
                <button
                  onClick={gotoPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-50 hover:text-gray-300 transition-colors"
                  aria-label="Previous image"
                >
                  <FaArrowLeft />
                </button>
              )
            )}
            renderNextButton={({ canNext }) => (
              canNext && (
                <button
                  onClick={gotoNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-50 hover:text-gray-300 transition-colors"
                  aria-label="Next image"
                >
                  <FaArrowRight />
                </button>
              )
            )}
            renderFooter={() => (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white z-50 text-shadow">
                {images[currentImageIndex].title && (
                  <div className="text-lg font-semibold mb-1">
                    {images[currentImageIndex].title}
                  </div>
                )}
                <div className="text-sm">
                  {`${currentImageIndex + 1} / ${images.length}`}
                </div>
              </div>
            )}
          />
        </div>
      )}
    </>
  )
}

export default ImageGrid