"use client"

import { useState, useEffect, useRef } from "react"
import { Howl } from "howler"

interface UseHowlOptions {
  src: string[]
  html5?: boolean
  loop?: boolean
  volume?: number
  preload?: boolean
  autoplay?: boolean
}

interface UseHowlReturn {
  howl: Howl | null
  state: {
    playing: boolean
    loading: boolean
    error: boolean
  }
  play: () => void
  pause: () => void
  stop: () => void
  mute: (muted: boolean) => void
  volume: (volume: number) => void
}

export function useHowl(options: UseHowlOptions): UseHowlReturn {
  const [howl, setHowl] = useState<Howl | null>(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Use a ref to track if component is mounted
  const isMounted = useRef(true)

  useEffect(() => {
    // Set up cleanup function
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const sound = new Howl({
      src: options.src,
      html5: options.html5 ?? false,
      loop: options.loop ?? false,
      volume: options.volume ?? 1.0,
      preload: options.preload ?? true,
      autoplay: options.autoplay ?? false,
    })

    sound.once("load", () => {
      if (isMounted.current) {
        setLoading(false)
        setHowl(sound)

        if (options.autoplay) {
          sound.play()
          setPlaying(true)
        }
      }
    })

    sound.once("loaderror", () => {
      if (isMounted.current) {
        setLoading(false)
        setError(true)
      }
    })

    sound.on("play", () => {
      if (isMounted.current) {
        setPlaying(true)
      }
    })

    sound.on("pause", () => {
      if (isMounted.current) {
        setPlaying(false)
      }
    })

    sound.on("stop", () => {
      if (isMounted.current) {
        setPlaying(false)
      }
    })

    sound.on("end", () => {
      if (isMounted.current && !options.loop) {
        setPlaying(false)
      }
    })

    return () => {
      sound.unload()
    }
  }, [options.src.join()])

  const play = () => {
    if (howl && !playing) {
      howl.play()
    }
  }

  const pause = () => {
    if (howl && playing) {
      howl.pause()
    }
  }

  const stop = () => {
    if (howl) {
      howl.stop()
    }
  }

  const mute = (muted: boolean) => {
    if (howl) {
      howl.mute(muted)
    }
  }

  const volume = (vol: number) => {
    if (howl) {
      howl.volume(vol)
    }
  }

  return {
    howl,
    state: {
      playing,
      loading,
      error,
    },
    play,
    pause,
    stop,
    mute,
    volume,
  }
}
