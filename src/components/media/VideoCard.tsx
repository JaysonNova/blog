'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, Calendar, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils/date'
import { getShimmerDataUrl } from '@/lib/utils/image'
import type { VideoWithAuthor } from '@/types/video'
import { cn } from '@/lib/utils/cn'

interface VideoCardProps {
  video: VideoWithAuthor
  onPlay?: (video: VideoWithAuthor) => void
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function VideoCard({ video, onPlay }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay?.(video)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-md">
        <Image
          src={video.thumbnailUrl || '/placeholder-video.jpg'}
          alt={video.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={getShimmerDataUrl(1280, 720)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <div
            className={cn(
              'w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transition-all duration-300',
              isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            )}
          >
            <Play className="h-8 w-8 text-foreground ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-sm">
        <h3 className="text-h3 font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
          {video.title}
        </h3>

        {video.description && (
          <p className="text-small text-muted-foreground line-clamp-2">
            {video.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-md text-xs text-muted-foreground">
          <span className="flex items-center gap-xs">
            <Calendar className="h-3 w-3" />
            {formatDate(video.createdAt)}
          </span>
          <span className="flex items-center gap-xs">
            <Eye className="h-3 w-3" />
            {video.viewCount}
          </span>
        </div>
      </div>
    </article>
  )
}
