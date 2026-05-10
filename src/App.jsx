import { BellRing, Check, Heart, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "./components/BottomNav.jsx";
import PetScene from "./components/PetScene.jsx";
import PetVideo from "./components/PetVideo.jsx";
import {
  actionItems,
  getActionForReminder,
  getHomeIdleNote,
  homeIdleActions,
  isMealReminderText,
  petAssets,
  routineTemplates,
  weekdayHealingCards,
  styleOptions,
} from "./data/petData.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";

const defaultReminders = {
  enabled: true,
  time: "12:00",
  text: "{petName}来提醒妈妈吃饭啦。",
  reminderSound: true,
  activeRoutine: null,
  routineItems: [],
};

function withPetName(text, petName) {
  return String(text ?? "").replaceAll("{petName}", petName).replaceAll("小井", petName);
}

function toRoutineItems(template) {
  return template.items.map(([time, name, text]) => ({ time, name, text }));
}

function toClockTime(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function toDateOnlyLabel(date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function toWeekdayLabel(date) {
  return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()];
}

function getHomeActivityLabel(action) {
  return action?.homeActivityLabel ?? "适合慢慢陪着";
}

function hashDay(date) {
  return date.getFullYear() * 372 + (date.getMonth() + 1) * 31 + date.getDate();
}

function getHomeTalkLine(action, petName, date) {
  const lines = Array.isArray(action?.homeTalkLines) ? action.homeTalkLines : [];
  if (!lines.length) return `${petName}会一直安静陪着你。`;
  const index = hashDay(date) % lines.length;
  return withPetName(lines[index], petName);
}

function clockToMinutes(time) {
  const [hours = "0", minutes = "0"] = String(time).split(":");
  return Number(hours) * 60 + Number(minutes);
}

function isMealReminder(item) {
  return isMealReminderText(`${item.name} ${item.text}`);
}

function buildReminderSchedule(reminders, petName) {
  const items = [];

  if (reminders.enabled && reminders.time) {
    items.push({
      id: "meal",
      time: reminders.time,
      name: "吃饭",
      text: `${petName}来提醒妈妈吃饭啦。`,
    });
  }

  if (reminders.activeRoutine && Array.isArray(reminders.routineItems) && reminders.routineItems.length) {
    reminders.routineItems.forEach((item, index) => {
      if (!item.time) return;
      const duplicatesMeal = reminders.enabled && item.time === reminders.time && isMealReminder(item);
      if (duplicatesMeal) return;
      items.push({
        id: `routine-${index}-${item.name}`,
        time: item.time,
        name: item.name,
        text: withPetName(item.text, petName),
      });
    });
  }

  return items.sort((a, b) => clockToMinutes(a.time) - clockToMinutes(b.time));
}

function getNextReminder(schedule, now = new Date()) {
  if (!schedule.length) return null;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return schedule.find((item) => clockToMinutes(item.time) >= currentMinutes) ?? schedule[0];
}

function minutesUntilReminder(item, now = new Date()) {
  if (!item?.time) return Infinity;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const reminderMinutes = clockToMinutes(item.time);
  return reminderMinutes >= currentMinutes
    ? reminderMinutes - currentMinutes
    : reminderMinutes + 24 * 60 - currentMinutes;
}

function Header({ title, subtitle }) {
  return (
    <header className="px-6 pb-4 pt-8">
      <p className="text-base font-extrabold text-[var(--muted)]">毛球在家</p>
      <h1 className="mt-2 text-[38px] font-extrabold leading-tight tracking-[-0.02em] text-[var(--ink)]">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-xl font-bold leading-8 text-[var(--muted)]">{subtitle}</p>}
    </header>
  );
}

function Modal({ children, onClose, closeLabel = "我知道啦" }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(24,59,35,0.42)] px-5 backdrop-blur-sm">
      <div className="w-full max-w-[390px] rounded-[34px] bg-white p-6 text-[var(--ink)] shadow-soft">
        {children}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 min-h-14 w-full rounded-full bg-[var(--button)] px-6 py-4 text-xl font-bold text-white"
        >
          {closeLabel}
        </button>
      </div>
    </div>
  );
}

