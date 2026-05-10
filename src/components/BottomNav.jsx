import { Bell, CalendarHeart, Heart, Home } from "lucide-react";

const tabs = [
  { id: "today", label: "今日", icon: Home },
  { id: "reminders", label: "提醒", icon: Bell },
  { id: "routine", label: "作息", icon: CalendarHeart },
  { id: "settings", label: "设置", icon: Heart },
];

export default function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-[min(430px,calc(100vw-24px))] -translate-x-1/2 rounded-[30px] border border-[var(--line)] bg-white/95 px-2 py-2 shadow-soft backdrop-blur">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-[24px] text-[15px] font-black transition ${
                active
                  ? "bg-[var(--mint)] text-[var(--ink)]"
                  : "text-[var(--button)] hover:bg-[var(--cream)]"
              }`}
            >
              <Icon size={24} strokeWidth={2.5} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}