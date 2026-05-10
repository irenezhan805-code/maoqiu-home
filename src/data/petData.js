function makeCutoutVideos(key) {
  const base = import.meta.env.BASE_URL || "/";
  const withBase = (path) => {
    const normalizedBase = base.endsWith("/") ? base : `${base}/`;
    return `${normalizedBase}${path.replace(/^\/+/, "")}`;
  };

  return [
    withBase(`videos/cutout/${key}.webm`),
    withBase(`videos/cutout/${key}.mp4`),
    withBase(`videos/cutout/${key}.mov`),
    withBase(`videos/${key}.webm`),
    withBase(`videos/${key}.mp4`),
  ];
}

const publicBase = import.meta.env.BASE_URL || "/";
const withPublicBase = (path) => {
  const normalizedBase = publicBase.endsWith("/") ? publicBase : `${publicBase}/`;
  return `${normalizedBase}${path.replace(/^\/+/, "")}`;
};

const publicCatImages = {
  morningStretch: withPublicBase("images/ChatGPT Image 2026年5月10日 14_47_25 (4).png"),
  nightYawn: withPublicBase("images/ChatGPT Image 2026年5月10日 14_47_19 (1).png"),
  peek: withPublicBase("images/ChatGPT Image 2026年5月10日 14_47_26 (5).png"),
  softMeow: withPublicBase("images/ChatGPT Image 2026年5月10日 14_47_26 (6).png"),
  lickPaw: withPublicBase("images/ChatGPT Image 2026年5月10日 14_47_24 (3).png"),
  turnHead: withPublicBase("images/ChatGPT Image 2026年5月10日 14_47_24 (2).png"),
};

export const petActions = [
  {
    key: "morning_stretch",
    title: "晨起伸懒腰",
    shortName: "早安",
    description: "{petName}刚睡醒，慢慢伸个懒腰。",
    usage: "早安提醒、起床提醒、早晨首页状态",
    homeActivityLabel: "适合慢慢起床",
    homeTalkLines: [
      "{petName}伸了个懒腰，陪你慢慢开始今天。",
      "{petName}刚睡醒，想跟你说早上好。",
      "{petName}慢慢抻一抻，今天也别着急。",
    ],
    image: publicCatImages.morningStretch,
    video: withPublicBase("videos/morning_stretch.webm"),
    scenes: ["morning", "wake", "homeMorning"],
    sceneType: "morning",
    previewTitle: "早上好，今天也慢慢来。",
    previewSubtitle: "{petName}刚睡醒，陪你一起开始今天。",
  },
  {
    key: "night_yawn",
    title: "睡前打哈欠",
    shortName: "晚安",
    description: "{petName}困啦，提醒你早点睡。",
    usage: "晚安提醒、睡前提醒、夜间待机",
    homeActivityLabel: "适合准备睡觉",
    homeTalkLines: [
      "{petName}打了个哈欠，准备陪你睡觉。",
      "{petName}已经困困的，想跟你一起关灯。",
      "{petName}揉揉眼睛，今天辛苦啦。",
    ],
    image: publicCatImages.nightYawn,
    video: withPublicBase("videos/night_yawn.webm"),
    scenes: ["night", "sleep", "bedtime"],
    sceneType: "night",
    previewTitle: "该休息啦，今天辛苦了。",
    previewSubtitle: "{petName}也困啦，陪你一起关灯。",
  },
  {
    key: "peek",
    title: "探头",
    shortName: "探头",
    description: "{petName}悄悄探头看你。",
    usage: "首页角落互动、设置页角落、页面彩蛋感",
    homeActivityLabel: "适合躲猫猫",
    homeTalkLines: [
      "{petName}探出头来，想看看你在做什么。",
      "{petName}偷偷看你一眼，又缩回去。",
      "{petName}在等你发现它。",
    ],
    image: publicCatImages.peek,
    video: withPublicBase("videos/peek.webm"),
    scenes: ["home", "settings", "easterEgg"],
    sceneType: "home",
    previewTitle: "Hi，{userName}",
    previewSubtitle: "{petName}今天也在家。",
  },
  {
    key: "soft_meow",
    title: "轻轻叫",
    shortName: "吃饭",
    description: "{petName}来提醒妈妈吃饭啦。",
    usage: "妈妈吃饭提醒、重要提醒弹窗、点一下听小井叫",
    homeActivityLabel: "适合轻轻叫",
    homeTalkLines: [
      "{petName}轻轻叫了一声，像在提醒你吃饭。",
      "{petName}小声喵喵，想把你叫去吃饭。",
      "{petName}轻轻叫你一下，别忘了吃饭哦。",
    ],
    image: publicCatImages.softMeow,
    video: withPublicBase("videos/soft_meow.webm"),
    scenes: ["meal", "importantReminder"],
    sceneType: "meal",
    previewTitle: "妈妈，该吃饭啦。",
    previewSubtitle: "{petName}在等你。",
  },
  {
    key: "lick_paw",
    title: "低头舔爪",
    shortName: "午休",
    description: "{petName}安静整理自己，陪你慢下来。",
    usage: "午休、松弛待机、作息陪伴",
    homeActivityLabel: "适合躺猫猫",
    homeTalkLines: [
      "{petName}低头舔爪，安静蹭蹭你。",
      "{petName}慢慢整理自己，也陪你慢下来。",
      "{petName}在旁边乖乖待着，像在说别着急。",
    ],
    image: publicCatImages.lickPaw,
    video: withPublicBase("videos/lick_paw.webm"),
    scenes: ["rest", "noon", "routine"],
    sceneType: "rest",
    previewTitle: "休息一下，小井陪你待一会儿。",
    previewSubtitle: "先慢慢来，{petName}在陪你。",
  },
  {
    key: "turn_head",
    title: "转头",
    shortName: "回头",
    description: "{petName}像听到你叫它一样回头看你。",
    usage: "页面切换互动、动作页预览、轻提醒反馈",
    homeActivityLabel: "适合轻轻回头",
    homeTalkLines: [
      "{petName}回头看你，像在认真听你说话。",
      "{petName}听见动静，轻轻转过头来。",
      "{petName}像在说，嗯？我在呢。",
    ],
    image: publicCatImages.turnHead,
    video: withPublicBase("videos/turn_head.webm"),
    scenes: ["interaction", "preview", "lightReminder"],
    sceneType: "interaction",
    previewTitle: "{petName}回头看你。",
    previewSubtitle: "像听到你叫它一样。",
  },
];