function TodayPage({ userName, petName, reminders, reminderSchedule, nextReminder, soundEnabled }) {
  const [now, setNow] = useState(() => new Date());
  const [idleIndex, setIdleIndex] = useState(0);
  const [quieted, setQuieted] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (quieted) return undefined;
    const timer = window.setInterval(() => {
      setIdleIndex((current) => (current + 1) % homeIdleActions.length);
    }, 11000);
    return () => window.clearInterval(timer);
  }, [quieted]);

  const activePet = useMemo(() => {
    const currentTime = toClockTime(now);
    const currentReminder = reminderSchedule.find((item) => item.time === currentTime);

    if (quieted) {
      return {
        asset: petAssets.lickPaw,
        note: `${petName}低头舔爪，安静陪着妈妈。`,
        muted: true,
        autoPlay: false,
      };
    }

    if (currentReminder) {
      return {
        asset: getActionForReminder(currentReminder),
        note: `${petName}在提醒：${currentReminder.name}`,
        muted: !reminders.reminderSound,
        autoPlay: true,
      };
    }

    if (nextReminder && isMealReminder(nextReminder) && minutesUntilReminder(nextReminder, now) <= 30) {
      return {
        asset: petAssets.meal,
        note: `${petName}已经在旁边等吃饭时间。`,
        muted: !soundEnabled,
        autoPlay: true,
      };
    }

    const idleAction = homeIdleActions[idleIndex % homeIdleActions.length];
    return {
      asset: idleAction,
      note: getHomeIdleNote(idleAction, petName),
      muted: !soundEnabled,
      autoPlay: true,
    };
  }, [idleIndex, nextReminder, now, petName, quieted, reminderSchedule, reminders.reminderSound, soundEnabled]);

  const currentWeekCard = weekdayHealingCards.find((card) => card.dayIndex === now.getDay()) ?? weekdayHealingCards[0];
  const homeWeekCard = currentWeekCard ? { ...currentWeekCard, text: withPetName(currentWeekCard.text, petName) } : null;

  return (
    <PetScene
      sceneType="home"
      videoSrc={petAssets.home.video}
      cutoutVideoSources={petAssets.home.cutoutVideos}
      poster={undefined}
      title={toDateOnlyLabel(now)}
      subtitle={`${petName}${getHomeActivityLabel(activePet.asset)}。`}
      homeNote={getHomeTalkLine(activePet.asset, petName, now)}
      weekdayLabel={toWeekdayLabel(now)}
      weekdayCard={homeWeekCard}
      reminderVideoSrc={activePet.asset.video}
      reminderCutoutVideoSources={activePet.asset.cutoutVideos}
      reminderPoster={activePet.asset.poster}
      petName={petName}
      userName={userName}
      onPetQuiet={() => setQuieted(true)}
      floatingAutoPlay={activePet.autoPlay}
      floatingDefaultMuted={activePet.muted}
      defaultMuted={!soundEnabled}
      volume={0.65}
    />
  );
}

