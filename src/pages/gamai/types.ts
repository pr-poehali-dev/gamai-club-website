export type Server = "anarchy" | "classic";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  server: Server;
  type: "privilege" | "item";
  duration?: string;
  qty: number;
}

export interface ShopItem {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  type: "privilege" | "item";
  icon: string;
  tag?: string;
}

export interface Neon {
  main: string;
  glow: string;
  bg: string;
  card: string;
  border: string;
  text: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: "vip", name: "VIP", basePrice: 199, description: "Цветной ник, /fly, /heal x3/день", type: "privilege", icon: "⭐", tag: "Популярное" },
  { id: "vip_plus", name: "VIP+", basePrice: 349, description: "Всё из VIP + /god режим, /kit vip", type: "privilege", icon: "💎", tag: "Хит" },
  { id: "elite", name: "ELITE", basePrice: 599, description: "Максимальные права, уникальный префикс", type: "privilege", icon: "👑" },
  { id: "sword", name: "Алмазный меч", basePrice: 89, description: "Зачарованный меч с Резкостью V", type: "item", icon: "⚔️" },
  { id: "elytra", name: "Элитра", basePrice: 149, description: "Элитра с незаконченными крыльями", type: "item", icon: "🪂" },
  { id: "netherite", name: "Неприт-набор", basePrice: 299, description: "Полный сет непритовой брони", type: "item", icon: "🛡️", tag: "Новинка" },
];

export const RULES_ANARCHY = [
  { title: "Общие правила", items: ["Читы на движение запрещены", "Автокликеры — вечный бан", "Дюпы блоков под запретом", "Спавн-зона — нейтральная территория"] },
  { title: "PvP и рейды", items: ["На всей карте разрешён PvP", "Гриф разрешён везде кроме спавна", "Кража — часть игры", "Ловушки разрешены"] },
  { title: "Чат", items: ["Без мата в адрес администрации", "Реклама других серверов — бан", "Флуд: предупреждение → мут"] },
];

export const RULES_CLASSIC = [
  { title: "Общие правила", items: ["Запрещены любые читы", "Уважайте постройки других игроков", "Гриф и кража — бан без предупреждения", "PvP только с согласия обеих сторон"] },
  { title: "Экономика", items: ["Запрещены дюпы и эксплойты", "Честная торговля обязательна", "Фарм мобов в пределах разумного"] },
  { title: "Чат и поведение", items: ["Уважительное общение", "Без политики и религии", "Помогайте новичкам"] },
];

export const DURATION_MULTIPLIERS = [
  { label: "30 дней", key: "30d", mult: 1 },
  { label: "60 дней", key: "60d", mult: 1.7 },
  { label: "90 дней", key: "90d", mult: 2.2 },
  { label: "Навсегда", key: "forever", mult: 3.5 },
];

export const NAVLINKS = ["Главная", "Товары", "О проекте", "Правила", "Контакты"];

export const BG_VIDEOS: Record<Server, string> = {
  anarchy: "https://cdn.pixabay.com/video/2021/08/03/83912-582820496_large.mp4",
  classic: "https://cdn.pixabay.com/video/2020/07/27/46033-444590843_large.mp4",
};

export const TRAILER_VIDEOS: Record<Server, string> = {
  anarchy: "https://www.youtube.com/embed/5kgGDPiDvak?autoplay=1",
  classic: "https://www.youtube.com/embed/MmB9b5njVbA?autoplay=1",
};

export function getNeon(isAnarchy: boolean): Neon {
  return isAnarchy
    ? { main: "#ff3c3c", glow: "rgba(255,60,60,0.4)", bg: "#0a0303", card: "#150404", border: "#ff3c3c55", text: "#ff8080" }
    : { main: "#39ff14", glow: "rgba(57,255,20,0.4)", bg: "#020a03", card: "#041205", border: "#39ff1455", text: "#80ff80" };
}