function toAsset(action) {
  return {
    id: action.key,
    key: action.key,
    name: action.title,
    title: action.title,
    shortName: action.shortName,
    text: action.description,
    usage: action.usage,
    video: action.video,
    cutoutVideos: makeCutoutVideos(action.key),
    poster: action.image,
    image: action.image,
    scenes: action.scenes,
    sceneType: action.sceneType,
    previewTitle: action.previewTitle,
    previewSubtitle: action.previewSubtitle,
    homeActivityLabel: action.homeActivityLabel,
    homeTalkLines: action.homeTalkLines,
  };
}

export const petActionAssets = petActions.map(toAsset);

export const petAssetsByKey = Object.fromEntries(
  petActionAssets.map((action) => [action.key, action])
);

export const petAssets = {
  morning: petAssetsByKey.morning_stretch,
  wake: petAssetsByKey.morning_stretch,
  homeMorning: petAssetsByKey.morning_stretch,
  night: petAssetsByKey.night_yawn,
  sleep: petAssetsByKey.night_yawn,
  bedtime: petAssetsByKey.night_yawn,
  home: petAssetsByKey.peek,
  settings: petAssetsByKey.peek,
  easterEgg: petAssetsByKey.peek,
  meal: petAssetsByKey.soft_meow,
  importantReminder: petAssetsByKey.soft_meow,
  rest: petAssetsByKey.lick_paw,
  noon: petAssetsByKey.lick_paw,
  routine: petAssetsByKey.lick_paw,
  interaction: petAssetsByKey.turn_head,
  preview: petAssetsByKey.turn_head,
  lightReminder: petAssetsByKey.turnHead,
  morningStretch: petAssetsByKey.morning_stretch,
  nightYawn: petAssetsByKey.night_yawn,
  peek: petAssetsByKey.peek,
  softMeow: petAssetsByKey.soft_meow,
  lickPaw: petAssetsByKey.lick_paw,
  turnHead: petAssetsByKey.turn_head,
};

export const actionItems = petActionAssets;

export const homeIdleActions = [
  petAssets.morningStretch,
  petAssets.peek,
  petAssets.softMeow,
  petAssets.lickPaw,
  petAssets.turnHead,
  petAssets.nightYawn,
];

export function getActionByScene(scene) {
  return petActionAssets.find((action) => action.scenes.includes(scene)) ?? petAssets.turnHead;
}

export function isMealReminderText(text) {
  return /吃饭|早餐|午餐|晚餐|餐/.test(String(text ?? ""));
}

export function getActionForReminder(item) {
  const copy = `${item?.name ?? ""} ${item?.text ?? ""}`;

  if (isMealReminderText(copy)) return petAssets.meal;
  if (/早安|起床|早上|早餐/.test(copy)) return petAssets.morning;
  if (/午休|松弛|休息|慢下来|护眼/.test(copy)) return petAssets.rest;
  if (/晚安|睡|休息啦|关灯/.test(copy)) return petAssets.night;

  return petAssets.lightReminder;
}