function ActionLibrarySection({ petName, onPreview }) {
  return (
    <section className="rounded-[36px] bg-white p-6 shadow-soft">
      <h2 className="text-3xl font-extrabold text-[var(--ink)]">{petName}的动作素材</h2>
      <p className="mt-2 text-lg font-bold leading-7 text-[var(--muted)]">
        这里先用小井的 6 个小动作，未来可以替换成家里自己的猫猫狗狗。
      </p>
      <div className="mt-5 grid gap-4">
        {actionItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPreview(item)}
            className="action-card relative min-h-[148px] overflow-visible rounded-[30px] bg-[var(--mint)] p-4 text-left shadow-soft"
          >
            <div className="relative z-20 max-w-[58%]">
              <span className="rounded-full bg-white px-3 py-1 text-sm font-extrabold text-[var(--button)]">{item.shortName}</span>
              <p className="mt-3 text-2xl font-extrabold text-[var(--ink)]">{item.name}</p>
              <p className="mt-1 text-base font-bold leading-6 text-[var(--muted)]">{withPetName(item.usage || item.text, petName)}</p>
            </div>
            <PetVideo
              src={item.video}
              cutoutSources={item.cutoutVideos}
              poster={item.poster}
              className="action-pet-video absolute -bottom-2 right-[-14px] z-10 h-[124px] w-[160px] overflow-visible rounded-none"
              autoPlay
              loop
              defaultMuted
              objectFit="contain"
            />
            <div className="absolute bottom-3 left-4 z-20 flex gap-2">
              <span className="rounded-full bg-[var(--button)] px-4 py-2 text-sm font-bold text-white">预览动作</span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[var(--button)]">未来替换</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function RemindersPage({ petName, reminders, setReminders }) {
  const [hint, setHint] = useState(`${petName}已经记住这个时间啦。`);

  function updateReminder(nextValue) {
    setReminders((prev) => ({ ...prev, ...nextValue }));
  }

  return (
    <div className="page-pad">
      <Header title="吃饭提醒" subtitle={`给妈妈设一个固定时间，到点让${petName}轻轻叫一下。`} />
      <section className="mx-6 mb-28 rounded-[36px] bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-extrabold text-[var(--muted)]">当前状态</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[var(--ink)]">每天提醒</h2>
            <p className="mt-2 text-lg font-bold leading-7 text-[var(--muted)]">{reminders.enabled ? `${petName}会准时出现。` : `${petName}先安静陪着。`}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const enabled = !reminders.enabled;
              updateReminder({ enabled });
              setHint(enabled ? `${petName}会准时提醒你。` : `好呀，${petName}先安静陪你。`);
            }}
            className={`h-14 w-24 rounded-full p-1 transition ${reminders.enabled ? "bg-[var(--button)]" : "bg-[var(--line)]"}`}
            aria-label={reminders.enabled ? "关闭吃饭提醒" : "开启吃饭提醒"}
          >
            <span className={`block h-12 w-12 rounded-full bg-white transition ${reminders.enabled ? "translate-x-10" : "translate-x-0"}`} />
          </button>
        </div>

        <label className="mt-7 block">
          <span className="text-lg font-extrabold text-[var(--ink)]">提醒时间</span>
          <input
            type="time"
            value={reminders.time}
            disabled={!reminders.enabled}
            onChange={(event) => {
              updateReminder({ time: event.target.value });
              setHint(`${petName}记住啦，${event.target.value} 会提醒妈妈吃饭。`);
            }}
            className="mt-3 min-h-16 w-full rounded-[28px] border-2 border-[var(--line)] bg-[var(--cream)] px-5 text-3xl font-extrabold text-[var(--ink)] outline-none transition focus:border-[var(--button)] disabled:opacity-45"
          />
        </label>

        <div className="mt-5 rounded-[28px] bg-[var(--cream)] p-5">
          <p className="text-xl font-extrabold text-[var(--ink)]">到点会这样</p>
          <div className="mt-4 rounded-[26px] bg-white p-4 shadow-soft">
            <p className="text-base font-extrabold text-[var(--muted)]">{reminders.time} 页面会弹出</p>
            <p className="mt-2 text-2xl font-extrabold leading-8 text-[var(--ink)]">妈妈，该吃饭啦。</p>
            <p className="mt-1 text-lg font-bold text-[var(--button)]">{petName}在等你。</p>
            <div className="mt-4 rounded-full bg-[var(--button)] px-5 py-3 text-center text-lg font-extrabold text-white">我知道啦</div>
          </div>
          <div className="mt-4 grid gap-2 text-base font-bold leading-6 text-[var(--muted)]">
            <p>页面开着时会弹出轻轻叫提醒，点「我知道啦」就结束。</p>
            <p>关掉浏览器后，V0.1 还不会像手机闹钟那样弹出。</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[30px] bg-[var(--mint)] p-4">
          <div className="flex items-center gap-3 text-xl font-extrabold text-[var(--ink)]">
            <BellRing size={24} />
            {reminders.enabled ? `${reminders.time} 轻轻叫` : "提醒已关闭"}
          </div>
          <p className="mt-2 text-lg font-bold leading-7 text-[var(--muted)]">{hint}</p>
        </div>
      </section>
    </div>
  );
}

