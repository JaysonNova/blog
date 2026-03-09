'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { VideoWithAuthor } from '@/types/video'

interface VideoPlayerProps {
  video: VideoWithAuthor | null
  onClose: () => void
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.play()
    }
  }, [video])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (video) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [video, onClose])

  if (!video) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-md"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
        aria-label="关闭"
      >
        <X className="h-6 w-6" />
      </button>

      <div
        className="w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          controls
          className="w-full rounded-lg"
          controlsList="nodownload"
        >
          您的浏览器不支持视频播放。
        </video>

        <div className="mt-md text-white">
          <h2 className="text-h2 font-bold mb-sm">{video.title}</h2>
          {video.description && (
            <p className="text-body text-white/80">{video.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
