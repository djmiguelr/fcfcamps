"use client"

import { useEffect, useRef } from "react"

interface YouTubeBackgroundProps {
  videoId: string
}

export function YouTubeBackground({ videoId }: YouTubeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    let player: any

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (!containerRef.current) return

      player = new (window as any).YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          mute: 1,
          loop: 1,
          playlist: videoId, // Required for looping
          showinfo: 0,
          rel: 0,
          enablejsapi: 1,
          modestbranding: 1,
          iv_load_policy: 3,
          fs: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo()
          },
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              player.playVideo()
            }
          },
        },
      })
    }

    return () => {
      // Clean up
      if (player) {
        player.destroy()
      }
      window.onYouTubeIframeAPIReady = null
    }
  }, [videoId])

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          ref={containerRef}
          className="absolute inset-0 w-[300%] h-[300%] -top-[100%] -left-[100%] pointer-events-none"
        ></div>
        <div className="absolute inset-0 bg-blue-900/70"></div>
      </div>
    </>
  )
}

// Add type definition for the YouTube API
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
    YT: any
  }
}

