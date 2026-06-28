"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ImageData } from "@/types/common"

interface PropertyGalleryProps {
  images: ImageData[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const close = useCallback(() => setLightboxIndex(null), [])
  const prev = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null)),
    [images.length]
  )
  const next = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null)),
    [images.length]
  )

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightboxIndex, close, prev, next])

  if (images.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Images className="size-10" />
          <p className="text-sm">No photos available</p>
        </div>
      </div>
    )
  }

  const [primary, ...rest] = images

  return (
    <>
      <div
        className={cn(
          "grid h-64 gap-1 sm:h-96 lg:h-[480px]",
          rest.length >= 1 ? "grid-cols-[2fr_1fr]" : "grid-cols-1"
        )}
      >
        {/* Primary image */}
        <button
          onClick={() => setLightboxIndex(0)}
          className="relative overflow-hidden bg-muted"
          aria-label="View photo 1"
        >
          <Image
            src={primary!.url}
            alt={primary!.alt || title}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority
          />
        </button>

        {/* Thumbnail column */}
        {rest.length >= 1 && (
          <div
            className={cn(
              "grid gap-1",
              rest.length >= 2 ? "grid-rows-2" : "grid-rows-1"
            )}
          >
            {rest.slice(0, 2).map((image, i) => (
              <button
                key={image.id}
                onClick={() => setLightboxIndex(i + 1)}
                className="relative overflow-hidden bg-muted"
                aria-label={`View photo ${i + 2}`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || title}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* "See all" overlay on last visible thumbnail */}
                {i === 1 && images.length > 3 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <span className="font-semibold text-white">+{images.length - 3} photos</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25"
            aria-label="Close gallery"
          >
            <X className="size-5" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative h-[90vh] w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]!.url}
              alt={images[lightboxIndex]!.alt || title}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25"
              aria-label="Next photo"
            >
              <ChevronRight className="size-6" />
            </button>
          )}

          {/* Counter */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  )
}
