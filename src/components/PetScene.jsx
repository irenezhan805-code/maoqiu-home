import { useState } from "react";
import PetVideo from "./PetVideo.jsx";

function normalizeAssetSrc(src) {
  return src ? encodeURI(src) : src;
}

function WeekCardImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  const normalizedSrc = normalizeAssetSrc(src);

  if (!normalizedSrc || failed) {
    return (
      <div className="home-week-fallback" aria-hidden="true">
        <span className="home-week-fallback-mark" />
      </div>
    );
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt}
      className={className || "home-week-art"}
      onError={() => setFailed(true)}
    />
  );
}

function getSceneCopy(sceneType, userName, petName) {
  const copyByScene = {
    home: {
      title: `Hi，${userName}`,
      subtitle: `${petName}今天也在家。`,
      actionText: "我知道啦",
    },
    morning: {
      title: "早上好，今天也慢慢来。",
      subtitle: `${petName}刚睡醒，陪你一起开始今天。`,
      actionText: "我知道啦",
    },
    meal: {
      title: "妈妈，该吃饭啦。",
      subtitle: `${petName}在等你。`,
      actionText: "我知道啦",
    },
    rest: {
      title: "先慢慢来。",
      subtitle: `${petName}在陪你待一会儿。`,
      actionText: "好呀",
    },
    interaction: {
      title: `${petName}回头看你。`,
      subtitle: "像听到你叫它一样。",
      actionText: "好呀",
    },
    night: {
      title: "该休息啦，今天辛苦了。",
      subtitle: `${petName}也困啦，陪你一起关灯。`,
      actionText: "关灯休息",
    },
  };

  return copyByScene[sceneType] ?? copyByScene.home;
}

