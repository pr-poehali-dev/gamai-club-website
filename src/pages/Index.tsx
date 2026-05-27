import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

type Server = "anarchy" | "classic";

interface CartItem {
  id: string;
  name: string;
  price: number;
  server: Server;
  type: "privilege" | "item";
  duration?: string;
  qty: number;
}

interface ShopItem {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  type: "privilege" | "item";
  icon: string;
  tag?: string;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: "vip", name: "VIP", basePrice: 199, description: "Цветной ник, /fly, /heal x3/день", type: "privilege", icon: "⭐", tag: "Популярное" },
  { id: "vip_plus", name: "VIP+", basePrice: 349, description: "Всё из VIP + /god режим, /kit vip", type: "privilege", icon: "💎", tag: "Хит" },
  { id: "elite", name: "ELITE", basePrice: 599, description: "Максимальные права, уникальный префикс", type: "privilege", icon: "👑" },
  { id: "sword", name: "Алмазный меч", basePrice: 89, description: "Зачарованный меч с Резкостью V", type: "item", icon: "⚔️" },
  { id: "elytra", name: "Элитра", basePrice: 149, description: "Элитра с незаконченными крыльями", type: "item", icon: "🪂" },
  { id: "netherite", name: "Неприт-набор", basePrice: 299, description: "Полный сет непритовой брони", type: "item", icon: "🛡️", tag: "Новинка" },
];

const RULES_ANARCHY = [
  { title: "Общие правила", items: ["Читы на движение запрещены", "Автокликеры — вечный бан", "Дюпы блоков под запретом", "Спавн-зона — нейтральная территория"] },
  { title: "PvP и рейды", items: ["На всей карте разрешён PvP", "Гриф разрешён везде кроме спавна", "Кража — часть игры", "Ловушки разрешены"] },
  { title: "Чат", items: ["Без мата в адрес администрации", "Реклама других серверов — бан", "Флуд: предупреждение → мут"] },
];

const RULES_CLASSIC = [
  { title: "Общие правила", items: ["Запрещены любые читы", "Уважайте постройки других игроков", "Гриф и кража — бан без предупреждения", "PvP только с согласия обеих сторон"] },
  { title: "Экономика", items: ["Запрещены дюпы и эксплойты", "Честная торговля обязательна", "Фарм мобов в пределах разумного"] },
  { title: "Чат и поведение", items: ["Уважительное общение", "Без политики и религии", "Помогайте новичкам"] },
];

const DURATION_MULTIPLIERS = [
  { label: "30 дней", key: "30d", mult: 1 },
  { label: "60 дней", key: "60d", mult: 1.7 },
  { label: "90 дней", key: "90d", mult: 2.2 },
  { label: "Навсегда", key: "forever", mult: 3.5 },
];

const NAVLINKS = ["Главная", "Товары", "О проекте", "Правила", "Контакты"];

// Видео по теме для каждого режима
const VIDEOS = {
  anarchy: "https://cdn.pixabay.com/video/2021/08/03/83912-582820496_large.mp4",
  classic: "https://cdn.pixabay.com/video/2020/07/27/46033-444590843_large.mp4",
};