export function getHomeIdleNote(action, petName) {
  const notesByKey = {
    morning_stretch: `${petName}伸个懒腰，像刚睡醒一样。`,
    peek: `${petName}悄悄探头看你。`,
    soft_meow: `${petName}轻轻叫了一声。`,
    turn_head: `${petName}听到动静，回头看你。`,
    lick_paw: `${petName}低头舔舔爪，陪妈妈慢下来。`,
    night_yawn: `${petName}打了个哈欠，像在说晚点再忙。`,
  };

  return notesByKey[action?.key] ?? `${petName}在家里慢慢待着。`;
}

export const weekdayHealingCards = [
  {
    dayIndex: 1,
    weekday: "星期一",
    image: publicCatImages.peek,
    text: "{petName}探头看你，新的一周慢慢来。",
    cardBg: "#F8F5EC",
    tagBg: "#E7F0DC",
  },
  {
    dayIndex: 2,
    weekday: "星期二",
    image: publicCatImages.morningStretch,
    text: "{petName}伸了个懒腰，今天轻轻开始。",
    cardBg: "#F7F4EA",
    tagBg: "#E8EFDD",
  },
  {
    dayIndex: 3,
    weekday: "星期三",
    image: publicCatImages.lickPaw,
    text: "{petName}在整理自己，你也可以慢一点。",
    cardBg: "#F6F3E8",
    tagBg: "#E6ECD8",
  },
  {
    dayIndex: 4,
    weekday: "星期四",
    image: publicCatImages.turnHead,
    text: "{petName}回头看你，先做眼前这一小步。",
    cardBg: "#F7F5ED",
    tagBg: "#E9EFD9",
  },
  {
    dayIndex: 5,
    weekday: "星期五",
    image: publicCatImages.softMeow,
    text: "{petName}轻轻叫你，别忘了好好吃饭。",
    cardBg: "#F8F6EF",
    tagBg: "#E7EEDC",
  },
  {
    dayIndex: 6,
    weekday: "星期六",
    image: publicCatImages.lickPaw,
    text: "{petName}陪你慢下来，休息也很重要。",
    cardBg: "#F7F4EA",
    tagBg: "#E8F0DD",
  },
  {
    dayIndex: 0,
    weekday: "星期日",
    image: publicCatImages.nightYawn,
    text: "{petName}已经困啦，今晚早点睡。",
    cardBg: "#F6F1E8",
    tagBg: "#E9E4D5",
  },
];

export const routineTemplates = [
  {
    id: "mom",
    title: "妈妈温柔作息模板",
    description: "吃饭、午休、睡前，都让小井轻轻陪一下。",
    items: [
      ["07:30", "起床", "早上好，今天也慢慢来。"],
      ["08:00", "早餐", "妈妈，该吃早餐啦。"],
      ["12:00", "午餐", "妈妈，该吃午饭啦。"],
      ["13:30", "午休", "休息一下，小井陪你待一会儿。"],
      ["18:00", "晚餐", "晚饭时间到了，先好好吃饭。"],
      ["21:30", "准备休息", "该休息啦，今天辛苦了。"],
    ],
  },
  {
    id: "work",
    title: "在家工作自律模板",
    description: "不催你卷，只提醒你照顾好自己的节奏。",
    items: [
      ["09:30", "开工", "小井回头看你，该慢慢开始啦。"],
      ["11:00", "护眼休息", "休息一下眼睛，别硬撑。"],
      ["12:30", "午餐", "先吃饭，进度可以慢慢来。"],
      ["14:00", "专注工作", "小井轻轻回头，提醒你进入专注时间。"],
      ["16:00", "走动拉伸", "起来走一走，身体比效率重要。"],
      ["18:30", "收工复盘", "今天已经很努力了，可以收工了。"],
      ["23:00", "准备睡觉", "该睡觉啦，别再刷手机了。"],
    ],
  },
];

export const styleOptions = [
  {
    id: "creamGreen",
    name: "真实原生风",
    description: "最像一个给妈妈用的温柔生活 APP。",
  },
  {
    id: "minimal",
    name: "高级极简清冷风",
    description: "更克制，留白更多，绿色更深。",
  },
  {
    id: "soft",
    name: "软萌治愈风",
    description: "薄荷绿更多，按钮和卡片更软。",
  },
  {
    id: "art",
    name: "艺术氛围风",
    description: "暖光和层次更明显，像一本安静的生活小册。",
  },
];