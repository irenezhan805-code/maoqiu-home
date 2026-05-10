import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function MediaPlaceholder({ poster, title = "猫咪素材待替换" }) {
  const [posterFailed, setPosterFailed] = useState(false);

  if (poster && !posterFailed) {
    return (
      <img
        src={poster}
        alt={title}
        className="h-full w-full object-cover"
        onError={() => setPosterFailed(true)}
      />
    );
  }

  return (
    <div className="grid h-full w-full place-items-center bg-[#DDEED5]">
      <div className="text-center text-[var(--muted)]">
        <div className="mx-auto mb-3 h-20 w-24 rounded-[45%_45%_42%_42%] bg-white/70 shadow-inner">
          <div className="mx-auto translate-y-5 text-3xl">· ·</div>
        </div>
        <p className="text-base font-bold text-[var(--ink)]">猫咪素材待替换</p>
        <p className="mt-1 text-sm">把素材放进对应文件夹后自动显示</p>
      </div>
    </div>
  );
}

export default function PetVideo({
  src,
  cutoutSrc,
  cutoutSources,
  poster,
  className = "",
  autoPlay = true,
  loop = true,
  defaultMuted = true,
  allowSoundToggle = false,
  volume = 0.8,
  objectFit = "cover",
  onPlayError,
  openSoundLabel = "打开猫猫声音",
  closeSoundLabel = "关闭猫猫声音",
  blockedSoundLabel = "点一下听小井叫",
  clickToStop = false,
  onStoppedByTap,
}) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(defaultMuted);
  const [hasError, setHasError] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [activeSrc, setActiveSrc] = useState(src);
  const [stoppedByTap, setStoppedByTap] = useState(false);
  const sourceList = [
    ...(Array.isArray(cutoutSources) ? cutoutSources : []),
    ...(cutoutSrc ? [cutoutSrc] : []),
  ].filter(Boolean);
  const isCutoutSource = activeSrc !== src && sourceList.includes(activeSrc);

  useEffect(() => {
    let cancelled = false;
    setHasError(false);
    setNeedsTap(false);
    setStoppedByTap(false);
    setActiveSrc(src);

    if (!sourceList.length) return undefined;

    async function pickFirstVideoSource() {
      for (const candidate of sourceList) {
        try {
          const response = await fetch(candidate, { method: "HEAD" });
          const contentType = response.headers.get("content-type") || "";
          if (response.ok && contentType.startsWith("video/")) return candidate;
        } catch {
          // Try the next candidate.
        }
      }
      throw new Error("没有可用的视频");
    }

    pickFirstVideoSource()
      .then((candidate) => {
        if (!cancelled) setActiveSrc(candidate);
      })
      .catch(() => {
        if (!cancelled) setActiveSrc(src);
      });

    return () => {
      cancelled = true;
    };
  }, [cutoutSrc, src, sourceList.join("|")]);

  useEffect(() => {
    setMuted(defaultMuted);
  }, [defaultMuted, activeSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasError) return undefined;

    video.volume = volume;
    video.muted = muted;

    if (autoPlay && !stoppedByTap) {
      const playPromise = video.play();
      if (playPromise?.catch) {
        playPromise.catch((error) => {
          if (!muted) {
            video.muted = true;
            setMuted(true);
            setNeedsTap(true);
            video.play().catch(() => {});
          } else {
            setNeedsTap(true);
          }
          onPlayError?.(error);
        });
      }
    }

    return () => {
      video.pause();
      video.muted = true;
    };
  }, [activeSrc, autoPlay, hasError, muted, onPlayError, stoppedByTap, volume]);

  async function toggleSound(event) {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = needsTap ? false : !muted;
    video.volume = volume;
    video.muted = nextMuted;
    setMuted(nextMuted);
    setNeedsTap(false);

    try {
      await video.play();
    } catch (error) {
      video.muted = true;
      setMuted(true);
      setNeedsTap(true);
      onPlayError?.(error);
    }
  }

  function stopByTap() {
    if (!clickToStop || stoppedByTap) return;
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.muted = true;
    setMuted(true);
    setStoppedByTap(true);
    setNeedsTap(false);
    onStoppedByTap?.();
  }

  return (
    <div
      role={clickToStop ? "button" : undefined}
      tabIndex={clickToStop ? 0 : undefined}
      aria-label={clickToStop ? "点一下让小猫安静" : undefined}
      onClick={stopByTap}
      onKeyDown={(event) => {
        if (!clickToStop) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          stopByTap();
        }
      }}
      className={`pet-video relative overflow-hidden ${
        isCutoutSource ? "is-cutout-video" : ""
      } ${clickToStop ? "click-to-stop" : ""} ${className}`}
    >
      {hasError ? (
        <MediaPlaceholder poster={poster} />
      ) : (
        <video
          ref={videoRef}
          src={activeSrc}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          preload="metadata"
          className={`h-full w-full ${objectFit === "contain" ? "object-contain" : "object-cover"}`}
          onError={() => {
            if (activeSrc !== src) {
              setActiveSrc(src);
            } else {
              setHasError(true);
            }
          }}
        />
      )}

      {allowSoundToggle && (
        <button
          type="button"
          onClick={toggleSound}
          className="absolute bottom-4 left-1/2 z-20 inline-flex min-h-12 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[var(--button)] px-5 py-3 text-base font-bold text-white shadow-lift"
        >
          {muted ? <Volume2 size={20} /> : <VolumeX size={20} />}
          {needsTap ? blockedSoundLabel : muted ? openSoundLabel : closeSoundLabel}
        </button>
      )}
    </div>
  );
}