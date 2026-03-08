'use client'

import { useState } from 'react'
import Image from 'next/image'
import Masonry from 'react-masonry-css'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { Calendar, MapPin, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils/date'
import type { PhotoWithAuthor } from '@/types/photo'
import 'react-photo-view/dist/react-photo-view.css'

interface PhotoGalleryProps {
  photos: PhotoWithAuthor[]
}

const breakpointColumns = {
  default: 3,
  1024: 2,
  640: 1,
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  if (photos.length === 0) {
    return (
      <div className="py-4xl text-center">
        <p className="text-body text-muted-foreground">暂无照片</p>
      </div>
    )
  }

  return (
    <PhotoProvider
      maskOpacity={0.9}
      speed={() => 300}
      easing={(type) => (type === 2 ? 'cubic-bezier(0.36, 0, 0.66, -0.56)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)')}
    >
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-lg w-auto"
        columnClassName="pl-lg bg-clip-padding"
      >
        {photos.map((photo) => (
          <PhotoView key={photo.id} src={photo.imageUrl}>
            <div className="mb-lg group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-muted">
                <Image
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.title}
                  width={photo.width || 800}
                  height={photo.height || 600}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-md">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white w-full">
                    <h3 className="text-lg font-semibold mb-xs">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-sm text-white/90 mb-sm line-clamp-2">{photo.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-md text-xs text-white/80">
                      {photo.takenAt && (
                        <span className="flex items-center gap-xs">
                          <Calendar className="h-3 w-3" />
                          {formatDate(photo.takenAt)}
                        </span>
                      )}
                      {photo.location && (
                        <span className="flex items-center gap-xs">
                          <MapPin className="h-3 w-3" />
                          {photo.location}
                        </span>
                      )}
                      <span className="flex items-center gap-xs">
                        <Eye className="h-3 w-3" />
                        {photo.viewCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PhotoView>
        ))}
      </Masonry>
    </PhotoProvider>
  )
}