export default function PetScene({
  sceneType = "home",
  videoSrc,
  cutoutVideoSrc,
  cutoutVideoSources,
  poster,
  reminderVideoSrc,
  reminderCutoutVideoSrc,
  reminderCutoutVideoSources,
  reminderPoster,
  homeNote,
  weekdayLabel,
  weekdayCard,
  nextReminderText,
  title,
  subtitle,
  actionText,
  onAction,
  onPetQuiet,
  floatingAutoPlay = true,
  floatingDefaultMuted,
  defaultMuted = true,
  volume = 0.8,
  userName = "淡淡",
  petName = "小井",
  reminderTime = "12:00",
}) {
  const copy = getSceneCopy(sceneType, userName, petName);
  const isHome = sceneType === "home";
  const isMeal = sceneType === "meal";
  const isNight = sceneType === "night";
  const openSoundLabel = "打开猫猫声音";
  const closeSoundLabel = "关闭猫猫声音";
  const blockedSoundLabel = `点一下听${petName}叫`;
  const floatingVideoSrc =
    isHome && reminderVideoSrc ? reminderVideoSrc : videoSrc;
  const floatingCutoutVideoSrc =
    isHome && reminderCutoutVideoSrc ? reminderCutoutVideoSrc : cutoutVideoSrc;
  const floatingCutoutVideoSources =
    isHome && reminderCutoutVideoSources
      ? reminderCutoutVideoSources
      : cutoutVideoSources;
  const floatingPoster = poster;

  if (isMeal) {
    return (
      <section className="meal-scene fixed inset-0 z-50 flex flex-col overflow-hidden bg-[linear-gradient(180deg,#F7F8EF_0%,#DDEED5_55%,#F7F8EF_100%)] px-6 pb-7 pt-12 text-[var(--ink)]">
        <div className="relative z-10">
          <p className="text-lg font-extrabold text-[var(--muted)]">毛球在家</p>
          <h1 className="mt-5 max-w-[11ch] text-5xl font-extrabold leading-[1.05] tracking-[-0.02em]">
            {title || copy.title}
          </h1>
          <p className="mt-4 text-3xl font-extrabold text-[var(--button)]">
            {subtitle || copy.subtitle}
          </p>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-20 h-[55%] bg-[radial-gradient(circle_at_50%_62%,rgba(255,255,255,0.96),rgba(255,255,255,0.58)_42%,rgba(255,255,255,0)_70%)]" />

        <PetVideo
          src={videoSrc}
          cutoutSrc={cutoutVideoSrc}
          cutoutSources={cutoutVideoSources}
          poster={poster}
          className="absolute inset-x-[-8%] bottom-20 z-10 h-[54%] overflow-visible mix-blend-multiply"
          autoPlay
          loop
          defaultMuted={defaultMuted}
          allowSoundToggle
          volume={volume}
          objectFit="contain"
          openSoundLabel={openSoundLabel}
          closeSoundLabel={closeSoundLabel}
          blockedSoundLabel={blockedSoundLabel}
        />

        <button
          type="button"
          onClick={onAction}
          className="relative z-20 mt-auto min-h-16 w-full rounded-full bg-[var(--button)] px-8 py-5 text-2xl font-bold text-white shadow-lift active:scale-[0.99]"
        >
          {actionText || copy.actionText}
        </button>
      </section>
    );
  }

  return (
    <section
      className={`pet-scene pet-scene-${sceneType} ${isHome ? "pet-scene-home" : ""} relative overflow-hidden rounded-b-[38px] px-6 pt-8 ${
        isHome ? "h-[100svh] min-h-[620px] pb-0" : "min-h-[100svh] pb-[330px]"
      } ${
        isNight ? "night-scene text-[var(--night-text)]" : "text-[var(--ink)]"
      }`}
    >
      <div className={`relative z-20 ${isHome ? "max-w-[18rem]" : "max-w-[310px]"}`}>
        {isHome ? (
          <p className="home-top-pill">今日</p>
        ) : (
          <p className="text-base font-extrabold text-[var(--muted)]">毛球在家</p>
        )}
        {isHome ? (
          <h1 className="home-date-title">{title || copy.title}</h1>
        ) : (
          <h1
            className={`font-extrabold leading-[1.08] tracking-[-0.02em] ${
              isHome ? "mt-3 text-[32px]" : "mt-3 text-[42px]"
            }`}
          >
            {title || copy.title}
          </h1>
        )}
        <p
          className={`font-bold text-[var(--muted)] ${
            isHome ? "mt-2 max-w-[14ch] text-[22px] leading-[1.28]" : "mt-3 text-xl leading-8"
          }`}
        >
          {subtitle || copy.subtitle}
        </p>
        {isHome && weekdayCard && (
          <section
            className={`home-weekday-card ${weekdayLabel === "周日" ? "is-sunday" : ""}`}
            style={{ background: weekdayCard.cardBg }}
          >
            <div className="home-weekday-card-copywrap">
              <span
                className="home-weekday-chip"
                style={{ background: weekdayCard.tagBg }}
              >
                {weekdayLabel || weekdayCard.weekday}
              </span>
              <p className="home-weekday-copy">
                {weekdayCard.text?.startsWith(petName) ? (
                  <>
                    <span className="home-weekday-copy-name">{petName}</span>
                    <span>{weekdayCard.text.slice(petName.length)}</span>
                  </>
                ) : (
                  weekdayCard.text
                )}
              </p>
            </div>
            <div className="home-weekday-artwrap">
              <WeekCardImage
                src={weekdayCard.image}
                alt={weekdayCard.weekday}
                className="home-weekday-art"
              />
            </div>
          </section>
        )}
        {isHome && (
          <div className="home-talk-bubble">
            <span className="home-talk-tag">小井说</span>
            <p className="home-talk-line">
              {homeNote || `${petName}会一直安静陪着你。`}
            </p>
          </div>
        )}
      </div>

      {!isHome && (
        <button
          type="button"
          onClick={onAction}
          className="relative z-20 mt-7 min-h-14 rounded-full bg-[var(--button)] px-7 py-4 text-xl font-bold text-white shadow-lift"
        >
          {actionText || copy.actionText}
        </button>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 z-0 h-[48%] ${
          isHome
            ? "bg-[radial-gradient(circle_at_56%_72%,rgba(245,246,234,0.95),rgba(221,238,213,0.58)_46%,rgba(221,238,213,0)_80%)]"
            : "bg-[radial-gradient(circle_at_56%_70%,rgba(255,255,255,0.95),rgba(255,255,255,0.45)_48%,rgba(255,255,255,0)_72%)]"
        }`}
      />

      <PetVideo
        src={floatingVideoSrc}
        cutoutSrc={floatingCutoutVideoSrc}
        cutoutSources={floatingCutoutVideoSources}
        poster={floatingPoster}
        className={`floating-pet floating-pet-${sceneType}`}
        autoPlay={floatingAutoPlay}
        loop
        defaultMuted={floatingDefaultMuted ?? defaultMuted}
        allowSoundToggle={sceneType === "night"}
        volume={volume}
        objectFit="contain"
        clickToStop={isHome}
        onStoppedByTap={onPetQuiet}
        openSoundLabel={openSoundLabel}
        closeSoundLabel={closeSoundLabel}
        blockedSoundLabel={blockedSoundLabel}
      />
    </section>
  );
}