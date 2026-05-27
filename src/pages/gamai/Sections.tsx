import Icon from "@/components/ui/icon";
import {
  Neon, ShopItem, SHOP_ITEMS, RULES_ANARCHY, RULES_CLASSIC, NAVLINKS,
} from "./types";
import type { Server } from "./types";

interface SectionsProps {
  neon: Neon;
  currentServer: Server;
  activeSection: string;
  openRule: number | null;
  onSectionChange: (section: string) => void;
  onVideoModalOpen: () => void;
  onOpenRule: (i: number | null) => void;
  onOpenShopModal: (item: ShopItem) => void;
  onAddItemToCart: (item: ShopItem) => void;
}

export default function Sections({
  neon, currentServer, activeSection, openRule,
  onSectionChange, onVideoModalOpen, onOpenRule, onOpenShopModal, onAddItemToCart,
}: SectionsProps) {
  const rules = currentServer === "anarchy" ? RULES_ANARCHY : RULES_CLASSIC;

  return (
    <>
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
              <button onClick={() => onSectionChange("Начать")} style={{
                background: neon.main, color: "#000", border: "none", borderRadius: 10,
                padding: "14px 32px", fontSize: 15, fontWeight: 800, cursor: "pointer",
                letterSpacing: "0.1em", boxShadow: `0 0 24px ${neon.glow}`,
                transition: "all 1.2s ease"
              }}>▶ НАЧАТЬ</button>
              <button onClick={onVideoModalOpen} style={{
                background: "none", color: "#fff", border: `1px solid #444`,
                borderRadius: 10, padding: "14px 32px", fontSize: 15, fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.1em",
                display: "flex", alignItems: "center", gap: 8
              }}>
                <Icon name="Play" size={16} /> ВИДЕО
              </button>
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

        {/* START */}
        {activeSection === "Начать" && (
          <section style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px" }}>
            <button onClick={() => onSectionChange("Главная")} style={{
              background: "none", border: "none", color: "#555", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 32
            }}>
              <Icon name="ArrowLeft" size={16} /> Назад
            </button>

            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", marginBottom: 8, letterSpacing: "0.1em" }}>
              КАК <span style={{ color: neon.main, textShadow: `0 0 16px ${neon.main}` }}>НАЧАТЬ ИГРАТЬ</span>
            </h2>
            <p style={{ color: "#555", fontSize: 14, marginBottom: 48 }}>
              {currentServer === "anarchy" ? "💀 Анархия" : "🌲 Классика"} · mc.gamai.club · 1.21.1
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 48 }}>
              {[
                { num: "01", title: "Скачай лаунчер", desc: "Загрузи наш лаунчер — он автоматически установит нужную версию Minecraft и все моды. Работает на Windows, macOS и Linux.", icon: "Download" },
                { num: "02", title: "Войди в аккаунт", desc: "Запусти лаунчер и авторизуйся через свой аккаунт. Если аккаунта нет — регистрация прямо в лаунчере, бесплатно.", icon: "LogIn" },
                { num: "03", title: "Выбери режим", desc: currentServer === "anarchy" ? "Выбери режим «Анархия» — никаких правил, выживает сильнейший. Готовься к жёсткому PvP." : "Выбери режим «Классика» — дружное комьюнити, честное выживание, своя экономика.", icon: "Gamepad2" },
                { num: "04", title: "Подключись к серверу", desc: "В меню «Мультиплеер» добавь сервер: mc.gamai.club — и нажми «Войти». Тебя ждут тысячи игроков!", icon: "Wifi" },
              ].map((step) => (
                <div key={step.num} style={{
                  background: neon.card, border: `1px solid ${neon.border}`,
                  borderRadius: 16, padding: "24px 28px",
                  display: "flex", alignItems: "flex-start", gap: 24,
                  transition: "border-color 1.2s ease"
                }}>
                  <div style={{
                    fontSize: 13, fontWeight: 900, color: neon.main,
                    opacity: 0.4, letterSpacing: "0.1em", flexShrink: 0, paddingTop: 4
                  }}>{step.num}</div>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${neon.main}18`, border: `1px solid ${neon.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <Icon name={step.icon} size={20} style={{ color: neon.main }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "0.05em" }}>{step.title}</div>
                    <div style={{ fontSize: 14, color: "#777", lineHeight: 1.6 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${neon.card} 0%, ${neon.main}10 100%)`,
              border: `1px solid ${neon.main}55`,
              borderRadius: 20, padding: "36px 40px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center"
            }}>
              <div style={{ fontSize: 48 }}>🚀</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Готов начать?</div>
                <div style={{ fontSize: 14, color: "#666", lineHeight: 1.7, maxWidth: 400 }}>
                  Скачай лаунчер, установи и через 5 минут ты уже на сервере. Бесплатно.
                </div>
              </div>
              <a
                href="https://tlauncher.org/en/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: neon.main, color: "#000",
                  borderRadius: 12, padding: "16px 40px",
                  fontSize: 16, fontWeight: 900, cursor: "pointer", letterSpacing: "0.1em",
                  boxShadow: `0 0 32px ${neon.glow}`, textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 10,
                  transition: "all 1.2s ease"
                }}>
                <Icon name="Download" size={20} />
                СКАЧАТЬ ЛАУНЧЕР
              </a>
              <div style={{ fontSize: 12, color: "#444" }}>TLauncher · Бесплатно · Windows / macOS / Linux</div>
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
                      onClick={() => item.type === "privilege" ? onOpenShopModal(item) : onAddItemToCart(item)}
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
                  <button onClick={() => onOpenRule(openRule === i ? null : i)} style={{
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
                <button key={link} onClick={() => onSectionChange(link)} style={{
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
    </>
  );
}
