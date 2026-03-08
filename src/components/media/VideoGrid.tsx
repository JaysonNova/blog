'use client'

import { useState } from 'react'
import { VideoCard } from './VideoCard'
import { VideoPlayer } from './VideoPlayer'
import type { VideoWithAuthor } from '@/types/video'

interface VideoGridProps {
  videos: VideoWithAuthor[]
}

export function VideoGrid({ videos }: VideoGridProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoWithAuthor | null>(null)

  if (videos.length === 0) {
    return (
      <div className="py-4xl text-center">
        <p className="text-body text-muted-foreground">暂无视频</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onPlay={setSelectedVideo}
          />
        ))}
      </div>

      <VideoPlayer
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  )
}