export default function Index() {
  const [server, setServer] = useState<Server | null>(null);
  const [overlayServer, setOverlayServer] = useState<Server>("anarchy");
  const [activeSection, setActiveSection] = useState("Главная");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [modalItem, setModalItem] = useState<ShopItem | null>(null);
  const [selectedDuration, setSelectedDuration] = useState("30d");
  const [openRule, setOpenRule] = useState<number | null>(null);
  const [serverOverlay, setServerOverlay] = useState(true);
  const [overlayPaused, setOverlayPaused] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Автосмена ТОЛЬКО на оверлее выбора сервера
  useEffect(() => {
    if (!serverOverlay) return;
    if (overlayPaused) return;
    autoRef.current = setInterval(() => {
      setOverlayServer((s) => (s === "anarchy" ? "classic" : "anarchy"));
    }, 3000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [serverOverlay, overlayPaused]);

  const isAnarchy = serverOverlay ? overlayServer === "anarchy" : server === "anarchy";

  const neon = isAnarchy
    ? { main: "#ff3c3c", glow: "rgba(255,60,60,0.4)", bg: "#0a0303", card: "#150404", border: "#ff3c3c55", text: "#ff8080" }
    : { main: "#39ff14", glow: "rgba(57,255,20,0.4)", bg: "#020a03", card: "#041205", border: "#39ff1455", text: "#80ff80" };

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const addToCart = (item: ShopItem, duration?: string) => {
    const dur = duration || "30d";
    const mult = DURATION_MULTIPLIERS.find((d) => d.key === dur)?.mult || 1;
    const price = item.type === "privilege" ? Math.round(item.basePrice * mult) : item.basePrice;
    const id = `${item.id}_${dur}_${server}`;
    setCart((prev) => {
      const ex = prev.find((c) => c.id === id);
      if (ex) return prev.map((c) => c.id === id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id, name: item.name, price, server: server!, type: item.type, duration: dur, qty: 1 }];
    });
    setModalItem(null);
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart((p) => p.filter((c) => c.id !== id));

  // Оверлей выбора сервера
  if (serverOverlay) {
    const overlayNeon = overlayServer === "anarchy"
      ? { main: "#ff3c3c", glow: "rgba(255,60,60,0.15)", border: "#ff3c3c55" }
      : { main: "#39ff14", glow: "rgba(57,255,20,0.15)", border: "#39ff1455" };

    return (
      <div style={{
        position: "fixed", inset: 0, background: "#050505", display: "flex",
        alignItems: "center", justifyContent: "center", flexDirection: "column",
        fontFamily: "'Rajdhani', 'Montserrat', sans-serif",
        transition: "background 0.8s ease"
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 40%, ${overlayNeon.glow} 0%, transparent 70%)`,
          transition: "background 0.8s ease"
        }} />

        <div style={{
          fontSize: "clamp(36px, 8vw, 80px)", fontWeight: 900, letterSpacing: "0.2em",
          color: "#fff", marginBottom: 8, position: "relative",
          textShadow: "0 0 40px rgba(255,255,255,0.3)"
        }}>
          <span style={{ color: overlayNeon.main, textShadow: `0 0 20px ${overlayNeon.main}`, transition: "all 0.8s ease" }}>GAMAI</span>
          <span style={{ color: "#fff" }}> CLUB</span>
        </div>

        <div style={{ color: "#888", fontSize: 16, letterSpacing: "0.3em", marginBottom: 56, textTransform: "uppercase" }}>
          Выбери свой сервер
        </div>

        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center", padding: "0 20px" }}>
          {[
            { key: "anarchy" as Server, icon: "💀", name: "АНАРХИЯ", desc: "Никаких правил. Выживает сильнейший.", color: "#ff3c3c", glow: "rgba(255,60,60,0.3)" },
            { key: "classic" as Server, icon: "🌲", name: "КЛАССИКА", desc: "Выживание, стройка, дружное комьюнити.", color: "#39ff14", glow: "rgba(57,255,20,0.3)" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => { setServer(s.key); setServerOverlay(false); }}
              onMouseEnter={() => { setOverlayPaused(true); setOverlayServer(s.key); }}
              onMouseLeave={() => setOverlayPaused(false)}
              style={{
                background: `linear-gradient(135deg, #0d0d0d 0%, rgba(${s.key === "anarchy" ? "255,60,60" : "57,255,20"},0.08) 100%)`,
                border: `2px solid ${overlayServer === s.key ? s.color : s.color + "33"}`,
                borderRadius: 16, padding: "36px 44px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                transition: "all 0.3s ease",
                boxShadow: overlayServer === s.key ? `0 0 40px ${s.glow}` : `0 0 10px ${s.glow}`,
                transform: overlayServer === s.key ? "translateY(-8px) scale(1.03)" : "none",
                minWidth: 220
              }}>
              <div style={{ fontSize: 56 }}>{s.icon}</div>
              <div style={{ color: s.color, fontSize: 22, fontWeight: 800, letterSpacing: "0.2em", textShadow: `0 0 12px ${s.color}` }}>{s.name}</div>
              <div style={{ color: "#aaa", fontSize: 13, textAlign: "center", maxWidth: 180, lineHeight: 1.5 }}>{s.desc}</div>
              <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>1.21.1 · mc.gamai.club</div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 48, display: "flex", gap: 8, alignItems: "center" }}>
          {(["anarchy", "classic"] as Server[]).map((s) => (
            <div key={s} style={{
              width: overlayServer === s ? 24 : 8, height: 8, borderRadius: 4,
              background: overlayServer === s ? overlayNeon.main : "#333",
              transition: "all 0.4s ease"
            }} />
          ))}
        </div>
      </div>
    );
  }

  const currentServer = server!;
  const rules = currentServer === "anarchy" ? RULES_ANARCHY : RULES_CLASSIC;
  const videoSrc = VIDEOS[currentServer];

  return (
    <div style={{
      minHeight: "100vh",
      background: neon.bg,
      color: "#e8e8e8",
      fontFamily: "'Rajdhani', 'Montserrat', sans-serif",
      transition: "background 1.2s ease",
      overflowX: "hidden",
    }}>
      {/* VIDEO BG */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <video key={currentServer} autoPlay loop muted playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }}>
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${neon.glow} 0%, transparent 60%)`,
          transition: "background 1.2s ease"
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(${neon.border} 1px, transparent 1px), linear-gradient(90deg, ${neon.border} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.3,
        }} />
      </div>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", gap: 8,
        padding: "0 32px", height: 64,
        background: `rgba(0,0,0,0.7)`,
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${neon.border}`,
        transition: "border-color 1.2s ease",
      }}>
        <button onClick={() => setServerOverlay(true)} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 20, fontWeight: 900, letterSpacing: "0.15em",
          marginRight: 24, flexShrink: 0
        }}>
          <span style={{ color: neon.main, textShadow: `0 0 10px ${neon.main}`, transition: "all 1.2s ease" }}>GAMAI</span>
          <span style={{ color: "#fff" }}> CLUB</span>
        </button>

        <div style={{ display: "flex", gap: 4, flex: 1 }}>
          {NAVLINKS.map((link) => (
            <button key={link} onClick={() => setActiveSection(link)} style={{
              background: activeSection === link ? `${neon.border}` : "none",
              border: activeSection === link ? `1px solid ${neon.border}` : "1px solid transparent",
              borderRadius: 8, color: activeSection === link ? neon.main : "#aaa",
              padding: "6px 16px", cursor: "pointer", fontSize: 14, fontWeight: 600,
              letterSpacing: "0.05em", transition: "all 0.2s ease",
              textShadow: activeSection === link ? `0 0 8px ${neon.main}` : "none",
            }}>{link}</button>
          ))}
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: neon.border, border: `1px solid ${neon.main}`,
          borderRadius: 8, padding: "6px 14px",
          color: neon.main, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
          textShadow: `0 0 8px ${neon.main}`, transition: "all 1.2s ease",
          marginRight: 12
        }}>
          {currentServer === "anarchy" ? "💀 Анархия" : "🌲 Классика"}
        </div>

        <button onClick={() => setCartOpen(true)} style={{
          position: "relative", background: "none", border: `1px solid ${neon.border}`,
          borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#fff"
        }}>
          <Icon name="ShoppingCart" size={20} />
          {totalItems > 0 && (
            <span style={{
              position: "absolute", top: -6, right: -6, background: neon.main,
              color: "#000", borderRadius: "50%", width: 18, height: 18,
              fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center"
            }}>{totalItems}</span>
          )}
        </button>
      </nav>

      {/* MAIN */}
      <main style={{ position: "relative", zIndex: 1, paddingTop: 64 }}>

        {/* HERO */}
        {activeSection === "Главная" && (
          <section style={{
            minHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 20px"
          }}>
            <div style={{
              background: `${neon.border}`, border: `1px solid ${neon.main}`,
              borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700,
              color: neon.main, letterSpacing: "0.2em", marginBottom: 24,
              textShadow: `0 0 8px ${neon.main}`, transition: "all 1.2s ease",
            }}>
              {currentServer === "anarchy" ? "💀 АНАРХИЯ" : "🌲 КЛАССИКА"} · ONLINE
            </div>

            <h1 style={{
              fontSize: "clamp(52px, 12vw, 130px)", fontWeight: 900, lineHeight: 1,
              letterSpacing: "0.05em", margin: "0 0 16px",
              textShadow: `0 0 60px ${neon.glow}`,
              transition: "text-shadow 1.2s ease"
            }}>
              <span style={{ color: neon.main, textShadow: `0 0 40px ${neon.main}`, transition: "all 1.2s ease" }}>GAMAI</span>
              <span style={{ color: "#fff" }}> CLUB</span>
            </h1>

            <p style={{ color: "#888", fontSize: 18, marginBottom: 32, letterSpacing: "0.1em" }}>
              Minecraft {currentServer === "anarchy" ? "анархия" : "классика"} · Версия 1.21.1
            </p>

            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(0,0,0,0.5)", border: `1px solid ${neon.border}`,
              borderRadius: 10, padding: "10px 20px", marginBottom: 36,
              transition: "border-color 1.2s ease"
            }}>
              <span style={{ color: "#666", fontSize: 12, letterSpacing: "0.1em" }}>СЕРВЕР</span>
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 12px" }}>mc.gamai.club</span>
              <button onClick={() => navigator.clipboard.writeText("mc.gamai.club")} style={{
                background: "none", border: "none", color: neon.main, cursor: "pointer"
              }}>
                <Icon name="Copy" size={14} />
              </button>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 56, flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={() => setActiveSection("Товары")} style={{
                background: neon.main, color: "#000", border: "none", borderRadius: 10,
                padding: "14px 32px", fontSize: 15, fontWeight: 800, cursor: "pointer",
                letterSpacing: "0.1em", boxShadow: `0 0 24px ${neon.glow}`,
                transition: "all 1.2s ease"
              }}>МАГАЗИН</button>
              <button onClick={() => setActiveSection("О проекте")} style={{
                background: "none", color: "#fff", border: `1px solid #444`,
                borderRadius: 10, padding: "14px 32px", fontSize: 15, fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.1em"
              }}>О ПРОЕКТЕ</button>
            </div>

            <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
              {[["247", "Онлайн"], ["12 408", "Игроков"], [currentServer === "anarchy" ? "Анархия" : "Выживание", "Режим"]].map(([val, label], i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: neon.main, textShadow: `0 0 12px ${neon.main}`, transition: "all 1.2s ease" }}>{val}</div>
                  <div style={{ fontSize: 12, color: "#555", letterSpacing: "0.15em", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SHOP */}
        {activeSection === "Товары" && (
          <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", marginBottom: 8, letterSpacing: "0.1em" }}>
              <span style={{ color: neon.main, textShadow: `0 0 16px ${neon.main}` }}>МАГАЗИН</span>
            </h2>
            <p style={{ color: "#666", marginBottom: 40, fontSize: 14 }}>
              Сервер: <strong style={{ color: neon.text }}>{currentServer === "anarchy" ? "💀 Анархия" : "🌲 Классика"}</strong>
            </p>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20
            }}>
              {SHOP_ITEMS.map((item) => (
                <div key={item.id} style={{
                  background: neon.card, border: `1px solid ${neon.border}`,
                  borderRadius: 16, padding: 24, position: "relative",
                  transition: "border-color 1.2s ease"
                }}>
                  {item.tag && (
                    <span style={{
                      position: "absolute", top: 16, right: 16,
                      background: neon.main, color: "#000", fontSize: 10,
                      fontWeight: 800, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.1em"
                    }}>{item.tag}</span>
                  )}
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "0.1em" }}>{item.name}</h3>
                  <p style={{ color: "#666", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>{item.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: neon.main, textShadow: `0 0 10px ${neon.main}` }}>
                      {item.basePrice} ₽{item.type === "privilege" ? "/мес" : ""}
                    </span>
                    <button
                      onClick={() => item.type === "privilege" ? setModalItem(item) : addToCart(item)}
                      style={{
                        width: "100%", background: neon.main, color: "#000",
                        border: "none", borderRadius: 8, padding: "12px",
                        fontSize: 14, fontWeight: 800, cursor: "pointer", letterSpacing: "0.05em",
                        boxShadow: `0 0 16px ${neon.glow}`, transition: "all 1.2s ease",
                        marginLeft: 12
                      }}>Купить</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ABOUT */}
        {activeSection === "О проекте" && (
          <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", marginBottom: 40, letterSpacing: "0.1em" }}>
              О <span style={{ color: neon.main, textShadow: `0 0 16px ${neon.main}` }}>ПРОЕКТЕ</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, marginBottom: 48 }}>
              {[
                { img: "https://cdn.poehali.dev/projects/897a86e2-a92a-4dd3-8b94-4ad20b79753d/files/ff8ac56e-9edd-405f-aaa2-52a78dc2b250.jpg", icon: "💀", title: "Анархия", text: "Никаких правил — чистый хаос. Строй, захватывай территории, выживай в мире где каждый сам за себя. Для настоящих воинов." },
                { img: "https://cdn.poehali.dev/projects/897a86e2-a92a-4dd3-8b94-4ad20b79753d/files/5b335896-a43b-4cba-b2bd-9fe6da1d9ebf.jpg", icon: "🌲", title: "Классика", text: "Дружное комьюнити, честное выживание, уникальная экономика. Стройте мегаполисы, торгуйте, развивайтесь." },
              ].map((card) => (
                <div key={card.title} style={{
                  background: neon.card, border: `1px solid ${neon.border}`,
                  borderRadius: 16, overflow: "hidden", transition: "border-color 1.2s ease"
                }}>
                  <img src={card.img} alt={card.title} style={{ width: "100%", height: 200, objectFit: "cover" }} />
                  <div style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: neon.main, marginBottom: 12, textShadow: `0 0 10px ${neon.main}` }}>
                      {card.icon} {card.title}
                    </h3>
                    <p style={{ color: "#888", lineHeight: 1.7, fontSize: 14 }}>{card.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16 }}>
              {[["⚡", "TPS 20", "Всегда"], ["🖥️", "Xeon Gold", "Процессор"], ["🔒", "DDoS Guard", "Защита"], ["⏱️", "99.9%", "Аптайм"]].map(([icon, val, label]) => (
                <div key={val} style={{
                  background: neon.card, border: `1px solid ${neon.border}`,
                  borderRadius: 12, padding: "20px", textAlign: "center", transition: "border-color 1.2s ease"
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: neon.main }}>{val}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RULES */}
        {activeSection === "Правила" && (
          <section style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", marginBottom: 8, letterSpacing: "0.1em" }}>
              <span style={{ color: neon.main, textShadow: `0 0 16px ${neon.main}` }}>ПРАВИЛА</span>
            </h2>
            <p style={{ color: "#555", marginBottom: 40, fontSize: 14 }}>
              {currentServer === "anarchy" ? "💀 Анархия" : "🌲 Классика"} · Версия 1.21.1
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {rules.map((section, i) => (
                <div key={i} style={{
                  background: neon.card, border: `1px solid ${neon.border}`,
                  borderRadius: 12, overflow: "hidden", transition: "border-color 1.2s ease"
                }}>
                  <button onClick={() => setOpenRule(openRule === i ? null : i)} style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "18px 24px", background: "none", border: "none", cursor: "pointer",
                    color: "#fff", fontSize: 16, fontWeight: 700, letterSpacing: "0.05em"
                  }}>
                    {section.title}
                    <Icon name={openRule === i ? "ChevronUp" : "ChevronDown"} size={18} />
                  </button>
                  {openRule === i && (
                    <div style={{ padding: "0 24px 20px" }}>
                      {section.items.map((rule, j) => (
                        <div key={j} style={{
                          display: "flex", alignItems: "flex-start", gap: 10,
                          padding: "8px 0", borderTop: j === 0 ? `1px solid ${neon.border}` : "none"
                        }}>
                          <span style={{ color: neon.main, fontSize: 16, marginTop: 1, flexShrink: 0 }}>›</span>
                          <span style={{ color: "#aaa", fontSize: 14, lineHeight: 1.5 }}>{rule}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACTS */}
        {activeSection === "Контакты" && (
          <section style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", marginBottom: 40, letterSpacing: "0.1em" }}>
              <span style={{ color: neon.main, textShadow: `0 0 16px ${neon.main}` }}>КОНТАКТЫ</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              {[
                { label: "Discord", icon: "MessageCircle", val: "discord.gg/gamai", color: "#5865F2" },
                { label: "Telegram", icon: "Send", val: "@gamai_club", color: "#26A5E4" },
                { label: "VK", icon: "Users", val: "vk.com/gamai", color: "#4680C2" },
                { label: "Email", icon: "Mail", val: "support@gamai.club", color: neon.main },
              ].map((c) => (
                <div key={c.label} style={{
                  background: neon.card, border: `1px solid ${neon.border}`,
                  borderRadius: 14, padding: "24px", display: "flex", alignItems: "center", gap: 16,
                  transition: "border-color 1.2s ease"
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: `${c.color}22`,
                    border: `1px solid ${c.color}44`, display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Icon name={c.icon} size={20} style={{ color: c.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: `1px solid ${neon.border}`,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(16px)",
        transition: "border-color 1.2s ease",
        padding: "40px 32px 24px"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "0.15em", marginBottom: 12 }}>
                <span style={{ color: neon.main, textShadow: `0 0 10px ${neon.main}` }}>GAMAI</span>
                <span style={{ color: "#fff" }}> CLUB</span>
              </div>
              <p style={{ color: "#555", fontSize: 13, lineHeight: 1.7 }}>
                Лучший Minecraft сервер с двумя режимами — анархия и классика. Версия 1.21.1.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#555", letterSpacing: "0.2em", marginBottom: 16 }}>РАЗДЕЛЫ</div>
              {NAVLINKS.map((link) => (
                <button key={link} onClick={() => setActiveSection(link)} style={{
                  display: "block", background: "none", border: "none", color: "#666",
                  fontSize: 14, cursor: "pointer", padding: "4px 0", letterSpacing: "0.05em",
                  textAlign: "left", transition: "color 0.2s"
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = neon.main)}
                  onMouseLeave={e => (e.currentTarget.style.color = "#666")}
                >{link}</button>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#555", letterSpacing: "0.2em", marginBottom: 16 }}>СЕРВЕР</div>
              <div style={{ color: "#666", fontSize: 14, lineHeight: 2 }}>
                <div>IP: <span style={{ color: neon.main }}>mc.gamai.club</span></div>
                <div>Версия: <span style={{ color: "#aaa" }}>1.21.1</span></div>
                <div>Режим: <span style={{ color: "#aaa" }}>{currentServer === "anarchy" ? "💀 Анархия" : "🌲 Классика"}</span></div>
                <div>TPS: <span style={{ color: neon.main }}>20.0</span></div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#555", letterSpacing: "0.2em", marginBottom: 16 }}>СООБЩЕСТВО</div>
              {[["Discord", "MessageCircle", "#5865F2"], ["Telegram", "Send", "#26A5E4"], ["VK", "Users", "#4680C2"]].map(([name, icon, color]) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                  <Icon name={icon} size={16} style={{ color }} />
                  <span style={{ color: "#666", fontSize: 13 }}>{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            borderTop: `1px solid ${neon.border}`,
            paddingTop: 20, display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: 12,
            transition: "border-color 1.2s ease"
          }}>
            <span style={{ color: "#444", fontSize: 12 }}>© 2024 GAMAI CLUB. Все права защищены.</span>
            <span style={{ color: "#333", fontSize: 12 }}>Не является официальным продуктом Mojang Studios</span>
          </div>
        </div>
      </footer>

      {/* CART PANEL */}
      {cartOpen && (
        <div onClick={() => setCartOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, backdropFilter: "blur(4px)"
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 380,
            background: "#0a0a0a", borderLeft: `1px solid ${neon.border}`,
            display: "flex", flexDirection: "column", transition: "border-color 1.2s ease"
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "20px 24px", borderBottom: `1px solid ${neon.border}`
            }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.1em" }}>КОРЗИНА</span>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}>
                <Icon name="X" size={20} />
              </button>
            </div>
            {cart.length === 0 ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontSize: 14 }}>
                Корзина пуста
              </div>
            ) : (
              <>
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{
                      background: neon.card, border: `1px solid ${neon.border}`,
                      borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>
                          {item.server === "anarchy" ? "💀 Анархия" : "🌲 Классика"}
                          {item.duration && item.duration !== "forever" ? ` · ${item.duration}` : item.duration === "forever" ? " · Навсегда" : ""}
                        </div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: neon.main }}>{item.price} ₽</div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer" }}>
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "20px 24px", borderTop: `1px solid ${neon.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ color: "#888" }}>Итого:</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: neon.main, textShadow: `0 0 10px ${neon.main}` }}>{totalPrice} ₽</span>
                  </div>
                  <button style={{
                    width: "100%", background: neon.main, color: "#000",
                    border: "none", borderRadius: 10, padding: "14px",
                    fontSize: 15, fontWeight: 800, cursor: "pointer", letterSpacing: "0.05em",
                    boxShadow: `0 0 20px ${neon.glow}`
                  }}>ОФОРМИТЬ ЗАКАЗ</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* PRIVILEGE MODAL */}
      {modalItem && (
        <div onClick={() => setModalItem(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 300,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          backdropFilter: "blur(8px)"
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: "#0a0a0a", border: `1px solid ${neon.border}`,
            borderRadius: 20, padding: 36, width: "100%", maxWidth: 480, position: "relative"
          }}>
            <button onClick={() => setModalItem(null)} style={{
              position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#555", cursor: "pointer"
            }}><Icon name="X" size={20} /></button>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{modalItem.icon}</div>
            <h3 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 8 }}>{modalItem.name}</h3>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>{modalItem.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {DURATION_MULTIPLIERS.map((d) => (
                <button key={d.key} onClick={() => setSelectedDuration(d.key)} style={{
                  background: selectedDuration === d.key ? neon.main : neon.card,
                  border: `1px solid ${selectedDuration === d.key ? neon.main : neon.border}`,
                  borderRadius: 10, padding: "14px", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  transition: "all 0.2s ease"
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: selectedDuration === d.key ? "#000" : "#aaa" }}>{d.label}</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: selectedDuration === d.key ? "#000" : neon.main }}>
                    {Math.round(modalItem.basePrice * d.mult)} ₽
                  </span>
                </button>
              ))}
            </div>
            <button onClick={() => addToCart(modalItem, selectedDuration)} style={{
              width: "100%", background: neon.main, color: "#000",
              border: "none", borderRadius: 10, padding: "16px",
              fontSize: 15, fontWeight: 800, cursor: "pointer", letterSpacing: "0.05em",
              boxShadow: `0 0 24px ${neon.glow}`
            }}>
              В КОРЗИНУ — {Math.round(modalItem.basePrice * (DURATION_MULTIPLIERS.find(d => d.key === selectedDuration)?.mult || 1))} ₽
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
