'use client'

import { useState } from 'react'
import { EmptyState } from '@/components/common/EmptyState'
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
      <EmptyState
        title="暂无视频"
        description="视频内容尚未发布，后续会在这里集中展示。"
        actionHref="/"
        actionLabel="先浏览首页"
      />
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
