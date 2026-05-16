"use client";

import { useState, useEffect, useCallback } from "react";

// ─── TYPES ───────────────────────────────────────────────
type SectionId = "accueil" | "boutique" | "menu" | "apropos" | "reservations";

interface NavItem {
  id: SectionId;
  label: string;
  emoji: string;
}

// ─── CONSTANTES ──────────────────────────────────────────
const WHATSAPP_NUMBER = "241XXXXXXXXX"; // ← Remplace par ton vrai numéro
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Chef Omiel, j'ai parcouru la maquette. Je suis prêt à activer mon écosystème digital. Parlons-en."
);

const NAV_ITEMS: NavItem[] = [
  { id: "accueil", label: "Accueil", emoji: "🏠" },
  { id: "boutique", label: "La Boutique des Livres", emoji: "🛍️" },
  { id: "menu", label: "Le Menu Digital", emoji: "🍽️" },
  { id: "apropos", label: "Votre Histoire", emoji: "📖" },
  { id: "reservations", label: "Réservations", emoji: "📅" },
];

// ─── COMPOSANT PRINCIPAL ─────────────────────────────────
export default function ChefOmielPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("accueil");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ─── Détection du scroll pour l'ombre du header ─────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── Scroll vers la section active ─────────────────────
  const scrollToSection = useCallback((id: SectionId) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  // ─── Intersection Observer pour mise à jour auto ────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ─── RENDU ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* ─── HEADER ──────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-neutral-950/98 backdrop-blur-2xl border-b border-amber-500/10 shadow-lg shadow-amber-500/5"
            : "bg-neutral-950/90 backdrop-blur-xl border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <button
              onClick={() => scrollToSection("accueil")}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-neutral-950 font-black text-lg sm:text-xl shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow duration-300">
                CO
                <div className="absolute -inset-1 rounded-full bg-amber-400/20 blur-md -z-10 group-hover:bg-amber-400/30 transition-colors duration-300" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-wider gold-text hidden xs:inline">
                CHEF OMIEL
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeSection === item.id
                      ? "text-amber-400 bg-amber-400/10"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                  }`}
                >
                  <span className="hidden xl:inline mr-1.5">{item.emoji}</span>
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Bouton CTA Header + Burger Mobile */}
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-sm rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-95"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>

              {/* Burger Mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-800/50 border border-neutral-700/50"
                aria-label="Menu"
              >
                <div className="w-5 h-4 relative flex flex-col justify-between">
                  <span
                    className={`block h-0.5 w-full bg-amber-400 rounded-full transition-all duration-300 ${
                      mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-amber-400 rounded-full transition-all duration-300 ${
                      mobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-amber-400 rounded-full transition-all duration-300 ${
                      mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-400 ${
              mobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
            }`}
          >
            <nav className="flex flex-col gap-1 pt-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeSection === item.id
                      ? "text-amber-400 bg-amber-400/10 border border-amber-400/20"
                      : "text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/50"
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  {item.label}
                </button>
              ))}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-3 px-4 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-sm rounded-xl active:scale-95 transition-transform"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Activer via WhatsApp
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* ─── CONTENU PRINCIPAL ───────────────────────── */}
      <main className="pt-20 sm:pt-24">
        
        {/* ═══════════════════════════════════════════════
            SECTION ACCUEIL
            ═══════════════════════════════════════════════ */}
        <SectionWrapper id="accueil" variant="hero">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Texte */}
            <div className="lg:col-span-3 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">
                🏠 La page d&apos;accueil
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight">
                Chef Omiel, voici à quoi{" "}
                <span className="gold-text">votre site web</span>{" "}
                va ressembler
              </h1>

              <p className="text-neutral-400 text-lg">
                Chaque section que vous voyez ci-dessous est une partie de votre futur site. 
                Je vous explique tout, simplement.
              </p>

              {/* ─── EXPLICATION SIMPLE ACCUEIL ────────── */}
              <div className="space-y-5 text-base leading-relaxed">
                {/* Ce que vous voyez */}
                <div className="bg-neutral-900/50 rounded-2xl p-5 border border-neutral-800">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">
                    👀 Ce que vous regardez en ce moment
                  </p>
                  <p className="text-neutral-300">
                    Cette page, c&apos;est <span className="text-white font-semibold">votre page d&apos;accueil</span> — 
                    la première chose que les gens verront en tapant votre nom sur Google.
                  </p>
                </div>

                {/* Ce qu'on met dedans */}
                <div className="bg-neutral-900/50 rounded-2xl p-5 border border-neutral-800">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">
                    🎥 Ce qu&apos;on va mettre ici
                  </p>
                  <ul className="space-y-2 text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">1.</span>
                      <span><span className="text-white font-medium">Une vidéo de vous en cuisine</span> — avec votre musique Hip-hop en fond, pour que les gens ressentent votre univers en 3 secondes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">2.</span>
                      <span><span className="text-white font-medium">Un message clair</span> qui dit qui vous êtes et ce que vous proposez.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">3.</span>
                      <span><span className="text-white font-medium">Des boutons</span> qui dirigent les gens vers vos livres ou vos réservations.</span>
                    </li>
                  </ul>
                </div>

                {/* Résultat */}
                <div className="bg-green-500/5 rounded-2xl p-5 border border-green-500/20">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-3">
                    ✅ Le résultat pour vous
                  </p>
                  <p className="text-neutral-300">
                    Quand un Gabonais ou un touriste cherche &ldquo;gastronomie gabonaise&rdquo; sur Google, 
                    <span className="text-white font-medium"> c&apos;est vous qu&apos;il trouve en premier</span>. 
                    Plus besoin de dépendre de Facebook pour être visible.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => scrollToSection("boutique")}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95"
                >
                  Voir la Boutique →
                </button>
                <button
                  onClick={() => scrollToSection("reservations")}
                  className="px-6 py-3.5 bg-neutral-800/80 text-amber-400 font-bold rounded-xl border border-amber-400/20 hover:bg-neutral-700/80 hover:border-amber-400/40 transition-all duration-300 active:scale-95"
                >
                  Voir les Réservations →
                </button>
              </div>
            </div>

            {/* Visuel */}
            <div className="lg:col-span-2">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden gold-border card-premium gold-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-700/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-black text-3xl mb-4 shadow-lg shadow-amber-500/30">
                    CO
                  </div>
                  <p className="text-amber-300 font-semibold text-lg">📹 Votre vidéo ici</p>
                  <p className="text-neutral-400 text-sm mt-2">
                    On met une vidéo de vous en cuisine, avec votre musique, 
                    pour que les visiteurs ressentent tout de suite votre énergie
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* ═══════════════════════════════════════════════
            SECTION BOUTIQUE
            ═══════════════════════════════════════════════ */}
        <SectionWrapper id="boutique" variant="dark">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Visuel */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <p className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-3 text-center lg:text-left">
                📚 Comment vos livres seront présentés
              </p>
              <div className="space-y-4">
                {[1, 2, 3].map((tome) => (
                  <div
                    key={tome}
                    className="card-premium gold-border rounded-xl p-5 flex items-center gap-4"
                  >
                    <div className="w-14 h-18 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-xl shrink-0">
                      T{tome}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">
                        Le Gabon par l&apos;assiette — Tome {tome}
                      </p>
                      <p className="text-amber-400 font-semibold text-sm mt-1">
                        Précommande • 25 000 XAF
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Texte */}
            <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">
                🛍️ Votre boutique en ligne
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Un endroit rien qu&apos;à vous{" "}
                <span className="gold-text">pour vendre vos 3 livres</span>
              </h2>

              {/* ─── EXPLICATION SIMPLE BOUTIQUE ────────── */}
              <div className="space-y-5 text-base leading-relaxed">
                {/* Situation actuelle vs future */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-red-500/5 rounded-2xl p-4 border border-red-500/20">
                    <p className="text-red-400 font-bold text-sm uppercase tracking-wider mb-2">
                      ❌ Aujourd&apos;hui
                    </p>
                    <p className="text-neutral-400 text-sm">
                      Les gens vous envoient des messages privés sur Facebook pour commander. 
                      Vous devez répondre à chaque personne, organiser le paiement, envoyer le PDF. 
                      C&apos;est long et ça vous prend du temps.
                    </p>
                  </div>
                  <div className="bg-green-500/5 rounded-2xl p-4 border border-green-500/20">
                    <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-2">
                      ✅ Avec cette boutique
                    </p>
                    <p className="text-neutral-300 text-sm">
                      Le client arrive, clique sur &ldquo;Acheter&rdquo;, paie avec son téléphone 
                      (Airtel Money, Moov Money, Carte Bancaire), et reçoit le livre automatiquement. 
                      Vous ne faites rien. Le système travaille pour vous.
                    </p>
                  </div>
                </div>

                {/* Fonctionnement */}
                <div className="bg-neutral-900/50 rounded-2xl p-5 border border-neutral-800">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">
                    🧭 Comment ça marche, étape par étape
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">1</div>
                      <div>
                        <p className="text-white font-medium text-sm">Le client voit vos livres</p>
                        <p className="text-neutral-400 text-sm">Les 3 tomes sont affichés avec leurs couvertures et le prix.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">2</div>
                      <div>
                        <p className="text-white font-medium text-sm">Il clique sur &ldquo;Précommander&rdquo;</p>
                        <p className="text-neutral-400 text-sm">Le livre s&apos;ajoute au panier, comme sur n&apos;importe quelle boutique en ligne.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">3</div>
                      <div>
                        <p className="text-white font-medium text-sm">Il paie avec son téléphone</p>
                        <p className="text-neutral-400 text-sm">Mobile Money, Carte Bancaire, ou PayPal pour l&apos;étranger. Tout est automatique.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">4</div>
                      <div>
                        <p className="text-white font-medium text-sm">Le livre est livré tout seul</p>
                        <p className="text-neutral-400 text-sm">PDF envoyé par email instantanément. Livre physique : vous recevez une notification pour l&apos;expédition.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Résultat */}
                <div className="bg-green-500/5 rounded-2xl p-5 border border-green-500/20">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-3">
                    ✅ Ce que ça change pour vous
                  </p>
                  <div className="space-y-2 text-neutral-300 text-sm">
                    <p>→ Des gens du Gabon, de France, des États-Unis ou du Canada peuvent acheter vos livres <span className="text-white font-medium">jour et nuit, sans que vous leviez le petit doigt</span>.</p>
                    <p>→ <span className="text-white font-medium">100% de l&apos;argent vous revient.</span> Pas de commission à Amazon ou aux librairies.</p>
                    <p>→ Vous vendez pendant que vous cuisinez, pendant que vous dormez, tout le temps.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("menu")}
                className="px-6 py-3.5 bg-amber-500/10 text-amber-400 font-bold rounded-xl border border-amber-400/20 hover:bg-amber-500/20 hover:border-amber-400/40 transition-all duration-300 active:scale-95"
              >
                Voir le Menu Digital →
              </button>
            </div>
          </div>
        </SectionWrapper>

        {/* ═══════════════════════════════════════════════
            SECTION MENU DIGITAL
            ═══════════════════════════════════════════════ */}
        <SectionWrapper id="menu" variant="darker">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Texte */}
            <div className="lg:col-span-3 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">
                🍽️ Votre menu en ligne
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Montrez vos plats{" "}
                <span className="gold-text">avant que les gens n&apos;arrivent</span>
              </h2>

              {/* ─── EXPLICATION SIMPLE MENU ───────────── */}
              <div className="space-y-5 text-base leading-relaxed">
                {/* Situation actuelle vs future */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-red-500/5 rounded-2xl p-4 border border-red-500/20">
                    <p className="text-red-400 font-bold text-sm uppercase tracking-wider mb-2">
                      ❌ Ce que font les restaurants aujourd&apos;hui
                    </p>
                    <p className="text-neutral-400 text-sm">
                      Un fichier PDF lourd envoyé par WhatsApp. Des photos floues. 
                      Des prix écrits sur une ardoise. Le client ne voit pas la qualité 
                      de ce que vous proposez.
                    </p>
                  </div>
                  <div className="bg-green-500/5 rounded-2xl p-4 border border-green-500/20">
                    <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-2">
                      ✅ Ce qu&apos;on va faire ici
                    </p>
                    <p className="text-neutral-300 text-sm">
                      De belles photos de chaque plat, prises parmi vos 3000 images. 
                      Une description qui raconte l&apos;histoire du produit. Le prix affiché 
                      clairement. Tout se charge vite, même sur un téléphone avec un réseau moyen.
                    </p>
                  </div>
                </div>

                {/* Ce que le client voit */}
                <div className="bg-neutral-900/50 rounded-2xl p-5 border border-neutral-800">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">
                    📱 Ce que le client voit sur son téléphone
                  </p>
                  <ul className="space-y-2 text-sm text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">📸</span>
                      <span><span className="text-white font-medium">La photo du plat</span> — en haute définition, qui donne envie.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">📝</span>
                      <span><span className="text-white font-medium">Le nom et la description</span> — avec l&apos;histoire du produit local utilisé.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">💶</span>
                      <span><span className="text-white font-medium">Le prix</span> — affiché clairement, sans surprise.</span>
                    </li>
                  </ul>
                </div>

                {/* Résultat */}
                <div className="bg-green-500/5 rounded-2xl p-5 border border-green-500/20">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-3">
                    ✅ Ce que ça change pour vous
                  </p>
                  <div className="space-y-2 text-neutral-300 text-sm">
                    <p>→ <span className="text-white font-medium">9 clients sur 10</span> regardent le menu sur leur téléphone avant de venir. Avec de belles photos, ils sont déjà convaincus.</p>
                    <p>→ Quand les gens voient la qualité de vos plats en photo, <span className="text-white font-medium">ils comprennent le prix et ne le discutent pas</span>.</p>
                    <p>→ Vos serveurs passent moins de temps à expliquer le menu. Ils peuvent se concentrer sur le service.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("apropos")}
                className="px-6 py-3.5 bg-amber-500/10 text-amber-400 font-bold rounded-xl border border-amber-400/20 hover:bg-amber-500/20 hover:border-amber-400/40 transition-all duration-300 active:scale-95"
              >
                Voir votre Histoire →
              </button>
            </div>

            {/* Visuel Menu */}
            <div className="lg:col-span-2">
              <div className="card-premium gold-border rounded-2xl p-5 space-y-4 gold-glow">
                <p className="text-amber-400 font-bold text-sm text-center uppercase tracking-widest">
                  Voici à quoi ressemble le menu
                </p>
                {[
                  { nom: "Poisson braisé & Légumes oubliés", prix: "12 000 XAF" },
                  { nom: "Fusion Ndolè contemporain", prix: "15 000 XAF" },
                  { nom: "Dessert à l'Odika & Manioc", prix: "8 000 XAF" },
                ].map((plat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs text-amber-400">
                        📸
                      </div>
                      <span className="text-sm text-neutral-200 font-medium">{plat.nom}</span>
                    </div>
                    <span className="text-amber-400 font-bold text-sm">{plat.prix}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* ═══════════════════════════════════════════════
            SECTION À PROPOS
            ═══════════════════════════════════════════════ */}
        <SectionWrapper id="apropos" variant="dark">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Visuel */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="card-premium gold-border rounded-2xl p-6 text-center space-y-4 gold-glow">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-black text-2xl">
                  CO
                </div>
                <div className="space-y-2">
                  <p className="text-white font-bold">Chef Omiel</p>
                  <p className="text-amber-400 text-sm font-semibold">
                    Créateur Culinaire • Gabon
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <span className="px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                      ✓ AGASA
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      ✓ Ministère Éducation
                    </span>
                  </div>
                  <p className="text-neutral-400 text-sm pt-2">
                    9 provinces • 10 ans de recherche • 3000 photos
                  </p>
                </div>
              </div>
            </div>

            {/* Texte */}
            <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">
                📖 Qui vous êtes
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Raconter votre parcours{" "}
                <span className="gold-text">pour que les gens comprennent qui vous êtes</span>
              </h2>

              {/* ─── EXPLICATION SIMPLE À PROPOS ───────── */}
              <div className="space-y-5 text-base leading-relaxed">
                {/* Ce qu'on va mettre */}
                <div className="bg-neutral-900/50 rounded-2xl p-5 border border-neutral-800">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">
                    📸 Ce qu&apos;on va montrer ici
                  </p>
                  <ul className="space-y-3 text-sm text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">🌍</span>
                      <span>Vos photos sur le terrain, dans les <span className="text-white font-medium">9 provinces du Gabon</span>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">🏛️</span>
                      <span>Les documents officiels : <span className="text-white font-medium">AGASA</span>, <span className="text-white font-medium">Ministère de l&apos;Éducation Nationale</span>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">📖</span>
                      <span>L&apos;histoire de vos <span className="text-white font-medium">10 ans de recherche</span> pour les 3 tomes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">🤝</span>
                      <span>Vos partenariats : <span className="text-white font-medium">SOBRAGA</span>, <span className="text-white font-medium">SOVENGAB</span>.</span>
                    </li>
                  </ul>
                </div>

                {/* Pourquoi c'est important */}
                <div className="bg-amber-500/5 rounded-2xl p-5 border border-amber-500/20">
                  <p className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-3">
                    💡 Pourquoi c&apos;est important
                  </p>
                  <p className="text-neutral-300 text-sm">
                    Quand un client voit tout votre parcours — les 9 provinces, les 10 ans de travail, 
                    les validations officielles — <span className="text-white font-medium">il ne vient pas juste manger</span>. 
                    Il vient s&apos;asseoir à la table du Chef Omiel. Cette confiance justifie vos prix 
                    et donne envie de revenir.
                  </p>
                </div>

                {/* Résultat */}
                <div className="bg-green-500/5 rounded-2xl p-5 border border-green-500/20">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-3">
                    ✅ Ce que ça change pour vous
                  </p>
                  <p className="text-neutral-300 text-sm">
                    Plus votre histoire est visible et crédible, <span className="text-white font-medium">plus votre valeur augmente</span> sur le marché. 
                    Les clients, les médias et les partenaires vous prennent au sérieux immédiatement.
                  </p>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("reservations")}
                className="px-6 py-3.5 bg-amber-500/10 text-amber-400 font-bold rounded-xl border border-amber-400/20 hover:bg-amber-500/20 hover:border-amber-400/40 transition-all duration-300 active:scale-95"
              >
                Voir les Réservations →
              </button>
            </div>
          </div>
        </SectionWrapper>

        {/* ═══════════════════════════════════════════════
            SECTION RÉSERVATIONS
            ═══════════════════════════════════════════════ */}
        <SectionWrapper id="reservations" variant="darker">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Texte */}
            <div className="lg:col-span-3 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">
                📅 Réservation en ligne
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Les clients réservent tout seuls,{" "}
                <span className="gold-text">vous restez en cuisine</span>
              </h2>

              {/* ─── EXPLICATION SIMPLE RÉSERVATIONS ───── */}
              <div className="space-y-5 text-base leading-relaxed">
                {/* Situation actuelle */}
                <div className="bg-red-500/5 rounded-2xl p-5 border border-red-500/20">
                  <p className="text-red-400 font-bold text-sm uppercase tracking-wider mb-3">
                    ❌ Ce qui se passe aujourd&apos;hui
                  </p>
                  <p className="text-neutral-300 text-sm">
                    Le téléphone sonne pendant le service. Vous êtes en train de cuisiner. 
                    Vous devez vous arrêter, répondre, noter la réservation sur un papier. 
                    Pendant ce temps, les plats refroidissent. Et quand vous ne répondez pas, 
                    le client appelle le restaurant d&apos;à côté.
                  </p>
                </div>

                {/* Ce qu'on met en place */}
                <div className="bg-neutral-900/50 rounded-2xl p-5 border border-neutral-800">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">
                    🧭 Comment ça va marcher
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">1</div>
                      <div>
                        <p className="text-white font-medium text-sm">Le client arrive sur votre site</p>
                        <p className="text-neutral-400 text-sm">Il clique sur &ldquo;Réserver&rdquo;.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">2</div>
                      <div>
                        <p className="text-white font-medium text-sm">Il choisit sa date, l&apos;heure, le nombre de personnes</p>
                        <p className="text-neutral-400 text-sm">Tout est simple, comme réserver un billet d&apos;avion.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">3</div>
                      <div>
                        <p className="text-white font-medium text-sm">Vous recevez la réservation</p>
                        <p className="text-neutral-400 text-sm">Sur votre tableau de bord, sans un seul coup de téléphone.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-neutral-700/50">
                    <p className="text-amber-300 text-sm font-medium">
                      💬 Pour les demandes spéciales (groupes, événements privés SOBRAGA, SOVENGAB) 
                      → un bouton WhatsApp dédié, pour que vous puissiez gérer ces demandes à part, 
                      quand vous êtes disponible.
                    </p>
                  </div>
                </div>

                {/* Résultat */}
                <div className="bg-green-500/5 rounded-2xl p-5 border border-green-500/20">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-3">
                    ✅ Ce que ça change pour vous
                  </p>
                  <div className="space-y-2 text-neutral-300 text-sm">
                    <p>→ <span className="text-white font-medium">Votre téléphone ne sonne plus en cuisine.</span> Vous restez concentré sur vos plats.</p>
                    <p>→ Les réservations arrivent <span className="text-white font-medium">jour et nuit, même quand le restaurant est fermé</span>.</p>
                    <p>→ Vous savez exactement combien de tables sont réservées, à quelle heure, et pour combien de personnes.</p>
                    <p>→ <span className="text-white font-medium">Plus de tables pleines</span> = plus de revenus, sans stress en plus.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visuel Réservation */}
            <div className="lg:col-span-2">
              <div className="card-premium gold-border rounded-2xl p-5 space-y-4 gold-glow">
                <p className="text-amber-400 font-bold text-sm text-center uppercase tracking-widest">
                  Le client voit ça
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/30 text-sm text-neutral-300">
                    📅 Choisir la date
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/30 text-sm text-neutral-300">
                    👥 Nombre de personnes
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/30 text-sm text-neutral-300">
                    🕐 Choisir l&apos;heure
                  </div>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-sm text-center">
                    Réserver maintenant
                  </button>
                </div>
                <p className="text-center text-neutral-500 text-xs">
                  Demande spéciale (groupe, événement) :{" "}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      "Chef, demande de réservation groupe/événement."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 underline hover:text-green-300"
                  >
                    WhatsApp Business
                  </a>
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>

      </main>

      {/* ═══════════════════════════════════════════════
          FOOTER / CONCLUSION
          ═══════════════════════════════════════════════ */}
      <footer className="border-t border-neutral-800/50 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="card-premium gold-border rounded-3xl p-6 sm:p-10 lg:p-12 text-center space-y-8 gold-glow">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">
              On y va ?
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight">
              Chef, voilà à quoi ressemble{" "}
              <span className="gold-text">votre futur site</span>
            </h2>

            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Chaque section que vous venez de voir est prête techniquement. 
              Il ne manque plus que vos photos, vos vidéos et vos textes pour tout activer.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
              <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
                <p className="text-amber-400 font-bold text-sm mb-1">📚 La Boutique</p>
                <p className="text-neutral-400 text-xs">Vendez vos 3 livres au monde entier, sans commission</p>
              </div>
              <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
                <p className="text-amber-400 font-bold text-sm mb-1">🍽️ Le Menu</p>
                <p className="text-neutral-400 text-xs">Montrez vos plats en photo pour donner envie</p>
              </div>
              <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
                <p className="text-amber-400 font-bold text-sm mb-1">📖 Votre Histoire</p>
                <p className="text-neutral-400 text-xs">Votre parcours, vos preuves, votre crédibilité</p>
              </div>
              <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
                <p className="text-amber-400 font-bold text-sm mb-1">📅 Les Réservations</p>
                <p className="text-neutral-400 text-xs">Les clients réservent tout seuls, 24h/24</p>
              </div>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black text-lg sm:text-xl rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/50 active:scale-95 group"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Activer mon écosystème avec Abdoulaye
            </a>

            <p className="text-neutral-500 text-sm">
              On prend 5 minutes sur WhatsApp, je vous montre comment lancer la machine.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── COMPOSANT SECTION WRAPPER ─────────────────────────
function SectionWrapper({
  id,
  variant,
  children,
}: {
  id: string;
  variant: "hero" | "dark" | "darker";
  children: React.ReactNode;
}) {
  const bgClasses = {
    hero: "bg-neutral-950",
    dark: "bg-neutral-900/50",
    darker: "bg-neutral-950",
  };

  return (
    <section
      id={id}
      className={`${bgClasses[variant]} py-16 sm:py-20 lg:py-24 border-b border-neutral-800/30 scroll-mt-20`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}