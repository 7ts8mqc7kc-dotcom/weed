"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    videojs: any
  }
}

interface VideoJsPlayerProps {
  src: string
  isLive: boolean
  autoPlay?: boolean
  muted?: boolean
  isMobile?: boolean
}

const VideoJsPlayer: React.FC<VideoJsPlayerProps> = ({
  src,
  isLive,
  autoPlay = true,
  muted = false,
  isMobile = false,
}) => {
  const videoNodeRef = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<any | null>(null)
  const [playerReady, setPlayerReady] = useState(false)

  useEffect(() => {
    const checkVideoJs = setInterval(() => {
      if (window.videojs) {
        setPlayerReady(true)
        clearInterval(checkVideoJs)
      }
    }, 100)

    return () => clearInterval(checkVideoJs)
  }, [])

  useEffect(() => {
    if (!playerReady || !videoNodeRef.current) {
      console.log("[v0] Player not ready or video ref missing")
      return
    }

    if (playerRef.current && !playerRef.current.isDisposed()) {
      console.log("[v0] Disposing existing player")
      playerRef.current.dispose()
      playerRef.current = null
    }

    const videoElement = videoNodeRef.current

    const options = {
      autoplay: autoPlay,
      muted: muted,
      controls: true,
      responsive: true,
      fluid: true,
      liveui: isLive,
      controlBar: {
        progressControl: false,
      },
      html5: {
        vhs: {
          overrideNative: true,
          withCredentials: false,
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          useDevicePixelRatio: true,
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false,
      },
      hls: {
        overrideNative: true,
      },
      playsinline: true,
    }

    const player = window.videojs(videoElement, options, () => {
      console.log("[v0] Video.js Player initialized and ready")
    })

    playerRef.current = player

    player.on("error", () => {
      const error = player.error()
      console.error("[v0] Video.js error:", error?.code, error?.message)
    })

    return () => {
      const player = playerRef.current
      if (player && !player.isDisposed()) {
        console.log("[v0] Disposing Video.js player on cleanup")
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerReady])

  useEffect(() => {
    const player = playerRef.current

    if (!player || player.isDisposed()) {
      console.log("[v0] Player not available for source update")
      return
    }

    const currentSrc = player.currentSrc()

    if (currentSrc !== src) {
      let sourceType = ""

      if (src.includes(".m3u8") || src.includes("/live/") || src.includes("stream")) {
        sourceType = "application/x-mpegURL" // HLS
      } else if (src.includes(".mpd")) {
        sourceType = "application/dash+xml" // DASH
      } else if (src.includes("easybroadcast.io")) {
        sourceType = "application/x-mpegURL"
      } else if (src.includes("mp4")) {
        sourceType = "video/mp4"
      } else {
        sourceType = "application/x-mpegURL"
      }

      console.log("[v0] Loading stream source:", src, "Type:", sourceType)

      player.pause()
      player.src({
        src: src,
        type: sourceType,
      })

      if (autoPlay) {
        player.play()?.catch((e: any) => {
          console.warn("[v0] Autoplay blocked or failed:", e.message)
        })
      }
    }

    player.autoplay(autoPlay || false)
    player.muted(muted || false)
  }, [src, autoPlay, muted, isLive])

  if (!playerReady) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-white text-sm">Loading player...</div>
      </div>
    )
  }

  return (
    <div data-vjs-player className="w-full h-full bg-black">
      <video ref={videoNodeRef} className="video-js vjs-big-play-centered vjs-fill vjs-theme-city" />
    </div>
  )
}

export default VideoJsPlayer
