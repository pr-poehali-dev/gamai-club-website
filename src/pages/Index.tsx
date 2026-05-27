import { useState, useEffect, useRef } from "react";
import {
  Server, CartItem, ShopItem,
  DURATION_MULTIPLIERS, BG_VIDEOS,
  getNeon,
} from "./gamai/types";
import ServerOverlay from "./gamai/ServerOverlay";
import Navbar from "./gamai/Navbar";
import Sections from "./gamai/Sections";

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
  const [videoModal, setVideoModal] = useState(false);
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
  const neon = getNeon(isAnarchy);

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

  if (serverOverlay) {
    return (
      <ServerOverlay
        overlayServer={overlayServer}
        onSelect={(s) => { setServer(s); setServerOverlay(false); }}
        onHoverEnter={(s) => { setOverlayPaused(true); setOverlayServer(s); }}
        onHoverLeave={() => setOverlayPaused(false)}
      />
    );
  }

  const currentServer = server!;

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
          <source src={BG_VIDEOS[currentServer]} type="video/mp4" />
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

      <Navbar
        neon={neon}
        currentServer={currentServer}
        activeSection={activeSection}
        totalItems={totalItems}
        totalPrice={totalPrice}
        cart={cart}
        cartOpen={cartOpen}
        modalItem={modalItem}
        selectedDuration={selectedDuration}
        videoModal={videoModal}
        onNavClick={setActiveSection}
        onLogoClick={() => setServerOverlay(true)}
        onCartOpen={() => setCartOpen(true)}
        onCartClose={() => setCartOpen(false)}
        onRemoveFromCart={removeFromCart}
        onModalClose={() => setModalItem(null)}
        onDurationSelect={setSelectedDuration}
        onAddToCart={addToCart}
        onVideoModalClose={() => setVideoModal(false)}
      />

      <Sections
        neon={neon}
        currentServer={currentServer}
        activeSection={activeSection}
        openRule={openRule}
        onSectionChange={setActiveSection}
        onVideoModalOpen={() => setVideoModal(true)}
        onOpenRule={setOpenRule}
        onOpenShopModal={setModalItem}
        onAddItemToCart={(item) => addToCart(item)}
      />
    </div>
  );
}
