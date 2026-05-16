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
                Maquette Pédagogique • Section Accueil
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight">
                Chef Omiel,{" "}
                <span className="gold-text">
                  votre art ne peut plus dépendre des algorithmes de Facebook
                </span>
              </h1>

              {/* ─── COPYWRITING ACCUEIL ──────────────── */}
              <div className="space-y-5 text-neutral-300 text-base sm:text-lg leading-relaxed">
                {/* 1. LE PROBLÈME ACTUEL */}
                <div className="border-l-2 border-red-500/50 pl-4">
                  <p className="text-red-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🔴 Le problème actuel
                  </p>
                  <p className="text-neutral-400">
                    Aujourd&apos;hui, votre art dépend d&apos;une plateforme qui ne vous appartient pas. 
                    Vous publiez une vidéo sur Facebook, et en 48 heures elle est noyée sous des publications 
                    de chats et de memes. Vos prospects sérieux — ceux qui ont un billet d&apos;avion ou 
                    une carte bancaire — ne vous trouvent même pas. Pire : <strong className="text-white">chaque jour où votre contenu 
                    n&apos;est pas visible, c&apos;est un client qui réserve chez un concurrent.</strong>
                  </p>
                </div>

                {/* 2. LA SOLUTION APPORTÉE */}
                <div className="border-l-2 border-amber-500/70 pl-4">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🟡 La solution
                  </p>
                  <p className="text-neutral-300">
                    Cette page d&apos;accueil est votre <strong className="text-white">vitrine permanente sur Internet</strong> — elle travaille 
                    24h/24, 7j/7, sans algorithme qui décide qui la voit. Dès qu&apos;un Gabonais 
                    tape &ldquo;gastronomie gabonaise&rdquo; sur Google, ou qu&apos;un touriste cherche 
                    &ldquo;chef Libreville&rdquo;, c&apos;est <strong className="text-amber-300">VOUS</strong> qui apparaissez en premier. 
                    Une vidéo de vous en cuisine avec du Hip-hop en fond, un appel à l&apos;action clair : 
                    acheter le livre ou réserver une table.
                  </p>
                </div>

                {/* 3. LE GAIN CONCRET */}
                <div className="border-l-2 border-green-500/70 pl-4">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🟢 Le gain concret
                  </p>
                  <p className="text-neutral-300">
                    Un site bien référencé génère <strong className="text-white">en moyenne 3 à 5 fois plus de contacts qualifiés</strong> 
                    qu&apos;une page Facebook. Pour vous, cela signifie : des clients qui arrivent déjà 
                    convaincus, prêts à payer vos prix premium, sans que vous ayez à négocier dans les 
                    messages privés. <strong className="text-green-300">Votre notoriété se transforme en machine à cash, automatiquement.</strong>
                  </p>
                </div>

                {/* 4. L'EFFET CHOC */}
                <div className="border-l-2 border-amber-400 pl-4 bg-amber-400/5 rounded-r-lg p-3">
                  <p className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-1">
                    ⚡ L&apos;effet choc
                  </p>
                  <p className="text-white font-semibold">
                    Refuser d&apos;avoir une vitrine professionnelle en 2026, c&apos;est accepter 
                    volontairement de rester invisible pendant que vos concurrents captent vos clients. 
                    <span className="gold-text font-black"> Votre talent mérite mieux qu&apos;un algorithme capricieux.</span>
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
                  <p className="text-amber-300 font-semibold text-lg">Vidéo Hero</p>
                  <p className="text-neutral-500 text-sm mt-2">
                    Vous en cuisine • Hip-hop • 3 secondes pour impacter
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
              <div className="space-y-4">
                {[1, 2, 3].map((tome) => (
                  <div
                    key={tome}
                    className="card-premium gold-border rounded-xl p-5 flex items-center gap-4"
                  >
                    <div className="w-14 h-18 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-xl">
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
                🛍️ Section Boutique
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Votre Boutique E-commerce{" "}
                <span className="gold-text">Indépendante</span>
              </h2>
              <p className="text-neutral-400 text-lg font-medium">
                Sans intermédiaires. 100% de vos revenus dans votre poche.
              </p>

              {/* ─── COPYWRITING BOUTIQUE ─────────────── */}
              <div className="space-y-5 text-neutral-300 text-base sm:text-lg leading-relaxed">
                {/* 1. LE PROBLÈME ACTUEL */}
                <div className="border-l-2 border-red-500/50 pl-4">
                  <p className="text-red-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🔴 Le problème actuel
                  </p>
                  <p className="text-neutral-400">
                    Chef, soyons honnêtes : quand quelqu&apos;un veut acheter votre livre aujourd&apos;hui, 
                    que se passe-t-il ? Il doit vous envoyer un message privé sur Facebook, vous devez 
                    répondre manuellement, négocier le prix, organiser le paiement par Mobile Money, 
                    puis gérer la livraison du PDF ou du livre physique. <strong className="text-white">C&apos;est épuisant, 
                    lent, et ça tue vos ventes.</strong> Chaque friction dans ce processus = un acheteur 
                    qui abandonne. Amazon ou les librairies prennent 30% à 65% de commission sur 
                    chaque vente. Sur un livre à 25 000 XAF, vous perdez entre 7 500 et 16 250 XAF 
                    <strong className="text-red-300"> par exemplaire vendu</strong>.
                  </p>
                </div>

                {/* 2. LA SOLUTION APPORTÉE */}
                <div className="border-l-2 border-amber-500/70 pl-4">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🟡 La solution
                  </p>
                  <p className="text-neutral-300">
                    Cette section est <strong className="text-white">votre propre boutique en ligne, indépendante de toute plateforme</strong>. 
                    Le client arrive ici, voit vos 3 tomes magnifiquement présentés avec 
                    vos 3000 photos, clique sur &ldquo;Précommander&rdquo;, et paie en 30 secondes — 
                    par Mobile Money (Airtel Money, Moov Money), par Carte Bancaire (Visa, Mastercard), 
                    ou même PayPal pour vos acheteurs en France, aux États-Unis ou au Canada. 
                    <strong className="text-amber-300"> Zéro intermédiaire. Zéro commission.</strong> Le fichier PDF est livré automatiquement 
                    par email. Les livres physiques déclenchent une notification pour l&apos;expédition.
                  </p>
                </div>

                {/* 3. LE GAIN CONCRET */}
                <div className="border-l-2 border-green-500/70 pl-4">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🟢 Le gain concret
                  </p>
                  <p className="text-neutral-300">
                    Faisons le calcul ensemble. Supposons que vous vendiez 500 exemplaires 
                    du Tome 1 à 25 000 XAF. Avec Amazon, vous garderiez environ 8 750 XAF 
                    par livre (35% de commission). <strong className="text-white">Avec votre boutique indépendante, 
                    vous gardez la totalité : 25 000 XAF × 500 = 12 500 000 XAF dans votre poche</strong>, 
                    contre 4 375 000 XAF avec Amazon. <strong className="text-green-300">C&apos;est 8 125 000 XAF de différence. 
                    Sur un seul tome.</strong> Multipliez par 3 tomes. Multipliez par les réassorts. 
                    <span className="text-white font-bold"> Cet argent dort actuellement chez vos concurrents.</span>
                  </p>
                </div>

                {/* 4. L'EFFET CHOC */}
                <div className="border-l-2 border-amber-400 pl-4 bg-amber-400/5 rounded-r-lg p-3">
                  <p className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-1">
                    ⚡ L&apos;effet choc
                  </p>
                  <p className="text-white font-semibold">
                    Vendre vos livres via des MP Facebook en 2026, c&apos;est comme cuisiner 
                    avec un feu de bois pendant que vos concurrents utilisent l&apos;induction. 
                    <span className="gold-text font-black"> Chaque jour sans boutique en ligne est un jour où vous offrez 
                    volontairement 65% de votre valeur à des géants américains.</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("menu")}
                className="px-6 py-3.5 bg-amber-500/10 text-amber-400 font-bold rounded-xl border border-amber-400/20 hover:bg-amber-500/20 hover:border-amber-400/40 transition-all duration-300 active:scale-95"
              >
                Section suivante : Le Menu Digital →
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
                🍽️ Section Menu Digital
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Le Menu Interactif :{" "}
                <span className="gold-text">
                  L&apos;expérience culinaire avant la salle
                </span>
              </h2>

              {/* ─── COPYWRITING MENU ─────────────────── */}
              <div className="space-y-5 text-neutral-300 text-base sm:text-lg leading-relaxed">
                {/* 1. LE PROBLÈME ACTUEL */}
                <div className="border-l-2 border-red-500/50 pl-4">
                  <p className="text-red-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🔴 Le problème actuel
                  </p>
                  <p className="text-neutral-400">
                    Chef, comment vos clients découvrent-ils votre menu aujourd&apos;hui ? 
                    Un PDF de 15 Mo envoyé par WhatsApp qui met 2 minutes à charger. 
                    Une photo floue prise avec un téléphone en 2019. Des prix écrits à la main 
                    sur une ardoise que personne ne voit. Résultat : <strong className="text-white">le client haut de gamme 
                    — celui qui dépense 50 000 XAF par tête — ne perçoit pas la valeur de votre art.</strong> 
                    Il compare votre plat à 15 000 XAF avec un &ldquo;Ndolè à 3000 XAF&rdquo; 
                    du coin de la rue, parce qu&apos;il ne voit pas la différence. 
                    <strong className="text-red-300"> Vous perdez la bataille de la perception avant même qu&apos;il franchisse la porte.</strong>
                  </p>
                </div>

                {/* 2. LA SOLUTION APPORTÉE */}
                <div className="border-l-2 border-amber-500/70 pl-4">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🟡 La solution
                  </p>
                  <p className="text-neutral-300">
                    On remplace le PDF moch par <strong className="text-white">une expérience visuelle immersive</strong>. 
                    Chaque plat est présenté avec une photo professionnelle en haute définition 
                    (issue de vos 3000 images), une description qui raconte l&apos;histoire du 
                    produit local utilisé, son origine, votre technique. Le client fait défiler 
                    le menu comme il ferait défiler Instagram — <strong className="text-amber-300">sauf qu&apos;ici, c&apos;est 
                    VOTRE univers, sans distraction, sans pub concurrente.</strong> Chaque image 
                    est optimisée pour charger en moins d&apos;une seconde, même en connexion 3G 
                    au fin fond du Gabon.
                  </p>
                </div>

                {/* 3. LE GAIN CONCRET */}
                <div className="border-l-2 border-green-500/70 pl-4">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🟢 Le gain concret
                  </p>
                  <p className="text-neutral-300">
                    <strong className="text-white">89% des clients premium consultent le menu sur leur téléphone 
                    avant de réserver.</strong> Quand ils voient vos plats magnifiés, avec des 
                    ingrédients sourcés et une présentation qui respire le luxe, leur cerveau 
                    accepte le prix avant même d&apos;arriver. <strong className="text-green-300">Résultat : vous vendez plus 
                    de plats signature à forte marge, et vous réduisez les questions 
                    &ldquo;c&apos;est quoi ce plat ?&rdquo; de 70%.</strong> Vos serveurs passent moins de temps 
                    à expliquer, plus de temps à vendre des bouteilles de vin et des desserts.
                  </p>
                </div>

                {/* 4. L'EFFET CHOC */}
                <div className="border-l-2 border-amber-400 pl-4 bg-amber-400/5 rounded-r-lg p-3">
                  <p className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-1">
                    ⚡ L&apos;effet choc
                  </p>
                  <p className="text-white font-semibold">
                    Un menu invisible ou mal présenté est un vendeur muet dans votre propre restaurant. 
                    <span className="gold-text font-black"> Pendant que vous laissez vos clients deviner la valeur de votre travail, 
                    vos concurrents, eux, la prouvent en une image.</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("apropos")}
                className="px-6 py-3.5 bg-amber-500/10 text-amber-400 font-bold rounded-xl border border-amber-400/20 hover:bg-amber-500/20 hover:border-amber-400/40 transition-all duration-300 active:scale-95"
              >
                Section suivante : Votre Histoire →
              </button>
            </div>

            {/* Visuel Menu */}
            <div className="lg:col-span-2">
              <div className="card-premium gold-border rounded-2xl p-5 space-y-4 gold-glow">
                <p className="text-amber-400 font-bold text-sm text-center uppercase tracking-widest">
                  Aperçu Menu
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
                📖 Section À Propos
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Votre Histoire : De créateur culinaire{" "}
                <span className="gold-text">à icône culturelle</span>
              </h2>

              {/* ─── COPYWRITING À PROPOS ─────────────── */}
              <div className="space-y-5 text-neutral-300 text-base sm:text-lg leading-relaxed">
                {/* 1. LE PROBLÈME ACTUEL */}
                <div className="border-l-2 border-red-500/50 pl-4">
                  <p className="text-red-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🔴 Le problème actuel
                  </p>
                  <p className="text-neutral-400">
                    Chef, tapez votre nom sur Google. Qu&apos;est-ce qui apparaît ? Un profil 
                    Facebook incomplet. Une photo de vous à un événement en 2021. Des articles 
                    éparpillés que vous ne contrôlez pas. Pendant ce temps, un client potentiel 
                    — un expatrié qui veut organiser un dîner d&apos;affaires à 500 000 XAF, 
                    un touriste qui planifie son voyage au Gabon — cherche à savoir <strong className="text-white">
                    qui vous êtes vraiment</strong>. Ce qu&apos;il trouve ne reflète ni l&apos;ampleur 
                    de vos 10 ans de recherche, ni la caution de l&apos;AGASA, ni votre mission 
                    de transmission. <strong className="text-red-300">Votre crédibilité est floue, donc votre valeur 
                    perçue est floue.</strong>
                  </p>
                </div>

                {/* 2. LA SOLUTION APPORTÉE */}
                <div className="border-l-2 border-amber-500/70 pl-4">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🟡 La solution
                  </p>
                  <p className="text-neutral-300">
                    Cette section raconte <strong className="text-white">votre légende</strong>. Photos sur le terrain 
                    dans les 9 provinces du Gabon. Votre démarche scientifique et culturelle. 
                    Les validations officielles : AGASA, Ministère de l&apos;Éducation Nationale, 
                    vos partenariats avec SOBRAGA ou SOVENGAB. Chaque élément est présenté 
                    comme une pièce à conviction qui construit votre statut d&apos;autorité. 
                    <strong className="text-amber-300"> Ce n&apos;est pas une bio. C&apos;est un dossier de presse permanent 
                    qui travaille pour vous.</strong>
                  </p>
                </div>

                {/* 3. LE GAIN CONCRET */}
                <div className="border-l-2 border-green-500/70 pl-4">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🟢 Le gain concret
                  </p>
                  <p className="text-neutral-300">
                    Quand un client perçoit la profondeur de votre parcours, il ne négocie plus vos prix. 
                    <strong className="text-white"> Il ne vient pas juste manger un plat : il vient s&apos;asseoir à la table 
                    du Chef Omiel.</strong> Cette perception justifie des prix 30% à 50% supérieurs 
                    à la moyenne du marché. Un dîner privé passe de 25 000 XAF à 50 000 XAF par tête. 
                    <strong className="text-green-300"> Votre histoire forte = votre ticket pour le segment luxe.</strong> 
                    Les médias, les institutions, les sponsors vous trouvent crédible en un clic.
                  </p>
                </div>

                {/* 4. L'EFFET CHOC */}
                <div className="border-l-2 border-amber-400 pl-4 bg-amber-400/5 rounded-r-lg p-3">
                  <p className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-1">
                    ⚡ L&apos;effet choc
                  </p>
                  <p className="text-white font-semibold">
                    Avoir un parcours exceptionnel et ne pas le mettre en scène, c&apos;est comme 
                    posséder un diamant brut et le laisser dans un tiroir. 
                    <span className="gold-text font-black"> Vos concurrents ne sont pas meilleurs que vous. 
                    Ils sont juste plus visibles.</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => scrollToSection("reservations")}
                className="px-6 py-3.5 bg-amber-500/10 text-amber-400 font-bold rounded-xl border border-amber-400/20 hover:bg-amber-500/20 hover:border-amber-400/40 transition-all duration-300 active:scale-95"
              >
                Section suivante : Réservations →
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
                📅 Section Réservations
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Réservations Automatiques{" "}
                <span className="gold-text">Zéro friction, moins de stress</span>
              </h2>

              {/* ─── COPYWRITING RÉSERVATIONS ─────────── */}
              <div className="space-y-5 text-neutral-300 text-base sm:text-lg leading-relaxed">
                {/* 1. LE PROBLÈME ACTUEL */}
                <div className="border-l-2 border-red-500/50 pl-4">
                  <p className="text-red-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🔴 Le problème actuel
                  </p>
                  <p className="text-neutral-400">
                    Chef, imaginez la scène : vous êtes en plein coup de feu. Les sauces 
                    mijotent, le poisson doit être retourné, votre brigade est synchronisée. 
                    Et soudain, <strong className="text-white">le téléphone sonne</strong>. Une réservation. Vous devez 
                    vous arrêter, vous essuyer les mains, répondre, noter sur un papier, 
                    vérifier le carnet. Pendant ces 3 minutes, vos plats refroidissent, 
                    le rythme casse, la qualité baisse. Et quand vous ne répondez pas ? 
                    <strong className="text-red-300"> Ce client appelle le restaurant d&apos;à côté.</strong> Chaque appel manqué 
                    est une table vide et un billet qui s&apos;envole.
                  </p>
                </div>

                {/* 2. LA SOLUTION APPORTÉE */}
                <div className="border-l-2 border-amber-500/70 pl-4">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🟡 La solution
                  </p>
                  <p className="text-neutral-300">
                    Un système de réservation en ligne, intégré directement dans cette page. 
                    Le client choisit sa date, son nombre de couverts, son créneau horaire, 
                    et <strong className="text-white">tout arrive automatiquement dans votre tableau de bord</strong> — 
                    sans un seul coup de téléphone. Pour les demandes spécifiques (groupes, 
                    événements privés SOBRAGA ou SOVENGAB), un bouton WhatsApp Business 
                    redirige vers une conversation structurée avec des réponses automatiques. 
                    <strong className="text-amber-300"> Votre téléphone passe du statut de &ldquo;perturbateur culinaire&rdquo; 
                    à &ldquo;outil de closing&rdquo;.</strong>
                  </p>
                </div>

                {/* 3. LE GAIN CONCRET */}
                <div className="border-l-2 border-green-500/70 pl-4">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-1">
                    🟢 Le gain concret
                  </p>
                  <p className="text-neutral-300">
                    Un restaurant qui prend ses réservations en ligne remplit en moyenne{" "}
                    <strong className="text-white">30% de tables en plus</strong> le week-end, simplement parce 
                    qu&apos;aucun appel n&apos;est perdu. Pour vous, cela signifie : votre salle 
                    tourne plus vite, vos serveurs sont moins stressés, et vous restez 
                    concentré sur l&apos;essentiel — <strong className="text-green-300">créer des plats qui justifient 
                    votre réputation</strong>. Le système garde même la trace des clients, 
                    leurs préférences, leurs anniversaires. Du marketing relationnel 
                    automatique, sans effort.
                  </p>
                </div>

                {/* 4. L'EFFET CHOC */}
                <div className="border-l-2 border-amber-400 pl-4 bg-amber-400/5 rounded-r-lg p-3">
                  <p className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-1">
                    ⚡ L&apos;effet choc
                  </p>
                  <p className="text-white font-semibold">
                    Chaque fois que votre téléphone sonne en cuisine, vous ne perdez pas juste 
                    du temps — vous perdez de la qualité, donc de la réputation, donc de l&apos;argent. 
                    <span className="gold-text font-black"> Un restaurant injoignable est un restaurant invisible.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Visuel Réservation */}
            <div className="lg:col-span-2">
              <div className="card-premium gold-border rounded-2xl p-5 space-y-4 gold-glow">
                <p className="text-amber-400 font-bold text-sm text-center uppercase tracking-widest">
                  Réservation Rapide
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/30 text-sm text-neutral-300">
                    📅 Date souhaitée
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/30 text-sm text-neutral-300">
                    👥 Nombre de couverts
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/30 text-sm text-neutral-300">
                    🕐 Créneau horaire
                  </div>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-sm text-center">
                    Réserver maintenant
                  </button>
                </div>
                <p className="text-center text-neutral-500 text-xs">
                  Groupes & Événements :{" "}
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
          FOOTER / L'ULTIMATUM
          ═══════════════════════════════════════════════ */}
      <footer className="border-t border-neutral-800/50 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="card-premium gold-border rounded-3xl p-6 sm:p-10 lg:p-12 text-center space-y-8 gold-glow">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">
              L&apos;Ultimatum
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight">
              Chef, le constat est simple.{" "}
              <span className="gold-text">
                Rester uniquement sur Facebook, c&apos;est laisser de l&apos;argent sur la table
                et limiter la portée historique de votre œuvre.
              </span>
            </h2>

            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Ce site est votre arme pour dominer le marché. La structure technique 
              est prête, il ne manque plus que vos images et vos textes pour l&apos;activer. 
              Si vous refusez cette opportunité, vous continuez volontairement à offrir 
              des clients à vos concurrents.
            </p>

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
              On prend 5 minutes sur WhatsApp pour lancer la machine.
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