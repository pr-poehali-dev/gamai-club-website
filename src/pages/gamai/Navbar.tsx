import Icon from "@/components/ui/icon";
import { CartItem, Neon, ShopItem, NAVLINKS, DURATION_MULTIPLIERS, TRAILER_VIDEOS } from "./types";
import type { Server } from "./types";

interface NavbarProps {
  neon: Neon;
  currentServer: Server;
  activeSection: string;
  totalItems: number;
  totalPrice: number;
  cart: CartItem[];
  cartOpen: boolean;
  modalItem: ShopItem | null;
  selectedDuration: string;
  videoModal: boolean;
  onNavClick: (link: string) => void;
  onLogoClick: () => void;
  onCartOpen: () => void;
  onCartClose: () => void;
  onRemoveFromCart: (id: string) => void;
  onModalClose: () => void;
  onDurationSelect: (key: string) => void;
  onAddToCart: (item: ShopItem, duration: string) => void;
  onVideoModalClose: () => void;
}

export default function Navbar({
  neon, currentServer, activeSection, totalItems, totalPrice,
  cart, cartOpen, modalItem, selectedDuration, videoModal,
  onNavClick, onLogoClick, onCartOpen, onCartClose,
  onRemoveFromCart, onModalClose, onDurationSelect, onAddToCart, onVideoModalClose,
}: NavbarProps) {
  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", gap: 8,
        padding: "0 32px", height: 64,
        background: `rgba(0,0,0,0.7)`,
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${neon.border}`,
        transition: "border-color 1.2s ease",
      }}>
        <button onClick={onLogoClick} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 20, fontWeight: 900, letterSpacing: "0.15em",
          marginRight: 24, flexShrink: 0
        }}>
          <span style={{ color: neon.main, textShadow: `0 0 10px ${neon.main}`, transition: "all 1.2s ease" }}>GAMAI</span>
          <span style={{ color: "#fff" }}> CLUB</span>
        </button>

        <div style={{ display: "flex", gap: 4, flex: 1 }}>
          {NAVLINKS.map((link) => (
            <button key={link} onClick={() => onNavClick(link)} style={{
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

        <button onClick={onCartOpen} style={{
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

      {/* CART PANEL */}
      {cartOpen && (
        <div onClick={onCartClose} style={{
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
              <button onClick={onCartClose} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}>
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
                      <button onClick={() => onRemoveFromCart(item.id)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer" }}>
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

      {/* VIDEO MODAL */}
      {videoModal && (
        <div onClick={onVideoModalClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 400,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          backdropFilter: "blur(12px)"
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: "100%", maxWidth: 860, position: "relative"
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 16
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: neon.main, letterSpacing: "0.1em", textShadow: `0 0 10px ${neon.main}` }}>
                {currentServer === "anarchy" ? "💀 ТРЕЙЛЕР АНАРХИИ" : "🌲 ТРЕЙЛЕР КЛАССИКИ"}
              </div>
              <button onClick={onVideoModalClose} style={{
                background: "none", border: "none", color: "#888", cursor: "pointer"
              }}>
                <Icon name="X" size={24} />
              </button>
            </div>
            <div style={{
              position: "relative", paddingBottom: "56.25%", borderRadius: 16, overflow: "hidden",
              border: `1px solid ${neon.border}`, boxShadow: `0 0 40px ${neon.glow}`
            }}>
              <iframe
                src={TRAILER_VIDEOS[currentServer]}
                title="Трейлер сервера"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  border: "none"
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* PRIVILEGE MODAL */}
      {modalItem && (
        <div onClick={onModalClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 300,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          backdropFilter: "blur(8px)"
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: "#0a0a0a", border: `1px solid ${neon.border}`,
            borderRadius: 20, padding: 36, width: "100%", maxWidth: 480, position: "relative"
          }}>
            <button onClick={onModalClose} style={{
              position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#555", cursor: "pointer"
            }}><Icon name="X" size={20} /></button>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{modalItem.icon}</div>
            <h3 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 8 }}>{modalItem.name}</h3>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>{modalItem.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {DURATION_MULTIPLIERS.map((d) => (
                <button key={d.key} onClick={() => onDurationSelect(d.key)} style={{
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
            <button onClick={() => onAddToCart(modalItem, selectedDuration)} style={{
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
    </>
  );
}
