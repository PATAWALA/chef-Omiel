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
const WHATSAPP_NUMBER = "24104483006"; // ← Remplace par ton vrai numéro
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
                  <ul className="space-y-3 text-neutral-300">
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 text-lg mt-0.5">🎬</span>
                      <span>
                        <span className="text-white font-medium">Une vidéo de vous en cuisine</span> — avec votre musique Hip-hop en fond. 
                        En 3 secondes, le visiteur ressent votre univers, votre énergie. 
                        Exactement comme quand on entre dans votre restaurant.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 text-lg mt-0.5">📝</span>
                      <span>
                        <span className="text-white font-medium">Un message clair </span> qui dit qui vous êtes : 
                        créateur culinaire, 10 ans de recherche, 3 livres, 3000 photos. 
                        Tout de suite, le visiteur comprend l&apos;ampleur de votre travail.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 text-lg mt-0.5">👆</span>
                      <span>
                        <span className="text-white font-medium">Des boutons visibles</span> qui dirigent les gens 
                        vers vos livres ou vos réservations. Comme un guide qui prend le visiteur par la main.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Résultat */}
                <div className="bg-green-500/5 rounded-2xl p-5 border border-green-500/20">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-3">
                    ✅ Ce que ça change pour vous
                  </p>
                  <div className="space-y-3 text-neutral-300">
                    <p>
                      → Vous avez déjà une <span className="text-white font-medium">grande communauté sur Facebook</span>. 
                      Imaginez maintenant que chaque fois que vous publiez, vous pouvez dire à cette communauté : 
                      &ldquo;Retrouvez tout mon univers sur mon site&rdquo;. 
                      Votre site devient le quartier général où tout converge.
                    </p>
                    <p>
                      → Un touriste à Paris, un Gabonais de la diaspora, un journaliste qui prépare un article — 
                      ils tapent &ldquo;Chef Omiel&rdquo; ou &ldquo;gastronomie gabonaise&rdquo; sur Google, 
                      et <span className="text-white font-medium">c&apos;est vous qu&apos;ils trouvent</span>. 
                      Pas un article de 2019, pas une page Facebook incomplète : votre site, votre univers, votre contrôle.
                    </p>
                    <p>
                      → Votre site travaille pour vous <span className="text-white font-medium">24 heures sur 24, 7 jours sur 7</span>. 
                      Pendant que vous cuisinez, pendant que vous dormez, pendant que vous êtes en déplacement.
                    </p>
                  </div>
                </div>

                {/* Projection */}
                <div className="bg-amber-500/5 rounded-2xl p-5 border border-amber-500/20">
                  <p className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-3">
                    🔮 Imaginez dans 6 mois
                  </p>
                  <p className="text-neutral-300">
                    Un partenaire potentiel vous appelle. Il a visité votre site. Il a vu la vidéo, 
                    les livres, les photos, les preuves. Avant même de décrocher son téléphone, 
                    <span className="text-white font-medium"> il est déjà convaincu</span>. 
                    Votre site a fait le travail de persuasion à votre place.
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

            <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">
                🛍️ Votre boutique en ligne
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Vendez vos livres, votre savoir,{" "}
                <span className="gold-text">vos connaissances</span>
              </h2>

              <div className="space-y-5 text-base leading-relaxed">
                {/* Comparaison */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-red-500/5 rounded-2xl p-4 border border-red-500/20">
                    <p className="text-red-400 font-bold text-sm uppercase tracking-wider mb-2">
                      ❌ Aujourd&apos;hui
                    </p>
                    <p className="text-neutral-400 text-sm">
                      Les gens vous envoient des messages privés sur Facebook pour commander. 
                      Vous devez répondre à chaque personne, organiser le paiement, envoyer le PDF manuellement. 
                      C&apos;est long et ça vous prend du temps que vous pourriez passer en cuisine.
                    </p>
                  </div>
                  <div className="bg-green-500/5 rounded-2xl p-4 border border-green-500/20">
                    <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-2">
                      ✅ Avec cette boutique
                    </p>
                    <p className="text-neutral-300 text-sm">
                      Le client arrive, clique sur &ldquo;Acheter&rdquo;, paie avec son téléphone 
                      (Airtel Money, Moov Money, Carte Bancaire, PayPal), et reçoit le livre automatiquement. 
                      Vous, vous ne faites rien. Le système travaille pour vous.
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
                        <p className="text-white font-medium text-sm">Le client arrive sur votre boutique</p>
                        <p className="text-neutral-400 text-sm">Il voit vos 3 tomes avec leurs couvertures, le prix, et un bouton &ldquo;Précommander&rdquo;.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">2</div>
                      <div>
                        <p className="text-white font-medium text-sm">Il clique, il paie</p>
                        <p className="text-neutral-400 text-sm">Par Mobile Money, Carte Bancaire ou PayPal. C&apos;est sécurisé, c&apos;est automatique.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">3</div>
                      <div>
                        <p className="text-white font-medium text-sm">Le livre est livré tout seul</p>
                        <p className="text-neutral-400 text-sm">PDF : envoyé par email en quelques secondes. Livre physique : vous recevez une notification pour l&apos;expédition.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">4</div>
                      <div>
                        <p className="text-white font-medium text-sm">L&apos;argent arrive sur votre compte</p>
                        <p className="text-neutral-400 text-sm">100% du prix de vente. Pas de commission à une plateforme. Pas d&apos;intermédiaire.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Résultat */}
                <div className="bg-green-500/5 rounded-2xl p-5 border border-green-500/20">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-3">
                    ✅ Ce que ça change pour vous
                  </p>
                  <div className="space-y-3 text-neutral-300">
                    <p>
                      → <span className="text-white font-medium">Votre grosse communauté Facebook</span> peut maintenant 
                      acheter vos livres en 2 clics, sans vous envoyer de message. Chaque publication devient une opportunité de vente directe.
                    </p>
                    <p>
                      → Des lecteurs du Gabon, de France, des États-Unis, du Canada — 
                      <span className="text-white font-medium"> partout dans le monde</span> — peuvent commander. 
                      Votre savoir traverse les frontières.
                    </p>
                    <p>
                      → <span className="text-white font-medium">100% des ventes vous reviennent.</span> Sur un livre à 25 000 XAF, 
                      pas un centime ne part ailleurs. Comparez avec les 30% à 65% que prennent Amazon ou les librairies.
                    </p>
                  </div>
                </div>

                {/* Projection : pas que les livres */}
                <div className="bg-amber-500/5 rounded-2xl p-5 border border-amber-500/20">
                  <p className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-3">
                    🔮 Et ce n&apos;est que le début
                  </p>
                  <p className="text-neutral-300">
                    Cette boutique, <span className="text-white font-medium">ce n&apos;est pas seulement pour vos 3 tomes actuels</span>. 
                    Demain, vous pourrez y vendre vos prochains livres, vos fiches de recettes, 
                    vos formations en ligne, vos vidéos de cours de cuisine, vos épices, 
                    vos sauces signature. Chaque connaissance que vous avez peut devenir un produit. 
                    Votre site devient une plateforme qui monétise tout votre savoir.
                  </p>
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
            <div className="lg:col-span-3 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">
                🍽️ Votre menu en ligne
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Montrez vos plats{" "}
                <span className="gold-text">avant que les clients n&apos;arrivent</span>
              </h2>

              <div className="space-y-5 text-base leading-relaxed">
                {/* Comparaison */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-red-500/5 rounded-2xl p-4 border border-red-500/20">
                    <p className="text-red-400 font-bold text-sm uppercase tracking-wider mb-2">
                      ❌ Ce qui se fait ailleurs
                    </p>
                    <p className="text-neutral-400 text-sm">
                      Des PDF lourds envoyés par WhatsApp. Des photos prises avec un vieux téléphone. 
                      Des prix griffonnés sur une ardoise. Le client ne voit pas la différence 
                      entre votre plat signature à 15 000 XAF et un plat ordinaire à 3 000 XAF.
                    </p>
                  </div>
                  <div className="bg-green-500/5 rounded-2xl p-4 border border-green-500/20">
                    <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-2">
                      ✅ Ce qu&apos;on va faire ici
                    </p>
                    <p className="text-neutral-300 text-sm">
                      De magnifiques photos de chaque plat, choisies parmi vos 3000 clichés. 
                      Une description qui raconte l&apos;histoire du produit : d&apos;où il vient, 
                      pourquoi vous l&apos;avez choisi, comment vous le travaillez. 
                      Le prix affiché clairement, sans surprise.
                    </p>
                  </div>
                </div>

                {/* Ce que le client voit */}
                <div className="bg-neutral-900/50 rounded-2xl p-5 border border-neutral-800">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">
                    📱 Ce que le client voit sur son téléphone
                  </p>
                  <ul className="space-y-3 text-neutral-300">
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 text-lg mt-0.5">📸</span>
                      <span>
                        <span className="text-white font-medium">La photo du plat</span> — en haute définition, 
                        avec les textures, les couleurs. Le client a déjà envie de manger avant de venir.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 text-lg mt-0.5">📝</span>
                      <span>
                        <span className="text-white font-medium">L&apos;histoire derrière le plat</span> — 
                        l&apos;origine du produit local, la technique utilisée, pourquoi ce plat est unique. 
                        Ce n&apos;est pas juste un menu : c&apos;est une invitation à voyager dans votre univers.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 text-lg mt-0.5">💶</span>
                      <span>
                        <span className="text-white font-medium">Le prix</span> — affiché clairement. 
                        Quand le client voit la photo et lit l&apos;histoire, le prix devient logique. 
                        Il ne le discute plus.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Résultat */}
                <div className="bg-green-500/5 rounded-2xl p-5 border border-green-500/20">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-3">
                    ✅ Ce que ça change pour vous
                  </p>
                  <div className="space-y-3 text-neutral-300">
                    <p>
                      → <span className="text-white font-medium">9 clients sur 10</span> regardent le menu sur leur téléphone avant de réserver. 
                      Si vos plats sont beaux et bien présentés, ils sont déjà convaincus avant d&apos;arriver.
                    </p>
                    <p>
                      → Vos plats signatures — ceux qui vous rapportent le plus — sont mis en avant. 
                      Les clients les voient en premier, <span className="text-white font-medium">ils les commandent plus</span>.
                    </p>
                    <p>
                      → Vos serveurs passent moins de temps à expliquer le menu. 
                      Ils peuvent se concentrer sur le service, suggérer des vins, des desserts. 
                      <span className="text-white font-medium"> Le panier moyen augmente.</span>
                    </p>
                  </div>
                </div>

                {/* Projection */}
                <div className="bg-amber-500/5 rounded-2xl p-5 border border-amber-500/20">
                  <p className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-3">
                    🔮 Imaginez
                  </p>
                  <p className="text-neutral-300">
                    Un couple d&apos;expatriés à Paris prépare son voyage au Gabon. 
                    Ils cherchent &ldquo;meilleur restaurant Libreville&rdquo;. Ils tombent sur votre menu. 
                    Ils voient les photos, lisent les histoires des produits. 
                    <span className="text-white font-medium"> Ils réservent avant même d&apos;avoir pris leur billet d&apos;avion.</span>
                  </p>
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

            <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">
                📖 Qui vous êtes
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Votre histoire, vos preuves,{" "}
                <span className="gold-text">votre crédibilité</span>
              </h2>

              <div className="space-y-5 text-base leading-relaxed">
                {/* Ce qu'on va montrer */}
                <div className="bg-neutral-900/50 rounded-2xl p-5 border border-neutral-800">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">
                    📸 Ce qu&apos;on va montrer ici
                  </p>
                  <ul className="space-y-3 text-neutral-300">
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 text-lg mt-0.5">🌍</span>
                      <span>
                        Vos photos sur le terrain, dans les <span className="text-white font-medium">9 provinces du Gabon</span>. 
                        On voit le travail, la recherche, l&apos;authenticité.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 text-lg mt-0.5">🏛️</span>
                      <span>
                        Les documents officiels : <span className="text-white font-medium">AGASA</span>,{" "}
                        <span className="text-white font-medium">Ministère de l&apos;Éducation Nationale</span>. 
                        Des preuves, pas des paroles.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 text-lg mt-0.5">📖</span>
                      <span>
                        L&apos;histoire de vos <span className="text-white font-medium">10 ans de recherche</span> pour les 3 tomes. 
                        Pourquoi vous avez fait ce travail, ce que vous avez découvert.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 text-lg mt-0.5">🤝</span>
                      <span>
                        Vos partenariats : <span className="text-white font-medium">SOBRAGA</span>,{" "}
                        <span className="text-white font-medium">SOVENGAB</span>, et les autres. 
                        Des noms qui parlent et qui rassurent.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Pourquoi c'est important */}
                <div className="bg-amber-500/5 rounded-2xl p-5 border border-amber-500/20">
                  <p className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-3">
                    💡 Pourquoi c&apos;est important
                  </p>
                  <p className="text-neutral-300">
                    Quand un client voit tout votre parcours — les 9 provinces, les 10 ans de travail, 
                    les validations officielles — <span className="text-white font-medium">il ne vient pas juste manger</span>. 
                    Il vient s&apos;asseoir à la table du Chef Omiel. Il accepte vos prix sans discuter. 
                    Il revient. Il parle de vous à ses amis.
                  </p>
                </div>

                {/* Résultat */}
                <div className="bg-green-500/5 rounded-2xl p-5 border border-green-500/20">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-3">
                    ✅ Ce que ça change pour vous
                  </p>
                  <div className="space-y-3 text-neutral-300">
                    <p>
                      → <span className="text-white font-medium">Des clients plus confiants</span>, qui réservent plus facilement et qui dépensent plus.
                    </p>
                    <p>
                      → <span className="text-white font-medium">Des partenariats plus faciles à décrocher.</span> 
                      Imaginez : vous rencontrez un sponsor, un média, une institution. Au lieu de leur raconter votre parcours, 
                      vous leur donnez le lien de votre site. Ils voient tout : les photos, les documents, les preuves. 
                      Votre site parle pour vous, même quand vous n&apos;êtes pas là.
                    </p>
                    <p>
                      → <span className="text-white font-medium">Une image de marque solide.</span> Vous n&apos;êtes plus 
                      &ldquo;un cuisinier qui fait des plats&rdquo;. Vous êtes une référence culturelle, 
                      un ambassadeur du patrimoine gabonais.
                    </p>
                  </div>
                </div>

                {/* Projection */}
                <div className="bg-amber-500/5 rounded-2xl p-5 border border-amber-500/20">
                  <p className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-3">
                    🔮 Imaginez
                  </p>
                  <p className="text-neutral-300">
                    Une institution internationale cherche un chef gabonais pour représenter le pays 
                    lors d&apos;un événement mondial. Ils tapent votre nom sur Google. Ils arrivent sur votre site. 
                    Ils voient votre parcours, vos livres, vos preuves, vos photos. 
                    <span className="text-white font-medium"> Vous êtes le choix évident.</span>
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
            <div className="lg:col-span-3 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">
                📅 Réservation en ligne
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Les clients réservent tout seuls,{" "}
                <span className="gold-text">vous restez concentré en cuisine</span>
              </h2>

              <div className="space-y-5 text-base leading-relaxed">
                {/* Comparaison */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-red-500/5 rounded-2xl p-4 border border-red-500/20">
                    <p className="text-red-400 font-bold text-sm uppercase tracking-wider mb-2">
                      ❌ Aujourd&apos;hui
                    </p>
                    <p className="text-neutral-400 text-sm">
                      Le téléphone sonne en plein service. Vous devez vous arrêter, 
                      vous essuyer les mains, répondre, noter sur un papier. 
                      Les plats refroidissent. Et quand vous ne répondez pas, 
                      le client appelle ailleurs.
                    </p>
                  </div>
                  <div className="bg-green-500/5 rounded-2xl p-4 border border-green-500/20">
                    <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-2">
                      ✅ Avec cette page
                    </p>
                    <p className="text-neutral-300 text-sm">
                      Le client réserve directement sur votre site. Il choisit sa date, 
                      l&apos;heure, le nombre de personnes. Vous recevez la réservation 
                      sans un seul coup de fil. La cuisine reste calme.
                    </p>
                  </div>
                </div>

                {/* Fonctionnement */}
                <div className="bg-neutral-900/50 rounded-2xl p-5 border border-neutral-800">
                  <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">
                    🧭 Comment ça marche
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">1</div>
                      <div>
                        <p className="text-white font-medium text-sm">Le client arrive sur votre site</p>
                        <p className="text-neutral-400 text-sm">Il clique sur le bouton &ldquo;Réserver&rdquo;. Simple, visible, rapide.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">2</div>
                      <div>
                        <p className="text-white font-medium text-sm">Il choisit sa date, l&apos;heure, le nombre de couverts</p>
                        <p className="text-neutral-400 text-sm">Comme réserver un billet d&apos;avion. Tout est clair, tout est fluide.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">3</div>
                      <div>
                        <p className="text-white font-medium text-sm">Vous recevez la réservation</p>
                        <p className="text-neutral-400 text-sm">Sur votre tableau de bord. Sans un seul appel. Sans une seule interruption.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-neutral-700/50">
                    <p className="text-amber-300 text-sm font-medium">
                      💬 Pour les demandes spéciales — groupes, événements privés, partenariats SOBRAGA ou SOVENGAB — 
                      un bouton WhatsApp Business est là. Ces demandes sont traitées à part, quand vous êtes disponible.
                    </p>
                  </div>
                </div>

                {/* Résultat */}
                <div className="bg-green-500/5 rounded-2xl p-5 border border-green-500/20">
                  <p className="text-green-400 font-bold text-sm uppercase tracking-wider mb-3">
                    ✅ Ce que ça change pour vous
                  </p>
                  <div className="space-y-3 text-neutral-300">
                    <p>
                      → <span className="text-white font-medium">Votre téléphone ne sonne plus en cuisine.</span> 
                      Vous restez concentré sur vos plats. La qualité est constante.
                    </p>
                    <p>
                      → Les réservations arrivent <span className="text-white font-medium">jour et nuit, même quand le restaurant est fermé</span>.
                    </p>
                    <p>
                      → Vous savez exactement combien de tables sont réservées, à quelle heure, pour combien de personnes. 
                      Vous pilotez votre restaurant avec <span className="text-white font-medium">des vrais chiffres</span>, pas au feeling.
                    </p>
                    <p>
                      → <span className="text-white font-medium">Plus de tables pleines</span> = plus de revenus, 
                      sans stress supplémentaire pour vous ou votre brigade.
                    </p>
                  </div>
                </div>

                {/* Projection */}
                <div className="bg-amber-500/5 rounded-2xl p-5 border border-amber-500/20">
                  <p className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-3">
                    🔮 Imaginez
                  </p>
                  <p className="text-neutral-300">
                    Un samedi soir. La salle est pleine. Les réservations sont arrivées toutes seules 
                    dans la semaine. Vous êtes en cuisine, concentré, serein. 
                    Votre brigade tourne parfaitement. Aucun téléphone ne vient casser le rythme. 
                    <span className="text-white font-medium"> C&apos;est ça, la tranquillité d&apos;un business bien rodé.</span>
                  </p>
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
          SECTION ABDOULAYE / À PROPOS DE MOI
          ═══════════════════════════════════════════════ */}
      <SectionWrapper id="abdoulaye" variant="dark">
        <div className="max-w-4xl mx-auto">
          <div className="card-premium gold-border rounded-3xl p-6 sm:p-10 lg:p-12 gold-glow">
            
            {/* En-tête */}
            <div className="text-center space-y-4 mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">
                👋 Qui est derrière ce projet
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight">
                Je m&apos;appelle Abdoulaye,{" "}
                <span className="gold-text">et voici ce que je fais</span>
              </h2>
            </div>

            {/* Photo + Texte */}
            <div className="grid md:grid-cols-5 gap-8 lg:gap-12 items-center">
              
              {/* Photo */}
              <div className="md:col-span-2 flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-amber-400/30 shadow-2xl shadow-amber-500/10">
                    <img
                      src="/images/moi.jpeg"
                      alt="Abdoulaye - Expert en sites web"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-green-500 border-4 border-neutral-950 flex items-center justify-center">
                    <span className="text-white text-lg">✓</span>
                  </div>
                </div>
              </div>

              {/* Texte */}
              <div className="md:col-span-3 space-y-6">
                <div className="space-y-4 text-neutral-300 leading-relaxed">
                  <p>
                    <span className="text-white font-semibold">Je crée des sites web qui travaillent.</span>{" "}
                    Pas des sites vitrines qui font joli et qui dorment. 
                    Des sites qui attirent des clients, qui vendent, qui réservent, qui rapportent.
                  </p>
                  <p>
                    Depuis 3 ans, j&apos;ai accompagné <span className="text-white font-semibold">plus de 50 professionnels</span> — 
                    des cliniques, des restaurants, des créateurs comme vous — 
                    à construire leur présence digitale et à la transformer en revenus concrets.
                  </p>
                  <p>
                    Mon travail est simple : <span className="text-amber-300 font-medium">vous donner un site qui parle pour vous</span>, 
                    qui convainc vos clients, et qui vous fait gagner de l&apos;argent 
                    pendant que vous faites ce que vous aimez.
                  </p>
                </div>

                {/* Chiffres clés */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-neutral-900/50 rounded-xl p-3 text-center border border-neutral-800">
                    <p className="text-amber-400 font-black text-xl sm:text-2xl">3+</p>
                    <p className="text-neutral-400 text-xs mt-1">années d&apos;expérience</p>
                  </div>
                  <div className="bg-neutral-900/50 rounded-xl p-3 text-center border border-neutral-800">
                    <p className="text-amber-400 font-black text-xl sm:text-2xl">50+</p>
                    <p className="text-neutral-400 text-xs mt-1">partenaires accompagnés</p>
                  </div>
                  <div className="bg-neutral-900/50 rounded-xl p-3 text-center border border-neutral-800">
                    <p className="text-amber-400 font-black text-xl sm:text-2xl">100%</p>
                    <p className="text-neutral-400 text-xs mt-1">sites qui convertissent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Séparateur */}
            <div className="my-10 border-t border-neutral-800/50" />

            {/* Séparateur */}
            <div className="my-10 border-t border-neutral-800/50" />

            {/* Découvrir mon travail + Contact */}
            <div className="text-center space-y-6">

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Bouton : Voir mon site → JAUNE/OR */}
                <a
                  href="https://patawala-v2-nry6.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/50 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Découvrir mon site web
                </a>

                {/* Bouton : WhatsApp → VERT */}
                <a
                  href={`https://wa.me/22962278090`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-black rounded-2xl hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-xl shadow-green-500/25 hover:shadow-green-500/50 active:scale-95 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Discuter sur WhatsApp
                </a>
              </div>

              <p className="text-neutral-500 text-sm">
                ⏱️Le premier échange est gratuit et sans engagement.
              </p>
            </div>

          </div>
        </div>
      </SectionWrapper>
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