function RoutinePage({ petName, reminders, setReminders }) {
  const [hint, setHint] = useState(`好呀，${petName}陪你一起。`);

  function updateRoutineTime(index, time, fallbackItems) {
    setReminders((prev) => {
      const currentItems = Array.isArray(prev.routineItems) && prev.routineItems.length ? prev.routineItems : fallbackItems;
      const nextItems = currentItems.map((item, itemIndex) => (itemIndex === index ? { ...item, time } : item));
      return { ...prev, routineItems: nextItems };
    });
    setHint(`${petName}记住啦，这个时间改好了。`);
  }

  return (
    <div className="page-pad">
      <Header title={`${petName}作息陪伴`} subtitle={`早晨、午休、睡前，都让${petName}用不同小动作陪你。`} />
      <div className="grid gap-6 px-6 pb-28">
        {routineTemplates.map((template) => {
          const active = reminders.activeRoutine === template.id;
          const displayItems = active && Array.isArray(reminders.routineItems) && reminders.routineItems.length ? reminders.routineItems : toRoutineItems(template);
          return (
            <section key={template.id} className={`rounded-[36px] p-6 shadow-soft ${active ? "bg-[var(--mint)]" : "bg-white"}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold leading-tight text-[var(--ink)]">{template.title}</h2>
                  <p className="mt-2 text-lg font-bold leading-7 text-[var(--muted)]">{withPetName(template.description, petName)}</p>
                </div>
                {active && (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--button)] text-white">
                    <Check size={24} />
                  </span>
                )}
              </div>

              <div className="mt-5 grid gap-3">
                {displayItems.map(({ time, name, text }, index) => (
                  <div key={`${template.id}-${time}-${name}`} className="flex gap-4 rounded-[24px] bg-white/78 px-4 py-4">
                    {active ? (
                      <input
                        type="time"
                        value={time}
                        onChange={(event) => updateRoutineTime(index, event.target.value, displayItems)}
                        className="min-h-12 w-[96px] rounded-[18px] border-2 border-[var(--line)] bg-[var(--cream)] px-2 text-xl font-extrabold text-[var(--button)] outline-none focus:border-[var(--button)]"
                        aria-label={`${name}时间`}
                      />
                    ) : (
                      <div className="min-w-[72px] text-2xl font-extrabold text-[var(--button)]">{time}</div>
                    )}
                    <div>
                      <p className="text-xl font-extrabold text-[var(--ink)]">{name}</p>
                      <p className="mt-1 text-base font-bold leading-6 text-[var(--muted)]">{withPetName(text, petName)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {active && <p className="mt-4 rounded-full bg-white/70 px-4 py-3 text-center text-lg font-bold text-[var(--button)]">{hint} 时间可以直接点左边修改。</p>}

              <button
                type="button"
                onClick={() => {
                  setReminders((prev) => ({ ...prev, activeRoutine: template.id, routineItems: toRoutineItems(template) }));
                  setHint(`好呀，${petName}陪你一起。`);
                }}
                className="mt-5 min-h-14 w-full rounded-full bg-[var(--button)] px-6 py-4 text-xl font-bold text-white"
              >
                一键启用
              </button>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function SettingSwitch({ label, checked, onChange }) {
  return (
    <button type="button" onClick={onChange} className="mt-5 flex min-h-16 w-full items-center justify-between rounded-[26px] bg-[var(--cream)] px-5 py-4 text-left">
      <span className="text-xl font-extrabold text-[var(--ink)]">{label}</span>
      <span className={`h-12 w-20 rounded-full p-1 transition ${checked ? "bg-[var(--button)]" : "bg-[var(--line)]"}`}>
        <span className={`block h-10 w-10 rounded-full bg-white transition ${checked ? "translate-x-8" : "translate-x-0"}`} />
      </span>
    </button>
  );
}

function SettingsPage({ userName, setUserName, petName, setPetName, soundEnabled, setSoundEnabled, reminders, setReminders, selectedTheme, setSelectedTheme, showUpload, onPreview }) {
  const [draftUserName, setDraftUserName] = useState(userName);
  const [draftPetName, setDraftPetName] = useState(petName);
  const [hint, setHint] = useState(`${petName}已经在今日页等着啦。`);

  function saveInfo() {
    const nextUserName = draftUserName.trim() || "淡淡";
    const nextPetName = draftPetName.trim() || "小井";
    setUserName(nextUserName);
    setPetName(nextPetName);
    setReminders((prev) => ({ ...prev, text: withPetName(prev.text, nextPetName) }));
    setHint(`${nextPetName}记住啦，以后会陪着${nextUserName}。`);
  }

  return (
    <div className="page-pad">
      <Header title={`设置${petName}`} subtitle={`${petName}在家等着，慢慢把它调成你熟悉的样子。`} />
      <div className="grid gap-5 px-6 pb-28">
        <section className="rounded-[36px] bg-white p-6 shadow-soft">
          <h2 className="text-3xl font-extrabold text-[var(--ink)]">{petName}信息</h2>
          <label className="mt-5 block">
            <span className="text-lg font-extrabold text-[var(--ink)]">昵称</span>
            <input value={draftUserName} onChange={(event) => setDraftUserName(event.target.value)} placeholder="请输入你的昵称" className="mt-3 min-h-14 w-full rounded-[24px] border-2 border-[var(--line)] bg-[var(--cream)] px-5 text-xl font-bold text-[var(--ink)] outline-none focus:border-[var(--button)]" />
          </label>
          <label className="mt-5 block">
            <span className="text-lg font-extrabold text-[var(--ink)]">猫咪名字</span>
            <input value={draftPetName} onChange={(event) => setDraftPetName(event.target.value)} placeholder="请输入猫咪名字" className="mt-3 min-h-14 w-full rounded-[24px] border-2 border-[var(--line)] bg-[var(--cream)] px-5 text-xl font-bold text-[var(--ink)] outline-none focus:border-[var(--button)]" />
          </label>
          <button type="button" onClick={saveInfo} className="mt-5 min-h-14 w-full rounded-full bg-[var(--button)] px-6 py-4 text-xl font-bold text-white">保存信息</button>
          <p className="mt-4 rounded-full bg-[var(--mint)] px-4 py-3 text-center text-lg font-bold text-[var(--button)]">{hint}</p>
        </section>

        <section className="rounded-[36px] bg-white p-6 shadow-soft">
          <h2 className="text-3xl font-extrabold text-[var(--ink)]">声音设置</h2>
          <SettingSwitch label="首页默认静音" checked={!soundEnabled} onChange={() => setSoundEnabled((prev) => !prev)} />
          <SettingSwitch label={`提醒时播放${petName}声音`} checked={reminders.reminderSound} onChange={() => setReminders((prev) => ({ ...prev, reminderSound: !prev.reminderSound }))} />
        </section>

        <section className="rounded-[36px] bg-white p-6 shadow-soft">
          <h2 className="text-3xl font-extrabold text-[var(--ink)]">体验版说明</h2>
          <p className="mt-3 text-xl font-bold leading-8 text-[var(--muted)]">当前是“小井在家”体验版，后续可以上传你家自己的猫猫狗狗。</p>
          <button type="button" onClick={showUpload} className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--button)] px-6 py-4 text-xl font-bold text-white"><Upload size={24} /> 上传家里的它</button>
          <p className="mt-4 rounded-[24px] bg-[var(--cream)] px-4 py-4 text-base font-bold leading-7 text-[var(--muted)]">如果你想把小井放到手机桌面：用 Safari 或 Chrome 打开本页面，点击分享按钮，选择添加到主屏幕。</p>
        </section>

        <ActionLibrarySection petName={petName} onPreview={onPreview} />

        <section className="rounded-[36px] bg-white p-6 shadow-soft">
          <h2 className="text-3xl font-extrabold text-[var(--ink)]">视觉风格</h2>
          <div className="mt-5 grid gap-3">
            {styleOptions.map((option) => {
              const active = selectedTheme === option.id;
              return (
                <button key={option.id} type="button" onClick={() => setSelectedTheme(option.id)} className={`rounded-[26px] p-4 text-left transition ${active ? "bg-[var(--mint)]" : "bg-[var(--cream)]"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xl font-extrabold text-[var(--ink)]">{option.name}</p>
                    {active && <Check className="text-[var(--button)]" size={24} />}
                  </div>
                  <p className="mt-1 text-base font-bold leading-6 text-[var(--muted)]">{option.description}</p>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function PreviewOverlay({ item, petName, onClose }) {
  if (!item) return null;
  return (
    <PetScene
      sceneType={item.sceneType}
      videoSrc={item.video}
      cutoutVideoSources={item.cutoutVideos}
      poster={item.poster}
      title={withPetName(item.previewTitle || item.name, petName).replaceAll("{userName}", "淡淡")}
      subtitle={withPetName(item.previewSubtitle || item.text, petName)}
      actionText="关闭预览"
      onAction={onClose}
      defaultMuted={item.key !== "soft_meow"}
      volume={item.key === "night_yawn" ? 0.42 : 0.8}
      petName={petName}
    />
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("today");
  const [userName, setUserName] = useLocalStorage("app_user_name", "淡淡");
  const [petName, setPetName] = useLocalStorage("app_pet_name", "小井");
  const [soundEnabled, setSoundEnabled] = useLocalStorage("app_sound_enabled", true);
  const [selectedTheme, setSelectedTheme] = useLocalStorage("app_selected_theme", "creamGreen");
  const [reminders, setReminders] = useLocalStorage("app_reminders", defaultReminders);
  const [preview, setPreview] = useState(null);
  const [uploadNotice, setUploadNotice] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem("app_sound_default_on_applied")) {
      setSoundEnabled(true);
      window.localStorage.setItem("app_sound_default_on_applied", "true");
    }
  }, [setSoundEnabled]);

  const normalizedReminders = {
    ...defaultReminders,
    ...(reminders && typeof reminders === "object" && !Array.isArray(reminders) ? reminders : {}),
  };

  const reminderSchedule = useMemo(() => buildReminderSchedule(normalizedReminders, petName), [
    normalizedReminders.activeRoutine,
    normalizedReminders.enabled,
    normalizedReminders.routineItems,
    normalizedReminders.time,
    petName,
  ]);

  const nextReminder = useMemo(() => getNextReminder(reminderSchedule), [reminderSchedule]);
  const appClass = useMemo(() => `app-shell theme-${selectedTheme || "creamGreen"}`, [selectedTheme]);

  return (
    <div className={appClass}>
      <div className="phone-stage">
        {activeTab === "today" && (
          <TodayPage
            userName={userName}
            petName={petName}
            reminders={normalizedReminders}
            reminderSchedule={reminderSchedule}
            nextReminder={nextReminder}
            soundEnabled={soundEnabled}
          />
        )}
        {activeTab === "reminders" && (
          <RemindersPage petName={petName} reminders={normalizedReminders} setReminders={setReminders} />
        )}
        {activeTab === "routine" && (
          <RoutinePage petName={petName} reminders={normalizedReminders} setReminders={setReminders} />
        )}
        {activeTab === "settings" && (
          <SettingsPage
            userName={userName}
            setUserName={setUserName}
            petName={petName}
            setPetName={setPetName}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            reminders={normalizedReminders}
            setReminders={setReminders}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            showUpload={() => setUploadNotice(true)}
            onPreview={setPreview}
          />
        )}

        <BottomNav activeTab={activeTab} onChange={setActiveTab} />

        <PreviewOverlay item={preview} petName={petName} onClose={() => setPreview(null)} />

        {uploadNotice && (
          <Modal onClose={() => setUploadNotice(false)} closeLabel="暂未开放">
            <div className="grid place-items-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--mint)] text-[var(--button)]">
                <Heart size={34} fill="currentColor" />
              </div>
            </div>
            <h2 className="mt-5 text-center text-3xl font-extrabold leading-tight">V0.1 暂未开放上传功能</h2>
            <p className="mt-3 text-center text-xl font-bold leading-8 text-[var(--muted)]">当前先使用{petName}专属素材体验。</p>
          </Modal>
        )}
      </div>
    </div>
  );
}
