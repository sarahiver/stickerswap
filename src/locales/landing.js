// src/locales/landing.js
// Landingpage-Übersetzungen — 15 Sprachen
// Eingebunden via i18next namespace "landing"

const landing = {

  /* ── DEUTSCH ── */
  de: {
    nav: {
      login:  'Anmelden',
      start:  'Kostenlos starten',
    },
    hero: {
      eyebrow: '🏆 Für WM 2026 & EM Panini-Sammler',
      line1:   'TAUSCH.',
      line2:   'SAMMLE.\nGEWINNE.',
      sub:     'Die erste Panini-Tauschbörse mit verifiziertem Benutzersystem, Betrugschutz und über 1.000 Stickern pro Album — endlich wirklich einfach.',
      cta:     'Jetzt kostenlos registrieren',
      demo:    'Demo ansehen →',
    },
    stats: {
      users:        'Aktive Sammler',
      swaps:        'Erfolgreiche Tausche',
      satisfaction: 'Zufriedenheit',
      albums:       'Aktive Alben',
    },
    features: {
      title: 'Warum StickerSwap?',
      sub:   'Weil Facebook-Gruppen 2006 waren.',
      items: [
        { icon: '🔐', title: '100% Verifizierte User',   desc: 'Keine anonymen Profile. Jeder Nutzer wird per E-Mail verifiziert — inkl. Reputationssystem und Tauschhistorie.' },
        { icon: '🎯', title: 'Intelligentes Matching',   desc: 'Unser Algorithmus findet automatisch Tauschpartner, die genau das haben, was du brauchst — und brauchen, was du hast.' },
        { icon: '📱', title: 'Scannen via App',          desc: 'Sticker einfach per Kamera einscannen oder Nummer eingeben. Dein Album wird automatisch aktualisiert.' },
        { icon: '🌍', title: 'Mehrsprachig',             desc: 'Deutsch, Englisch, Französisch, Spanisch und 11 weitere Sprachen — tausche mit Sammlern aus ganz Europa.' },
        { icon: '🛡️', title: 'Betrugschutz',            desc: 'Rating-System, Tauschsperren bei Beschwerden, anonymisierte Adressvergabe und optionaler Tracking-Code-Pflicht.' },
        { icon: '⚡', title: 'Live-Marktplatz',          desc: 'Tauschangebote in Echtzeit — filtere nach Region, Versandkosten, Albumtyp und Tauschpartner-Bewertung.' },
      ],
    },
    trust: {
      title: 'Sicherheit zuerst',
      sub:   'Wir schützen unsere Community aktiv vor Betrug.',
      items: [
        { icon: '🔒', title: 'Adress-Anonymisierung',       desc: 'Echte Adressen bleiben verborgen bis zur Tauschbestätigung von beiden Seiten.' },
        { icon: '⭐', title: 'Reputationssystem',            desc: 'Jeder Tausch gibt Punkte. Schlechte Bewertungen wirken sofort auf Sichtbarkeit und Limits.' },
        { icon: '🚨', title: 'Meldesystem',                  desc: 'Betrug oder No-Show melden — wir prüfen innerhalb 24h und sperren bei Missbrauch.' },
        { icon: '📦', title: 'Tracking-Code (Pro)',          desc: 'Premium-User können Tracking-Pflicht aktivieren — so weiß jeder wo sein Paket ist.' },
        { icon: '🤝', title: 'Gegenseitige Bestätigung',     desc: 'Tausch gilt erst als abgeschlossen, wenn beide Seiten Erhalt bestätigt haben.' },
        { icon: '🏷️', title: 'Verifiziertes Profil-Badge',  desc: 'Tausche bevorzugt mit verifizierten Nutzern — erkennbar am grünen Häkchen.' },
      ],
    },
    pricing: {
      title:    'Pläne & Preise',
      sub:      'Sammeln ist kostenlos — wer mehr will, zahlt fair.',
      popular:  'BELIEBT',
      plans: [
        {
          name: 'Free', price: '0€', per: '/ Monat',
          desc: 'Für Gelegenheitssammler. Alle Grundfunktionen inklusive.',
          features: ['1 aktives Album', '10 Tausche / Monat', 'Basis-Matching', 'Öffentliches Profil'],
          disabled: ['Priorität im Matching', 'Smart-Pakete'],
          cta: 'Kostenlos starten',
        },
        {
          name: 'Pro', price: '2,99€', per: '/ Monat',
          desc: 'Für echte Sammler. Schneller fertig werden mit cleveren Features.',
          features: ['Unbegrenzte Alben', 'Unbegrenzte Tausche', 'Priorität im Matching', 'Smart-Pakete (5er, 10er)', 'Tracking-Code Pflicht', 'Ad-free Erlebnis'],
          disabled: [],
          cta: 'Pro testen',
          featured: true,
        },
        {
          name: 'Händler', price: '9,99€', per: '/ Monat',
          desc: 'Für Shops, die Doppelkarten kaufen oder verkaufen wollen.',
          features: ['Verkaufsfunktion (Fixpreis)', 'Shopseite mit eigenem Profil', 'Bulk-Import via CSV', 'Analytics & Umsatzbericht', 'Verifiziertes Händler-Badge', '5% Provision pro Verkauf'],
          disabled: [],
          cta: 'Als Händler starten',
        },
      ],
      revenue: {
        title: 'Einnahmemodelle',
        items: [
          { icon: '💳', title: 'Subscriptions',             desc: 'Free → Pro → Händler. Wiederkehrende Einnahmen, skalierbarer Revenue.' },
          { icon: '🏪', title: '5% Marktplatz-Fee',         desc: 'Auf jeden Sticker-Verkauf (kein Tausch) nehmen wir 5% Provision.' },
          { icon: '🎯', title: 'Panini-Partnerschaft',       desc: 'Affiliate-Links auf offizielle Startersets, Blindpacks, Sammelalben.' },
          { icon: '📊', title: 'Community-Daten (anonym)',   desc: 'Aggregierte Fehlkarten-Insights an Verlage / Retailer lizenzieren.' },
        ],
      },
    },
    concept: {
      title: 'Konzept & Technologie',
      sub:   'Was dahinter steckt — und wohin es geht.',
      cards: [
        { icon: '🏗️', title: 'Tech-Stack',              items: ['React / CRA Frontend (Vercel)', 'Supabase Backend (Auth, DB, Edge Functions)', 'Stripe für Subscriptions & Payments', 'Brevo SMTP für E-Mails & Notifications', 'i18next für 15 Sprachen', 'Claude API für Smart-Matching & Fraud-Detection', 'Cloudinary für Profilbilder & Sticker-Scans'] },
        { icon: '📅', title: 'Roadmap',                  items: ['Phase 1: MVP — Tauschbörse, Profil, Matching', 'Phase 2: Mobile App (React Native), Barcode-Scan', 'Phase 3: Händler-Modul, Verkaufsfunktion', 'Phase 4: Gamification (Achievements, Ranglisten)', 'Phase 5: AI-Wertschätzung seltener Sticker', 'Phase 6: Erweiterung auf Pokémon etc.'] },
        { icon: '🎯', title: 'Zielgruppe',               items: ['6–16 Mio. aktive Panini-Sammler in D-A-CH', 'WM/EM: Spikes mit 5–10x Nutzerwachstum', 'Kinder (mit Eltern-Account), Jugendliche, Erwachsene', 'Gelegentliche Sammler UND Hardcore-Komplettisten', 'Klubs, Schulen, Vereine als Gruppenkonten'] },
        { icon: '🔑', title: 'Alleinstellungsmerkmale',  items: ['Intelligentes Matching statt manueller Suche', 'Vollständiger Betrugschutz (Adress-Proxy, Rating)', '1.000+ Sticker pro Album sauber strukturiert', 'Mehrsprachig von Anfang an (15 Sprachen)', 'Keine anonymen User — nur Community', 'Design-Qualität wie eine Tech-Startup-App'] },
      ],
    },
    cta: {
      line1: 'DEIN ALBUM.',
      line2: 'WARTET AUF DICH.',
      sub:   'Kostenlos registrieren. Sofort loslegen.',
      btn:   '🚀 Jetzt kostenlos starten',
      fine:  'Kein Abo. Keine Kreditkarte. Für immer kostenlos nutzbar.',
    },
    footer: {
      copy:       '© 2026 StickerSwap · DSGVO-konform · Hamburg',
      impressum:  'Impressum',
      privacy:    'Datenschutz',
      terms:      'AGB',
    },
  },

  /* ── ENGLISH ── */
  en: {
    nav: { login: 'Sign in', start: 'Start for free' },
    hero: {
      eyebrow: '🏆 For World Cup 2026 & Euro Panini collectors',
      line1: 'SWAP.',
      line2: 'COLLECT.\nWIN.',
      sub: 'The first Panini trading platform with verified accounts, fraud protection and 1,000+ stickers per album — finally made simple.',
      cta: 'Register for free now',
      demo: 'View demo →',
    },
    stats: { users: 'Active collectors', swaps: 'Successful swaps', satisfaction: 'Satisfaction', albums: 'Active albums' },
    features: {
      title: 'Why StickerSwap?',
      sub: 'Because Facebook groups are so 2006.',
      items: [
        { icon: '🔐', title: '100% Verified Users',     desc: 'No anonymous profiles. Every user is verified by email — including reputation system and swap history.' },
        { icon: '🎯', title: 'Smart Matching',          desc: 'Our algorithm automatically finds trading partners who have exactly what you need — and need what you have.' },
        { icon: '📱', title: 'Scan via App',            desc: 'Scan stickers by camera or enter numbers manually. Your album updates automatically.' },
        { icon: '🌍', title: 'Multilingual',            desc: 'German, English, French, Spanish and 11 more languages — trade with collectors from across Europe.' },
        { icon: '🛡️', title: 'Fraud Protection',       desc: 'Rating system, swap blocks for complaints, anonymised address sharing and optional tracking code requirement.' },
        { icon: '⚡', title: 'Live Marketplace',        desc: 'Trade offers in real time — filter by region, shipping costs, album type and partner rating.' },
      ],
    },
    trust: {
      title: 'Safety first',
      sub: 'We actively protect our community from fraud.',
      items: [
        { icon: '🔒', title: 'Address Anonymisation',   desc: 'Real addresses stay hidden until both sides confirm the trade.' },
        { icon: '⭐', title: 'Reputation System',        desc: 'Every swap earns points. Poor ratings immediately affect visibility and limits.' },
        { icon: '🚨', title: 'Report System',            desc: 'Report fraud or no-shows — we investigate within 24h and ban on abuse.' },
        { icon: '📦', title: 'Tracking Code (Pro)',      desc: 'Premium users can require tracking numbers — so everyone knows where their parcel is.' },
        { icon: '🤝', title: 'Mutual Confirmation',      desc: 'A swap is only complete when both sides have confirmed receipt.' },
        { icon: '🏷️', title: 'Verified Profile Badge',  desc: 'Prefer trading with verified users — recognised by the green tick.' },
      ],
    },
    pricing: {
      title: 'Plans & Pricing',
      sub: 'Collecting is free — pay fairly for more.',
      popular: 'POPULAR',
      plans: [
        { name: 'Free', price: '€0', per: '/ month', desc: 'For casual collectors. All basic features included.', features: ['1 active album', '10 swaps / month', 'Basic matching', 'Public profile'], disabled: ['Priority matching', 'Smart packs'], cta: 'Start for free' },
        { name: 'Pro', price: '€2.99', per: '/ month', desc: 'For serious collectors. Finish faster with smart features.', features: ['Unlimited albums', 'Unlimited swaps', 'Priority matching', 'Smart packs (5, 10)', 'Tracking code requirement', 'Ad-free experience'], disabled: [], cta: 'Try Pro', featured: true },
        { name: 'Dealer', price: '€9.99', per: '/ month', desc: 'For shops buying or selling duplicate stickers.', features: ['Sell function (fixed price)', 'Shop page with own profile', 'Bulk import via CSV', 'Analytics & revenue report', 'Verified dealer badge', '5% commission per sale'], disabled: [], cta: 'Start as dealer' },
      ],
      revenue: {
        title: 'Revenue streams',
        items: [
          { icon: '💳', title: 'Subscriptions',         desc: 'Free → Pro → Dealer. Recurring revenue, scalable income.' },
          { icon: '🏪', title: '5% Marketplace fee',    desc: 'On every sticker sale (not swaps) we take 5% commission.' },
          { icon: '🎯', title: 'Panini partnership',    desc: 'Affiliate links to official starter packs, blind packs, sticker albums.' },
          { icon: '📊', title: 'Community data (anon)', desc: 'License aggregated missing-sticker insights to publishers / retailers.' },
        ],
      },
    },
    concept: {
      title: 'Concept & Technology',
      sub: 'What powers it — and where it\'s going.',
      cards: [
        { icon: '🏗️', title: 'Tech Stack',              items: ['React / CRA frontend (Vercel)', 'Supabase backend (Auth, DB, Edge Functions)', 'Stripe for subscriptions & payments', 'Brevo SMTP for emails & notifications', 'i18next for 15 languages', 'Claude API for smart matching & fraud detection', 'Cloudinary for profile pictures & sticker scans'] },
        { icon: '📅', title: 'Roadmap',                  items: ['Phase 1: MVP — marketplace, profile, matching', 'Phase 2: Mobile app (React Native), barcode scan', 'Phase 3: Dealer module, sell function', 'Phase 4: Gamification (achievements, leaderboards)', 'Phase 5: AI valuation of rare stickers', 'Phase 6: Expansion to Pokémon etc.'] },
        { icon: '🎯', title: 'Target audience',          items: ['6–16M active Panini collectors in DACH', 'World Cup / Euros: 5–10x user growth spikes', 'Children (with parent account), teens, adults', 'Casual collectors AND hardcore completionists', 'Clubs, schools, associations as group accounts'] },
        { icon: '🔑', title: 'USPs',                     items: ['Smart matching instead of manual search', 'Full fraud protection (address proxy, rating)', '1,000+ stickers per album cleanly structured', 'Multilingual from day one (15 languages)', 'No anonymous users — community only', 'Design quality like a tech startup app'] },
      ],
    },
    cta: { line1: 'YOUR ALBUM.', line2: 'IS WAITING.', sub: 'Register for free. Start immediately.', btn: '🚀 Start for free now', fine: 'No subscription. No credit card. Free forever.' },
    footer: { copy: '© 2026 StickerSwap · GDPR compliant · Hamburg', impressum: 'Imprint', privacy: 'Privacy', terms: 'Terms' },
  },

  /* ── FRANÇAIS ── */
  fr: {
    nav: { login: 'Se connecter', start: 'Commencer gratuitement' },
    hero: {
      eyebrow: '🏆 Pour les collectionneurs Panini Coupe du Monde 2026',
      line1: 'ÉCHANGE.',
      line2: 'COLLECTIONNE.\nGAGNE.',
      sub: 'La première bourse d\'échange Panini avec un système d\'utilisateurs vérifiés, une protection anti-fraude et plus de 1 000 stickers par album.',
      cta: 'S\'inscrire gratuitement',
      demo: 'Voir la démo →',
    },
    stats: { users: 'Collectionneurs actifs', swaps: 'Échanges réussis', satisfaction: 'Satisfaction', albums: 'Albums actifs' },
    features: {
      title: 'Pourquoi StickerSwap ?',
      sub: 'Parce que les groupes Facebook, c\'est 2006.',
      items: [
        { icon: '🔐', title: '100% Utilisateurs vérifiés',    desc: 'Pas de profils anonymes. Chaque utilisateur est vérifié par e-mail — avec système de réputation et historique.' },
        { icon: '🎯', title: 'Matching intelligent',           desc: 'Notre algorithme trouve automatiquement des partenaires d\'échange qui ont ce dont vous avez besoin.' },
        { icon: '📱', title: 'Scanner via l\'appli',           desc: 'Scannez les stickers par caméra ou saisissez le numéro. Votre album se met à jour automatiquement.' },
        { icon: '🌍', title: 'Multilingue',                    desc: 'Allemand, anglais, français, espagnol et 11 autres langues — échangez avec des collectionneurs européens.' },
        { icon: '🛡️', title: 'Protection anti-fraude',        desc: 'Système de notation, blocages d\'échange, adresses anonymisées et obligation de code de suivi optionnelle.' },
        { icon: '⚡', title: 'Marché en direct',               desc: 'Offres d\'échange en temps réel — filtrez par région, frais de port, type d\'album et notation.' },
      ],
    },
    trust: {
      title: 'La sécurité avant tout',
      sub: 'Nous protégeons activement notre communauté contre la fraude.',
      items: [
        { icon: '🔒', title: 'Anonymisation des adresses',     desc: 'Les vraies adresses restent cachées jusqu\'à la confirmation des deux parties.' },
        { icon: '⭐', title: 'Système de réputation',           desc: 'Chaque échange rapporte des points. Les mauvaises notes affectent immédiatement la visibilité.' },
        { icon: '🚨', title: 'Système de signalement',          desc: 'Signalez fraude ou no-show — nous vérifions en 24h et bannissons en cas d\'abus.' },
        { icon: '📦', title: 'Code de suivi (Pro)',             desc: 'Les utilisateurs premium peuvent exiger un suivi — tout le monde sait où est son colis.' },
        { icon: '🤝', title: 'Confirmation mutuelle',           desc: 'L\'échange n\'est complet que lorsque les deux parties confirment la réception.' },
        { icon: '🏷️', title: 'Badge de profil vérifié',        desc: 'Préférez échanger avec des utilisateurs vérifiés — reconnaissable à la coche verte.' },
      ],
    },
    pricing: {
      title: 'Formules & Tarifs',
      sub: 'Collecter est gratuit — payez équitablement pour plus.',
      popular: 'POPULAIRE',
      plans: [
        { name: 'Gratuit', price: '0€', per: '/ mois', desc: 'Pour les collectionneurs occasionnels. Toutes les fonctions de base incluses.', features: ['1 album actif', '10 échanges / mois', 'Matching de base', 'Profil public'], disabled: ['Priorité de matching', 'Packs intelligents'], cta: 'Commencer gratuitement' },
        { name: 'Pro', price: '2,99€', per: '/ mois', desc: 'Pour les vrais collectionneurs. Finissez plus vite avec des fonctions intelligentes.', features: ['Albums illimités', 'Échanges illimités', 'Priorité de matching', 'Packs intelligents (5, 10)', 'Obligation de code suivi', 'Sans publicité'], disabled: [], cta: 'Essayer Pro', featured: true },
        { name: 'Marchand', price: '9,99€', per: '/ mois', desc: 'Pour les boutiques qui achètent ou vendent des doubles.', features: ['Fonction de vente (prix fixe)', 'Page boutique avec profil', 'Import en masse via CSV', 'Analytiques & rapport', 'Badge marchand vérifié', '5% de commission par vente'], disabled: [], cta: 'Démarrer comme marchand' },
      ],
      revenue: {
        title: 'Modèles de revenus',
        items: [
          { icon: '💳', title: 'Abonnements',                  desc: 'Gratuit → Pro → Marchand. Revenus récurrents, croissance scalable.' },
          { icon: '🏪', title: 'Commission 5%',                desc: 'Sur chaque vente de sticker (pas les échanges), nous prenons 5%.' },
          { icon: '🎯', title: 'Partenariat Panini',           desc: 'Liens affiliés vers les packs officiels, blind packs et albums.' },
          { icon: '📊', title: 'Données communauté (anon)',    desc: 'Licence des insights sur les manques aux éditeurs et détaillants.' },
        ],
      },
    },
    concept: {
      title: 'Concept & Technologie',
      sub: 'Ce qui l\'alimente — et où ça va.',
      cards: [
        { icon: '🏗️', title: 'Stack technique',     items: ['Frontend React / CRA (Vercel)', 'Backend Supabase (Auth, DB, Edge Functions)', 'Stripe pour abonnements & paiements', 'Brevo SMTP pour e-mails & notifications', 'i18next pour 15 langues', 'API Claude pour matching & détection fraude', 'Cloudinary pour photos & scans'] },
        { icon: '📅', title: 'Feuille de route',    items: ['Phase 1 : MVP — bourse, profil, matching', 'Phase 2 : App mobile (React Native), scan code-barres', 'Phase 3 : Module marchand, fonction vente', 'Phase 4 : Gamification (succès, classements)', 'Phase 5 : Estimation IA des stickers rares', 'Phase 6 : Extension à Pokémon etc.'] },
        { icon: '🎯', title: 'Public cible',        items: ['6–16M collectionneurs Panini actifs en Europe', 'Coupe du Monde / Euro : pics 5–10x', 'Enfants (compte parent), ados, adultes', 'Collectionneurs occasionnels ET complétionnistes', 'Clubs, écoles, associations en comptes groupe'] },
        { icon: '🔑', title: 'Points distinctifs',  items: ['Matching intelligent plutôt que recherche manuelle', 'Protection fraude complète (proxy adresse, notation)', '1 000+ stickers par album bien structurés', 'Multilingue dès le départ (15 langues)', 'Pas d\'utilisateurs anonymes — communauté uniquement', 'Qualité design comme une vraie appli tech'] },
      ],
    },
    cta: { line1: 'TON ALBUM.', line2: 'T\'ATTEND.', sub: 'Inscrivez-vous gratuitement. Commencez immédiatement.', btn: '🚀 Commencer gratuitement', fine: 'Pas d\'abonnement. Pas de carte. Gratuit pour toujours.' },
    footer: { copy: '© 2026 StickerSwap · Conforme RGPD · Hambourg', impressum: 'Mentions légales', privacy: 'Confidentialité', terms: 'CGU' },
  },

  /* ── ESPAÑOL ── */
  es: {
    nav: { login: 'Iniciar sesión', start: 'Empezar gratis' },
    hero: {
      eyebrow: '🏆 Para coleccionistas Panini del Mundial 2026',
      line1: 'INTERCAMBIA.',
      line2: 'COLECCIONA.\nGANA.',
      sub: 'La primera bolsa de intercambio Panini con usuarios verificados, protección antifraude y más de 1.000 cromos por álbum.',
      cta: 'Registrarse gratis ahora',
      demo: 'Ver demo →',
    },
    stats: { users: 'Coleccionistas activos', swaps: 'Intercambios exitosos', satisfaction: 'Satisfacción', albums: 'Álbumes activos' },
    features: {
      title: '¿Por qué StickerSwap?',
      sub: 'Porque los grupos de Facebook son del 2006.',
      items: [
        { icon: '🔐', title: '100% Usuarios verificados',  desc: 'Sin perfiles anónimos. Cada usuario se verifica por email — con sistema de reputación e historial.' },
        { icon: '🎯', title: 'Emparejamiento inteligente', desc: 'Nuestro algoritmo encuentra automáticamente socios que tienen lo que necesitas — y necesitan lo que tienes.' },
        { icon: '📱', title: 'Escanear con la app',        desc: 'Escanea cromos con la cámara o introduce el número. Tu álbum se actualiza automáticamente.' },
        { icon: '🌍', title: 'Multilingüe',                desc: 'Alemán, inglés, francés, español y 11 idiomas más — intercambia con coleccionistas de toda Europa.' },
        { icon: '🛡️', title: 'Protección antifraude',     desc: 'Sistema de puntuación, bloqueos, direcciones anonimizadas y código de seguimiento opcional.' },
        { icon: '⚡', title: 'Mercado en vivo',            desc: 'Ofertas en tiempo real — filtra por región, gastos de envío, tipo de álbum y valoración.' },
      ],
    },
    trust: {
      title: 'La seguridad primero',
      sub: 'Protegemos activamente a nuestra comunidad contra el fraude.',
      items: [
        { icon: '🔒', title: 'Anonimización de dirección',  desc: 'Las direcciones reales permanecen ocultas hasta la confirmación mutua del intercambio.' },
        { icon: '⭐', title: 'Sistema de reputación',        desc: 'Cada intercambio da puntos. Las malas valoraciones afectan inmediatamente a la visibilidad.' },
        { icon: '🚨', title: 'Sistema de denuncias',         desc: 'Denuncia fraudes o no-shows — investigamos en 24h y baneamos en caso de abuso.' },
        { icon: '📦', title: 'Código de seguimiento (Pro)', desc: 'Los usuarios premium pueden exigir seguimiento — todos saben dónde está su paquete.' },
        { icon: '🤝', title: 'Confirmación mutua',           desc: 'El intercambio solo se completa cuando ambas partes confirman la recepción.' },
        { icon: '🏷️', title: 'Insignia de perfil verificado', desc: 'Prefiere intercambiar con usuarios verificados — reconocibles por el tic verde.' },
      ],
    },
    pricing: {
      title: 'Planes y Precios',
      sub: 'Coleccionar es gratis — paga de forma justa por más.',
      popular: 'POPULAR',
      plans: [
        { name: 'Gratis', price: '0€', per: '/ mes', desc: 'Para coleccionistas ocasionales. Todas las funciones básicas incluidas.', features: ['1 álbum activo', '10 intercambios / mes', 'Emparejamiento básico', 'Perfil público'], disabled: ['Prioridad en matching', 'Packs inteligentes'], cta: 'Empezar gratis' },
        { name: 'Pro', price: '2,99€', per: '/ mes', desc: 'Para coleccionistas serios. Termina antes con funciones inteligentes.', features: ['Álbumes ilimitados', 'Intercambios ilimitados', 'Prioridad en matching', 'Packs inteligentes (5, 10)', 'Código de seguimiento', 'Sin publicidad'], disabled: [], cta: 'Probar Pro', featured: true },
        { name: 'Vendedor', price: '9,99€', per: '/ mes', desc: 'Para tiendas que compran o venden cromos duplicados.', features: ['Función de venta (precio fijo)', 'Página de tienda propia', 'Importación masiva CSV', 'Analíticas e informe', 'Insignia de vendedor verificado', '5% comisión por venta'], disabled: [], cta: 'Empezar como vendedor' },
      ],
      revenue: {
        title: 'Modelos de ingresos',
        items: [
          { icon: '💳', title: 'Suscripciones',            desc: 'Gratis → Pro → Vendedor. Ingresos recurrentes y escalables.' },
          { icon: '🏪', title: 'Comisión 5%',              desc: 'En cada venta de cromos (no intercambios) tomamos el 5%.' },
          { icon: '🎯', title: 'Asociación Panini',         desc: 'Enlaces de afiliado a packs oficiales, blind packs y álbumes.' },
          { icon: '📊', title: 'Datos comunidad (anón)',    desc: 'Licenciar insights de cromos que faltan a editoriales y minoristas.' },
        ],
      },
    },
    concept: {
      title: 'Concepto y Tecnología',
      sub: 'Lo que hay detrás — y hacia dónde va.',
      cards: [
        { icon: '🏗️', title: 'Stack tecnológico',    items: ['Frontend React / CRA (Vercel)', 'Backend Supabase (Auth, DB, Edge Functions)', 'Stripe para suscripciones y pagos', 'Brevo SMTP para emails y notificaciones', 'i18next para 15 idiomas', 'API Claude para matching y detección fraude', 'Cloudinary para fotos y escaneos'] },
        { icon: '📅', title: 'Hoja de ruta',         items: ['Fase 1: MVP — bolsa, perfil, matching', 'Fase 2: App móvil (React Native), escáner código', 'Fase 3: Módulo vendedor, función de venta', 'Fase 4: Gamificación (logros, clasificaciones)', 'Fase 5: Valoración IA de cromos raros', 'Fase 6: Expansión a Pokémon etc.'] },
        { icon: '🎯', title: 'Público objetivo',     items: ['6–16M coleccionistas Panini activos en Europa', 'Mundial / Euro: picos de crecimiento 5–10x', 'Niños (con cuenta de padres), jóvenes, adultos', 'Coleccionistas ocasionales Y completistas', 'Clubes, escuelas, asociaciones como cuentas grupo'] },
        { icon: '🔑', title: 'Propuesta de valor',   items: ['Matching inteligente en vez de búsqueda manual', 'Protección fraude completa (proxy dirección, rating)', 'Más de 1.000 cromos por álbum bien estructurados', 'Multilingüe desde el primer día (15 idiomas)', 'Sin usuarios anónimos — solo comunidad', 'Calidad de diseño como app tecnológica'] },
      ],
    },
    cta: { line1: 'TU ÁLBUM.', line2: 'TE ESPERA.', sub: 'Regístrate gratis. Empieza de inmediato.', btn: '🚀 Empezar gratis ahora', fine: 'Sin suscripción. Sin tarjeta. Gratis para siempre.' },
    footer: { copy: '© 2026 StickerSwap · Conforme RGPD · Hamburgo', impressum: 'Aviso legal', privacy: 'Privacidad', terms: 'Términos' },
  },

  /* ── ITALIANO ── */
  it: {
    nav: { login: 'Accedi', start: 'Inizia gratis' },
    hero: {
      eyebrow: '🏆 Per i collezionisti Panini dei Mondiali 2026',
      line1: 'SCAMBIA.',
      line2: 'COLLEZIONA.\nVINCI.',
      sub: 'La prima borsa di scambio Panini con utenti verificati, protezione antifrode e oltre 1.000 figurine per album.',
      cta: 'Registrati gratis ora',
      demo: 'Guarda la demo →',
    },
    stats: { users: 'Collezionisti attivi', swaps: 'Scambi riusciti', satisfaction: 'Soddisfazione', albums: 'Album attivi' },
    features: {
      title: 'Perché StickerSwap?',
      sub: 'Perché i gruppi Facebook sono roba del 2006.',
      items: [
        { icon: '🔐', title: '100% Utenti verificati',      desc: 'Nessun profilo anonimo. Ogni utente è verificato via email — con sistema reputazione e storico scambi.' },
        { icon: '🎯', title: 'Abbinamento intelligente',    desc: 'Il nostro algoritmo trova automaticamente partner che hanno ciò che cerchi — e cercano ciò che hai.' },
        { icon: '📱', title: 'Scansione dall\'app',         desc: 'Scansiona le figurine con la fotocamera o inserisci il numero. L\'album si aggiorna automaticamente.' },
        { icon: '🌍', title: 'Multilingue',                 desc: 'Tedesco, inglese, francese, spagnolo e altri 11 lingue — scambia con collezionisti in tutta Europa.' },
        { icon: '🛡️', title: 'Protezione antifrode',       desc: 'Sistema di valutazione, blocchi scambi, indirizzi anonimi e codice tracciamento opzionale.' },
        { icon: '⚡', title: 'Mercato in tempo reale',      desc: 'Offerte di scambio in tempo reale — filtra per regione, spedizione, tipo album e valutazione.' },
      ],
    },
    trust: {
      title: 'La sicurezza prima di tutto',
      sub: 'Proteggiamo attivamente la nostra community dalle frodi.',
      items: [
        { icon: '🔒', title: 'Anonimizzazione indirizzo',  desc: 'Gli indirizzi reali restano nascosti fino alla conferma di entrambe le parti.' },
        { icon: '⭐', title: 'Sistema di reputazione',       desc: 'Ogni scambio guadagna punti. Le valutazioni negative influenzano subito visibilità e limiti.' },
        { icon: '🚨', title: 'Sistema di segnalazione',      desc: 'Segnala frodi o no-show — verifichiamo entro 24h e banniamo in caso di abuso.' },
        { icon: '📦', title: 'Codice tracciamento (Pro)',   desc: 'Gli utenti premium possono richiedere il tracciamento — così tutti sanno dov\'è il pacco.' },
        { icon: '🤝', title: 'Conferma reciproca',          desc: 'Lo scambio si completa solo quando entrambe le parti confermano la ricezione.' },
        { icon: '🏷️', title: 'Badge profilo verificato',   desc: 'Preferisci scambiare con utenti verificati — riconoscibili dalla spunta verde.' },
      ],
    },
    pricing: {
      title: 'Piani e Prezzi',
      sub: 'Collezionare è gratis — paga equamente per di più.',
      popular: 'POPOLARE',
      plans: [
        { name: 'Gratuito', price: '0€', per: '/ mese', desc: 'Per collezionisti occasionali. Tutte le funzioni base incluse.', features: ['1 album attivo', '10 scambi / mese', 'Abbinamento base', 'Profilo pubblico'], disabled: ['Priorità abbinamento', 'Pacchi intelligenti'], cta: 'Inizia gratis' },
        { name: 'Pro', price: '2,99€', per: '/ mese', desc: 'Per i veri collezionisti. Finisci prima con funzioni intelligenti.', features: ['Album illimitati', 'Scambi illimitati', 'Priorità abbinamento', 'Pacchi intelligenti (5, 10)', 'Tracciamento obbligatorio', 'Senza pubblicità'], disabled: [], cta: 'Prova Pro', featured: true },
        { name: 'Venditore', price: '9,99€', per: '/ mese', desc: 'Per negozi che comprano o vendono doppioni.', features: ['Funzione vendita (prezzo fisso)', 'Pagina negozio con profilo', 'Importazione massiva CSV', 'Analytics e report', 'Badge venditore verificato', '5% commissione per vendita'], disabled: [], cta: 'Inizia come venditore' },
      ],
      revenue: {
        title: 'Modelli di ricavo',
        items: [
          { icon: '💳', title: 'Abbonamenti',               desc: 'Gratuito → Pro → Venditore. Entrate ricorrenti, ricavi scalabili.' },
          { icon: '🏪', title: 'Commissione 5%',            desc: 'Su ogni vendita di figurine (non scambi) prendiamo il 5%.' },
          { icon: '🎯', title: 'Partnership Panini',         desc: 'Link affiliati a starter pack, blind pack e album ufficiali.' },
          { icon: '📊', title: 'Dati community (anonimi)',  desc: 'Licenza insight sulle figurine mancanti a editori e retailer.' },
        ],
      },
    },
    concept: {
      title: 'Concetto & Tecnologia',
      sub: 'Cosa c\'è dietro — e dove si va.',
      cards: [
        { icon: '🏗️', title: 'Stack tecnologico',   items: ['Frontend React / CRA (Vercel)', 'Backend Supabase (Auth, DB, Edge Functions)', 'Stripe per abbonamenti e pagamenti', 'Brevo SMTP per email e notifiche', 'i18next per 15 lingue', 'API Claude per matching e rilevamento frodi', 'Cloudinary per foto e scansioni'] },
        { icon: '📅', title: 'Roadmap',              items: ['Fase 1: MVP — borsa, profilo, matching', 'Fase 2: App mobile (React Native), scanner codice', 'Fase 3: Modulo venditore, funzione vendita', 'Fase 4: Gamification (achievement, classifiche)', 'Fase 5: Valutazione IA figurine rare', 'Fase 6: Espansione a Pokémon ecc.'] },
        { icon: '🎯', title: 'Target',               items: ['6–16M collezionisti Panini attivi in Europa', 'Mondiali / Euro: picchi 5–10x utenti', 'Bambini (con account genitori), ragazzi, adulti', 'Collezionisti occasionali E completisti', 'Club, scuole, associazioni come account gruppo'] },
        { icon: '🔑', title: 'USP',                  items: ['Abbinamento intelligente invece di ricerca manuale', 'Protezione frodi completa (proxy indirizzo, rating)', 'Oltre 1.000 figurine per album ben strutturate', 'Multilingue fin dall\'inizio (15 lingue)', 'Nessun utente anonimo — solo community', 'Qualità design come un\'app tech vera'] },
      ],
    },
    cta: { line1: 'IL TUO ALBUM.', line2: 'TI ASPETTA.', sub: 'Registrati gratis. Inizia subito.', btn: '🚀 Inizia gratis ora', fine: 'Nessun abbonamento. Nessuna carta. Gratis per sempre.' },
    footer: { copy: '© 2026 StickerSwap · Conforme GDPR · Amburgo', impressum: 'Note legali', privacy: 'Privacy', terms: 'Termini' },
  },

  /* ── PORTUGUÊS ── */
  pt: {
    nav: { login: 'Entrar', start: 'Começar grátis' },
    hero: {
      eyebrow: '🏆 Para colecionadores Panini da Copa do Mundo 2026',
      line1: 'TROCA.',
      line2: 'COLECIONA.\nGANHA.',
      sub: 'A primeira bolsa de troca Panini com utilizadores verificados, proteção antifraude e mais de 1.000 cromos por álbum.',
      cta: 'Registar grátis agora',
      demo: 'Ver demo →',
    },
    stats: { users: 'Colecionadores ativos', swaps: 'Trocas bem-sucedidas', satisfaction: 'Satisfação', albums: 'Álbuns ativos' },
    features: {
      title: 'Porquê o StickerSwap?',
      sub: 'Porque os grupos do Facebook são coisa de 2006.',
      items: [
        { icon: '🔐', title: '100% Utilizadores verificados', desc: 'Sem perfis anónimos. Cada utilizador é verificado por email — com sistema de reputação e histórico.' },
        { icon: '🎯', title: 'Correspondência inteligente',   desc: 'O nosso algoritmo encontra automaticamente parceiros que têm o que precisas — e precisam do que tens.' },
        { icon: '📱', title: 'Digitalizar pela app',          desc: 'Digitaliza cromos pela câmera ou insere o número. O teu álbum atualiza-se automaticamente.' },
        { icon: '🌍', title: 'Multilingue',                   desc: 'Alemão, inglês, francês, espanhol e outros 11 idiomas — troca com colecionadores de toda a Europa.' },
        { icon: '🛡️', title: 'Proteção antifraude',          desc: 'Sistema de avaliação, bloqueios de troca, endereços anonimizados e código de rastreamento opcional.' },
        { icon: '⚡', title: 'Mercado em direto',             desc: 'Ofertas de troca em tempo real — filtra por região, envio, tipo de álbum e avaliação.' },
      ],
    },
    trust: {
      title: 'Segurança em primeiro lugar',
      sub: 'Protegemos ativamente a nossa comunidade contra fraudes.',
      items: [
        { icon: '🔒', title: 'Anonimização de endereço',      desc: 'Os endereços reais ficam ocultos até à confirmação mútua da troca.' },
        { icon: '⭐', title: 'Sistema de reputação',           desc: 'Cada troca dá pontos. Avaliações negativas afetam imediatamente a visibilidade.' },
        { icon: '🚨', title: 'Sistema de denúncias',           desc: 'Denuncia fraudes ou no-shows — verificamos em 24h e banimos em caso de abuso.' },
        { icon: '📦', title: 'Código de rastreamento (Pro)',  desc: 'Os utilizadores premium podem exigir rastreamento — todos sabem onde está o pacote.' },
        { icon: '🤝', title: 'Confirmação mútua',              desc: 'A troca só fica completa quando ambas as partes confirmam a receção.' },
        { icon: '🏷️', title: 'Distintivo de perfil verificado', desc: 'Prefere trocar com utilizadores verificados — reconhecíveis pelo visto verde.' },
      ],
    },
    pricing: {
      title: 'Planos e Preços',
      sub: 'Colecionar é grátis — paga de forma justa por mais.',
      popular: 'POPULAR',
      plans: [
        { name: 'Grátis', price: '0€', per: '/ mês', desc: 'Para colecionadores ocasionais. Todas as funções básicas incluídas.', features: ['1 álbum ativo', '10 trocas / mês', 'Correspondência básica', 'Perfil público'], disabled: ['Prioridade na correspondência', 'Pacotes inteligentes'], cta: 'Começar grátis' },
        { name: 'Pro', price: '2,99€', per: '/ mês', desc: 'Para colecionadores a sério. Termina mais rápido com funções inteligentes.', features: ['Álbuns ilimitados', 'Trocas ilimitadas', 'Prioridade na correspondência', 'Pacotes inteligentes (5, 10)', 'Código de rastreamento', 'Sem publicidade'], disabled: [], cta: 'Experimentar Pro', featured: true },
        { name: 'Vendedor', price: '9,99€', per: '/ mês', desc: 'Para lojas que compram ou vendem duplicados.', features: ['Função de venda (preço fixo)', 'Página de loja com perfil', 'Importação em massa CSV', 'Análises e relatório', 'Distintivo de vendedor verificado', '5% comissão por venda'], disabled: [], cta: 'Começar como vendedor' },
      ],
      revenue: {
        title: 'Modelos de receita',
        items: [
          { icon: '💳', title: 'Subscrições',               desc: 'Grátis → Pro → Vendedor. Receita recorrente, crescimento escalável.' },
          { icon: '🏪', title: 'Comissão 5%',               desc: 'Em cada venda de cromos (não trocas) ficamos com 5%.' },
          { icon: '🎯', title: 'Parceria Panini',            desc: 'Links afiliados para packs oficiais, blind packs e álbuns.' },
          { icon: '📊', title: 'Dados comunidade (anón)',   desc: 'Licenciar insights de cromos em falta a editoras e retalhistas.' },
        ],
      },
    },
    concept: {
      title: 'Conceito & Tecnologia',
      sub: 'O que está por trás — e para onde vai.',
      cards: [
        { icon: '🏗️', title: 'Stack tecnológico',  items: ['Frontend React / CRA (Vercel)', 'Backend Supabase (Auth, DB, Edge Functions)', 'Stripe para subscrições e pagamentos', 'Brevo SMTP para emails e notificações', 'i18next para 15 idiomas', 'API Claude para matching e deteção fraude', 'Cloudinary para fotos e digitalizações'] },
        { icon: '📅', title: 'Roteiro',             items: ['Fase 1: MVP — bolsa, perfil, matching', 'Fase 2: App mobile (React Native), scanner', 'Fase 3: Módulo vendedor, função de venda', 'Fase 4: Gamificação (conquistas, classificações)', 'Fase 5: Avaliação IA de cromos raros', 'Fase 6: Expansão para Pokémon etc.'] },
        { icon: '🎯', title: 'Público-alvo',        items: ['6–16M colecionadores Panini ativos na Europa', 'Mundial / Euro: picos 5–10x utilizadores', 'Crianças (com conta pais), jovens, adultos', 'Colecionadores ocasionais E completistas', 'Clubes, escolas, associações como contas grupo'] },
        { icon: '🔑', title: 'Diferenciais',        items: ['Correspondência inteligente em vez de pesquisa manual', 'Proteção fraude completa (proxy endereço, rating)', 'Mais de 1.000 cromos por álbum bem estruturados', 'Multilingue desde o início (15 idiomas)', 'Sem utilizadores anónimos — só comunidade', 'Qualidade de design como app tech de verdade'] },
      ],
    },
    cta: { line1: 'O TEU ÁLBUM.', line2: 'ESTÁ À ESPERA.', sub: 'Regista-te grátis. Começa imediatamente.', btn: '🚀 Começar grátis agora', fine: 'Sem subscrição. Sem cartão. Grátis para sempre.' },
    footer: { copy: '© 2026 StickerSwap · Conforme RGPD · Hamburgo', impressum: 'Aviso legal', privacy: 'Privacidade', terms: 'Termos' },
  },

  /* ── POLSKI ── */
  pl: {
    nav: { login: 'Zaloguj się', start: 'Zacznij za darmo' },
    hero: {
      eyebrow: '🏆 Dla kolekcjonerów Panini Mistrzostw Świata 2026',
      line1: 'WYMIENIAJ.',
      line2: 'ZBIERAJ.\nWYGRYWAJ.',
      sub: 'Pierwsza giełda wymian Panini z weryfikowanymi użytkownikami, ochroną przed oszustwami i ponad 1000 naklejek na album.',
      cta: 'Zarejestruj się za darmo',
      demo: 'Zobacz demo →',
    },
    stats: { users: 'Aktywni kolekcjonerzy', swaps: 'Udane wymiany', satisfaction: 'Zadowolenie', albums: 'Aktywne albumy' },
    features: {
      title: 'Dlaczego StickerSwap?',
      sub: 'Bo grupy na Facebooku to był 2006 rok.',
      items: [
        { icon: '🔐', title: '100% Zweryfikowani użytkownicy', desc: 'Żadnych anonimowych profili. Każdy użytkownik jest weryfikowany emailem — z systemem reputacji i historią.' },
        { icon: '🎯', title: 'Inteligentne dopasowanie',       desc: 'Nasz algorytm automatycznie znajduje partnerów, którzy mają to, czego potrzebujesz.' },
        { icon: '📱', title: 'Skanowanie przez aplikację',     desc: 'Skanuj naklejki kamerą lub wpisz numer. Album aktualizuje się automatycznie.' },
        { icon: '🌍', title: 'Wielojęzyczny',                  desc: 'Niemiecki, angielski, francuski, hiszpański i 11 innych języków — wymieniaj z kolekcjonerami z całej Europy.' },
        { icon: '🛡️', title: 'Ochrona przed oszustwami',      desc: 'System ocen, blokady wymian, anonimizacja adresów i opcjonalny obowiązek kodu śledzenia.' },
        { icon: '⚡', title: 'Rynek na żywo',                  desc: 'Oferty wymian w czasie rzeczywistym — filtruj według regionu, kosztów wysyłki i oceny.' },
      ],
    },
    trust: {
      title: 'Bezpieczeństwo przede wszystkim',
      sub: 'Aktywnie chronimy naszą społeczność przed oszustwami.',
      items: [
        { icon: '🔒', title: 'Anonimizacja adresu',           desc: 'Prawdziwe adresy pozostają ukryte do wzajemnego potwierdzenia wymiany.' },
        { icon: '⭐', title: 'System reputacji',               desc: 'Każda wymiana daje punkty. Złe oceny natychmiast wpływają na widoczność.' },
        { icon: '🚨', title: 'System zgłoszeń',                desc: 'Zgłaszaj oszustwa lub no-show — sprawdzamy w 24h i banujemy przy nadużyciach.' },
        { icon: '📦', title: 'Kod śledzenia (Pro)',            desc: 'Użytkownicy premium mogą wymagać śledzenia — każdy wie, gdzie jest paczka.' },
        { icon: '🤝', title: 'Wzajemne potwierdzenie',         desc: 'Wymiana jest zakończona dopiero gdy obie strony potwierdzą odbiór.' },
        { icon: '🏷️', title: 'Zweryfikowana odznaka profilu', desc: 'Preferuj wymiany ze zweryfikowanymi użytkownikami — oznaczonymi zielonym znacznikiem.' },
      ],
    },
    pricing: {
      title: 'Plany i Ceny',
      sub: 'Zbieranie jest darmowe — płać uczciwie za więcej.',
      popular: 'POPULARNE',
      plans: [
        { name: 'Darmowy', price: '0€', per: '/ miesiąc', desc: 'Dla okazjonalnych kolekcjonerów. Wszystkie podstawowe funkcje w zestawie.', features: ['1 aktywny album', '10 wymian / miesiąc', 'Podstawowe dopasowanie', 'Publiczny profil'], disabled: ['Priorytet dopasowania', 'Inteligentne pakiety'], cta: 'Zacznij za darmo' },
        { name: 'Pro', price: '2,99€', per: '/ miesiąc', desc: 'Dla prawdziwych kolekcjonerów. Skończ szybciej z inteligentnymi funkcjami.', features: ['Nieograniczone albumy', 'Nieograniczone wymiany', 'Priorytet dopasowania', 'Inteligentne pakiety (5, 10)', 'Obowiązek kodu śledzenia', 'Bez reklam'], disabled: [], cta: 'Wypróbuj Pro', featured: true },
        { name: 'Sprzedawca', price: '9,99€', per: '/ miesiąc', desc: 'Dla sklepów kupujących lub sprzedających duplikaty.', features: ['Funkcja sprzedaży (stała cena)', 'Strona sklepu z profilem', 'Import masowy CSV', 'Analityka i raport', 'Zweryfikowana odznaka sprzedawcy', '5% prowizji za sprzedaż'], disabled: [], cta: 'Zacznij jako sprzedawca' },
      ],
      revenue: { title: 'Modele przychodów', items: [{ icon:'💳', title:'Subskrypcje', desc:'Darmowy → Pro → Sprzedawca. Powtarzające się przychody.' }, { icon:'🏪', title:'Prowizja 5%', desc:'Od każdej sprzedaży naklejek (nie wymian) pobieramy 5%.' }, { icon:'🎯', title:'Partnerstwo Panini', desc:'Linki afiliacyjne do oficjalnych pakietów startowych i albumów.' }, { icon:'📊', title:'Dane społeczności (anon)', desc:'Licencjonowanie danych o brakujących naklejkach dla wydawców.' }] },
    },
    concept: {
      title: 'Koncepcja i Technologia', sub: 'Co kryje się za tym — i dokąd zmierza.',
      cards: [
        { icon:'🏗️', title:'Stack technologiczny', items:['Frontend React / CRA (Vercel)','Backend Supabase (Auth, DB, Edge Functions)','Stripe do subskrypcji i płatności','Brevo SMTP do emaili i powiadomień','i18next dla 15 języków','Claude API do matchingu i wykrywania oszustw','Cloudinary dla zdjęć i skanów'] },
        { icon:'📅', title:'Plan działania', items:['Faza 1: MVP — giełda, profil, matching','Faza 2: Aplikacja mobilna (React Native), skaner','Faza 3: Moduł sprzedawcy','Faza 4: Grywalizacja (osiągnięcia, rankingi)','Faza 5: Wycena AI rzadkich naklejek','Faza 6: Rozszerzenie na Pokémon itp.'] },
        { icon:'🎯', title:'Grupa docelowa', items:['6–16M aktywnych kolekcjonerów Panini w Europie','Mistrzostwa: wzrosty 5–10x użytkowników','Dzieci (z kontem rodziców), młodzież, dorośli','Okazjonalni kolekcjonerzy I kompletniści','Kluby, szkoły, stowarzyszenia jako konta grupowe'] },
        { icon:'🔑', title:'USP', items:['Inteligentne dopasowanie zamiast ręcznego wyszukiwania','Pełna ochrona przed oszustwami','Ponad 1000 naklejek na album','Wielojęzyczny od pierwszego dnia (15 języków)','Żadnych anonimowych użytkowników','Jakość projektu jak aplikacja technologiczna'] },
      ],
    },
    cta: { line1: 'TWÓJ ALBUM.', line2: 'CZEKA NA CIEBIE.', sub: 'Zarejestruj się za darmo. Zacznij od razu.', btn: '🚀 Zacznij za darmo teraz', fine: 'Bez subskrypcji. Bez karty. Za darmo na zawsze.' },
    footer: { copy: '© 2026 StickerSwap · Zgodny z RODO · Hamburg', impressum: 'Stopka redakcyjna', privacy: 'Prywatność', terms: 'Warunki' },
  },

  /* ── NEDERLANDS ── */
  nl: {
    nav: { login: 'Inloggen', start: 'Gratis beginnen' },
    hero: {
      eyebrow: '🏆 Voor Panini-verzamelaars van het WK 2026',
      line1: 'RUIL.',
      line2: 'VERZAMEL.\nWIN.',
      sub: 'De eerste Panini-ruilbeurs met geverifieerde gebruikers, fraudebescherming en meer dan 1.000 stickers per album.',
      cta: 'Gratis registreren',
      demo: 'Demo bekijken →',
    },
    stats: { users: 'Actieve verzamelaars', swaps: 'Geslaagde ruilingen', satisfaction: 'Tevredenheid', albums: 'Actieve albums' },
    features: {
      title: 'Waarom StickerSwap?',
      sub: 'Omdat Facebook-groepen van 2006 zijn.',
      items: [
        { icon:'🔐', title:'100% Geverifieerde gebruikers', desc:'Geen anonieme profielen. Elke gebruiker wordt geverifieerd per e-mail — inclusief reputatiesysteem.' },
        { icon:'🎯', title:'Slimme koppeling',              desc:'Ons algoritme vindt automatisch ruilpartners die precies hebben wat jij nodig hebt.' },
        { icon:'📱', title:'Scannen via app',               desc:'Scan stickers met de camera of voer het nummer in. Jouw album wordt automatisch bijgewerkt.' },
        { icon:'🌍', title:'Meertalig',                     desc:'Duits, Engels, Frans, Spaans en 11 andere talen — ruil met verzamelaars uit heel Europa.' },
        { icon:'🛡️', title:'Fraudebescherming',            desc:'Beoordelingssysteem, ruilblokkades, geanonimiseerde adressen en optionele trackingcode.' },
        { icon:'⚡', title:'Live marktplaats',              desc:'Ruilaanbiedingen in realtime — filter op regio, verzendkosten, albumtype en beoordeling.' },
      ],
    },
    trust: {
      title: 'Veiligheid voorop',
      sub: 'Wij beschermen onze community actief tegen fraude.',
      items: [
        { icon:'🔒', title:'Adresanonimisering',          desc:'Echte adressen blijven verborgen totdat beide partijen de ruil bevestigen.' },
        { icon:'⭐', title:'Reputatiesysteem',             desc:'Elke ruil geeft punten. Slechte beoordelingen beïnvloeden direct de zichtbaarheid.' },
        { icon:'🚨', title:'Meldingssysteem',              desc:'Meld fraude of no-shows — wij onderzoeken binnen 24u en bannen bij misbruik.' },
        { icon:'📦', title:'Trackingcode (Pro)',           desc:'Premium gebruikers kunnen tracking verplicht stellen — zo weet iedereen waar het pakket is.' },
        { icon:'🤝', title:'Wederzijdse bevestiging',      desc:'Een ruil is pas compleet als beide partijen ontvangst hebben bevestigd.' },
        { icon:'🏷️', title:'Geverifieerd profielbadge',  desc:'Ruil bij voorkeur met geverifieerde gebruikers — herkenbaar aan het groene vinkje.' },
      ],
    },
    pricing: {
      title: 'Abonnementen & Prijzen',
      sub: 'Verzamelen is gratis — betaal eerlijk voor meer.',
      popular: 'POPULAIR',
      plans: [
        { name:'Gratis', price:'€0', per:'/ maand', desc:'Voor gelegenheidsverzamelaars. Alle basisfuncties inbegrepen.', features:['1 actief album','10 ruilingen / maand','Basis koppeling','Openbaar profiel'], disabled:['Prioriteit koppeling','Slimme pakketten'], cta:'Gratis beginnen' },
        { name:'Pro', price:'€2,99', per:'/ maand', desc:'Voor echte verzamelaars. Sneller klaar met slimme functies.', features:['Onbeperkte albums','Onbeperkte ruilingen','Prioriteit koppeling','Slimme pakketten (5, 10)','Trackingcode verplicht','Advertentievrij'], disabled:[], cta:'Pro uitproberen', featured:true },
        { name:'Handelaar', price:'€9,99', per:'/ maand', desc:'Voor winkels die dubbele stickers kopen of verkopen.', features:['Verkoopfunctie (vaste prijs)','Winkelpagina met profiel','Bulkimport via CSV','Analytics & omzetrapport','Geverifieerd handelaarsbadge','5% commissie per verkoop'], disabled:[], cta:'Als handelaar starten' },
      ],
      revenue: { title:'Inkomstenmodellen', items:[{icon:'💳',title:'Abonnementen',desc:'Gratis → Pro → Handelaar.'},{icon:'🏪',title:'5% marktplaatsvergoeding',desc:'Op elke stickerverkoop nemen wij 5%.'},{icon:'🎯',title:'Panini-partnerschap',desc:'Affiliatelinks naar officiële starterpakketten.'},{icon:'📊',title:'Communitydata (anoniem)',desc:'Geaggregeerde inzichten licentiëren aan uitgevers.'}] },
    },
    concept: {
      title:'Concept & Technologie', sub:'Wat erachter zit — en waar het naartoe gaat.',
      cards:[
        {icon:'🏗️',title:'Tech-stack',items:['React / CRA frontend (Vercel)','Supabase backend','Stripe voor abonnementen','Brevo SMTP voor e-mails','i18next voor 15 talen','Claude API voor matching','Cloudinary voor foto\'s']},
        {icon:'📅',title:'Roadmap',items:['Fase 1: MVP','Fase 2: Mobiele app, barcodescan','Fase 3: Handelaarsmodule','Fase 4: Gamification','Fase 5: AI-waardering zeldzame stickers','Fase 6: Uitbreiding naar Pokémon etc.']},
        {icon:'🎯',title:'Doelgroep',items:['6–16M actieve Panini-verzamelaars in Europa','WK/EK: pieken 5–10x','Kinderen (met ouderaccount), jongeren, volwassenen','Gelegenheidsverzamelaars EN completisten','Clubs, scholen, verenigingen als groepsaccounts']},
        {icon:'🔑',title:'USP\'s',items:['Slimme koppeling i.p.v. handmatig zoeken','Volledige fraudebescherming','1.000+ stickers per album','Meertalig vanaf dag één (15 talen)','Geen anonieme gebruikers','Ontwerpkwaliteit als een tech-startup-app']},
      ],
    },
    cta:{ line1:'JOUW ALBUM.', line2:'WACHT OP JOU.', sub:'Gratis registreren. Meteen beginnen.', btn:'🚀 Nu gratis beginnen', fine:'Geen abonnement. Geen creditcard. Voor altijd gratis.' },
    footer:{ copy:'© 2026 StickerSwap · AVG-conform · Hamburg', impressum:'Colofon', privacy:'Privacy', terms:'Voorwaarden' },
  },

  /* ── ROMÂNĂ ── */
  ro: {
    nav:{ login:'Autentificare', start:'Începe gratuit' },
    hero:{ eyebrow:'🏆 Pentru colecționarii Panini Cupa Mondială 2026', line1:'SCHIMBĂ.', line2:'COLECȚIONEAZĂ.\nCÂȘTIGĂ.', sub:'Prima bursă de schimb Panini cu utilizatori verificați, protecție antifraude și peste 1.000 de stickere per album.', cta:'Înregistrează-te gratuit', demo:'Vezi demo →' },
    stats:{ users:'Colecționari activi', swaps:'Schimburi reușite', satisfaction:'Satisfacție', albums:'Albume active' },
    features:{ title:'De ce StickerSwap?', sub:'Pentru că grupurile de Facebook au rămas în 2006.',
      items:[{icon:'🔐',title:'100% Utilizatori verificați',desc:'Fără profiluri anonime. Fiecare utilizator este verificat prin email.'},{icon:'🎯',title:'Potrivire inteligentă',desc:'Algoritmul nostru găsește automat parteneri care au ce îți trebuie.'},{icon:'📱',title:'Scanare prin aplicație',desc:'Scanează stickerele cu camera sau introdu numărul. Albumul se actualizează automat.'},{icon:'🌍',title:'Multilingv',desc:'Germană, engleză, franceză, spaniolă și alte 11 limbi.'},{icon:'🛡️',title:'Protecție antifraude',desc:'Sistem de evaluare, blocaje de schimb, adrese anonimizate.'},{icon:'⚡',title:'Piață în direct',desc:'Oferte de schimb în timp real — filtrează după regiune și evaluare.'}] },
    trust:{ title:'Siguranța pe primul loc', sub:'Protejăm activ comunitatea noastră împotriva fraudei.',
      items:[{icon:'🔒',title:'Anonimizare adresă',desc:'Adresele reale rămân ascunse până la confirmarea reciprocă.'},{icon:'⭐',title:'Sistem de reputație',desc:'Fiecare schimb aduce puncte. Evaluările proaste afectează imediat vizibilitatea.'},{icon:'🚨',title:'Sistem de raportare',desc:'Raportează fraude — investigăm în 24h.'},{icon:'📦',title:'Cod urmărire (Pro)',desc:'Utilizatorii premium pot impune urmărirea coletului.'},{icon:'🤝',title:'Confirmare reciprocă',desc:'Schimbul e complet doar când ambele părți confirmă primirea.'},{icon:'🏷️',title:'Insignă profil verificat',desc:'Preferă schimburile cu utilizatori verificați.'}] },
    pricing:{ title:'Planuri și Prețuri', sub:'Colecționarea e gratuită — plătești corect pentru mai mult.', popular:'POPULAR',
      plans:[
        {name:'Gratuit',price:'0€',per:'/ lună',desc:'Pentru colecționarii ocazionali.',features:['1 album activ','10 schimburi / lună','Potrivire de bază','Profil public'],disabled:['Prioritate potrivire','Pachete inteligente'],cta:'Începe gratuit'},
        {name:'Pro',price:'2,99€',per:'/ lună',desc:'Pentru colecționarii serioși.',features:['Albume nelimitate','Schimburi nelimitate','Prioritate potrivire','Pachete inteligente','Cod urmărire','Fără reclame'],disabled:[],cta:'Încearcă Pro',featured:true},
        {name:'Vânzător',price:'9,99€',per:'/ lună',desc:'Pentru magazine care cumpără sau vând duplicate.',features:['Funcție vânzare','Pagină magazin','Import CSV','Analize și raport','Insignă vânzător verificat','5% comision per vânzare'],disabled:[],cta:'Începe ca vânzător'},
      ],
      revenue:{title:'Modele de venit',items:[{icon:'💳',title:'Abonamente',desc:'Gratuit → Pro → Vânzător.'},{icon:'🏪',title:'Comision 5%',desc:'La fiecare vânzare de stickere luăm 5%.'},{icon:'🎯',title:'Parteneriat Panini',desc:'Linkuri afiliate la pachete oficiale.'},{icon:'📊',title:'Date comunitate (anonim)',desc:'Licențierea datelor despre stickerele lipsă.'}]},
    },
    concept:{title:'Concept & Tehnologie',sub:'Ce stă la bază — și unde merge.',cards:[{icon:'🏗️',title:'Stack tehnic',items:['Frontend React / CRA (Vercel)','Backend Supabase','Stripe pentru plăți','Brevo pentru emailuri','i18next pentru 15 limbi','Claude API','Cloudinary']},{icon:'📅',title:'Foaie de parcurs',items:['Faza 1: MVP','Faza 2: App mobilă','Faza 3: Modul vânzător','Faza 4: Gamification','Faza 5: Evaluare AI','Faza 6: Extindere']},{icon:'🎯',title:'Public țintă',items:['6–16M colecționari Panini în Europa','Cupe: creșteri 5–10x','Copii, tineri, adulți','Ocazionali și completiști','Cluburi, școli, asociații']},{icon:'🔑',title:'USP',items:['Potrivire inteligentă','Protecție completă antifraudă','1.000+ stickere per album','Multilingv (15 limbi)','Fără utilizatori anonimi','Design de calitate']}]},
    cta:{line1:'ALBUMUL TĂU.',line2:'TE AȘTEAPTĂ.',sub:'Înregistrează-te gratuit. Începe imediat.',btn:'🚀 Începe gratuit acum',fine:'Fără abonament. Fără card. Gratuit pentru totdeauna.'},
    footer:{copy:'© 2026 StickerSwap · Conform GDPR · Hamburg',impressum:'Mențiuni legale',privacy:'Confidențialitate',terms:'Termeni'},
  },

  /* ── ČEŠTINA ── */
  cs: {
    nav:{ login:'Přihlásit se', start:'Začít zdarma' },
    hero:{ eyebrow:'🏆 Pro sběratele Panini MS 2026', line1:'VYMĚŇUJ.', line2:'SBÍREJ.\nVYHRÁVEJ.', sub:'První burza výměn Panini s ověřenými uživateli, ochranou před podvody a více než 1 000 nálepkami na album.', cta:'Registrovat se zdarma', demo:'Zobrazit demo →' },
    stats:{ users:'Aktivní sběratelé', swaps:'Úspěšné výměny', satisfaction:'Spokojenost', albums:'Aktivní alba' },
    features:{ title:'Proč StickerSwap?', sub:'Protože facebookové skupiny jsou z roku 2006.',
      items:[{icon:'🔐',title:'100% Ověření uživatelé',desc:'Žádné anonymní profily. Každý uživatel je ověřen emailem.'},{icon:'🎯',title:'Inteligentní párování',desc:'Náš algoritmus automaticky nachází partnery s tím, co potřebuješ.'},{icon:'📱',title:'Skenování přes aplikaci',desc:'Skenuj nálepky kamerou nebo zadej číslo. Album se aktualizuje automaticky.'},{icon:'🌍',title:'Vícejazyčný',desc:'Němčina, angličtina, francouzština, španělština a dalších 11 jazyků.'},{icon:'🛡️',title:'Ochrana před podvody',desc:'Hodnotící systém, blokace výměn, anonymizace adres.'},{icon:'⚡',title:'Živé tržiště',desc:'Nabídky výměn v reálném čase — filtruj podle regionu a hodnocení.'}] },
    trust:{ title:'Bezpečnost na prvním místě', sub:'Aktivně chráníme naši komunitu před podvody.',
      items:[{icon:'🔒',title:'Anonymizace adresy',desc:'Skutečné adresy zůstávají skryté do vzájemného potvrzení.'},{icon:'⭐',title:'Systém reputace',desc:'Každá výměna přináší body. Špatná hodnocení okamžitě ovlivní viditelnost.'},{icon:'🚨',title:'Systém nahlášení',desc:'Nahlaste podvod — prověříme do 24h.'},{icon:'📦',title:'Sledovací kód (Pro)',desc:'Prémiový uživatelé mohou vyžadovat sledování zásilky.'},{icon:'🤝',title:'Vzájemné potvrzení',desc:'Výměna je dokončena, až obě strany potvrdí přijetí.'},{icon:'🏷️',title:'Ověřený profilový odznak',desc:'Preferuj výměny s ověřenými uživateli.'}] },
    pricing:{ title:'Plány a ceny', sub:'Sbírání je zdarma — za více platiš férově.', popular:'OBLÍBENÉ',
      plans:[
        {name:'Zdarma',price:'0€',per:'/ měsíc',desc:'Pro příležitostné sběratele.',features:['1 aktivní album','10 výměn / měsíc','Základní párování','Veřejný profil'],disabled:['Prioritní párování','Chytré balíčky'],cta:'Začít zdarma'},
        {name:'Pro',price:'2,99€',per:'/ měsíc',desc:'Pro skutečné sběratele.',features:['Neomezená alba','Neomezené výměny','Prioritní párování','Chytré balíčky (5, 10)','Povinný sledovací kód','Bez reklam'],disabled:[],cta:'Vyzkoušet Pro',featured:true},
        {name:'Prodejce',price:'9,99€',per:'/ měsíc',desc:'Pro obchody kupující nebo prodávající duplikáty.',features:['Funkce prodeje','Stránka obchodu','Hromadný import CSV','Analytika a report','Ověřený odznak prodejce','5% provize za prodej'],disabled:[],cta:'Začít jako prodejce'},
      ],
      revenue:{title:'Modely příjmů',items:[{icon:'💳',title:'Předplatné',desc:'Zdarma → Pro → Prodejce.'},{icon:'🏪',title:'5% poplatek',desc:'Z každého prodeje nálepek bereme 5%.'},{icon:'🎯',title:'Partnerství Panini',desc:'Affiliate odkazy na oficiální balíčky.'},{icon:'📊',title:'Data komunity (anon)',desc:'Licence dat o chybějících nálepkách.'}]},
    },
    concept:{title:'Koncept & Technologie',sub:'Co za tím stojí — a kam to směřuje.',cards:[{icon:'🏗️',title:'Tech stack',items:['Frontend React / CRA (Vercel)','Backend Supabase','Stripe pro platby','Brevo pro emaily','i18next pro 15 jazyků','Claude API','Cloudinary']},{icon:'📅',title:'Plán rozvoje',items:['Fáze 1: MVP','Fáze 2: Mobilní aplikace','Fáze 3: Modul prodejce','Fáze 4: Gamifikace','Fáze 5: AI ocenění','Fáze 6: Rozšíření']},{icon:'🎯',title:'Cílová skupina',items:['6–16M aktivních sběratelů Panini v Evropě','MS/ME: nárůsty 5–10x','Děti, mladiství, dospělí','Příležitostní i kompletisté','Kluby, školy, spolky']},{icon:'🔑',title:'USP',items:['Inteligentní párování','Plná ochrana před podvody','1 000+ nálepek na album','Vícejazyčný (15 jazyků)','Žádní anonymní uživatelé','Designová kvalita']}]},
    cta:{line1:'TVOJE ALBUM.',line2:'NA TEBE ČEKÁ.',sub:'Zaregistruj se zdarma. Začni hned.',btn:'🚀 Začni zdarma nyní',fine:'Žádné předplatné. Žádná karta. Zdarma navždy.'},
    footer:{copy:'© 2026 StickerSwap · GDPR · Hamburg',impressum:'Právní informace',privacy:'Ochrana soukromí',terms:'Podmínky'},
  },

  /* ── MAGYAR ── */
  hu: {
    nav:{ login:'Bejelentkezés', start:'Ingyenes kezdés' },
    hero:{ eyebrow:'🏆 Panini gyűjtőknek — 2026-os VB', line1:'CSERÉLJ.', line2:'GYŰJTS.\nNYERJ.', sub:'Az első Panini csereplatform ellenőrzött felhasználókkal, csalásvédelemmel és albumonként több mint 1.000 matricával.', cta:'Ingyenes regisztráció', demo:'Demo megtekintése →' },
    stats:{ users:'Aktív gyűjtők', swaps:'Sikeres cserék', satisfaction:'Elégedettség', albums:'Aktív albumok' },
    features:{ title:'Miért a StickerSwap?', sub:'Mert a Facebook-csoportok 2006-osak.',
      items:[{icon:'🔐',title:'100% Ellenőrzött felhasználók',desc:'Nincs névtelen profil. Minden felhasználó e-mailben ellenőrzött.'},{icon:'🎯',title:'Intelligens párosítás',desc:'Algoritmunk automatikusan megtalálja a cserefelhasználókat.'},{icon:'📱',title:'Szkennelés az alkalmazással',desc:'Szkenneld a matricákat kamerával vagy add meg a számot. Az album automatikusan frissül.'},{icon:'🌍',title:'Többnyelvű',desc:'Német, angol, francia, spanyol és még 11 nyelv.'},{icon:'🛡️',title:'Csalásvédelem',desc:'Értékelési rendszer, zárolások, anonimizált címek.'},{icon:'⚡',title:'Élő piactér',desc:'Valós idejű ajánlatok — szűrj régió és értékelés alapján.'}] },
    trust:{ title:'A biztonság az első', sub:'Aktívan védjük közösségünket a csalásoktól.',
      items:[{icon:'🔒',title:'Cím anonimizálás',desc:'A valódi címek rejtve maradnak a kölcsönös megerősítésig.'},{icon:'⭐',title:'Hírnév rendszer',desc:'Minden csere pontot ér. A rossz értékelések azonnal hatnak.'},{icon:'🚨',title:'Bejelentési rendszer',desc:'Jelents csalást — 24 órán belül kivizsgálunk.'},{icon:'📦',title:'Nyomkövető kód (Pro)',desc:'Prémium felhasználók kötelezővé tehetik a nyomkövetést.'},{icon:'🤝',title:'Kölcsönös megerősítés',desc:'A csere csak akkor fejeződik be, ha mindkét fél megerősítette.'},{icon:'🏷️',title:'Ellenőrzött profiljelvény',desc:'Előnyben részesítsd az ellenőrzött felhasználókat.'}] },
    pricing:{ title:'Csomagok és Árak', sub:'A gyűjtés ingyenes — a többért méltányosan fizetsz.', popular:'NÉPSZERŰ',
      plans:[
        {name:'Ingyenes',price:'0€',per:'/ hó',desc:'Alkalmi gyűjtőknek.',features:['1 aktív album','10 csere / hó','Alapvető párosítás','Nyilvános profil'],disabled:['Prioritásos párosítás','Okos csomagok'],cta:'Ingyenes kezdés'},
        {name:'Pro',price:'2,99€',per:'/ hó',desc:'Komoly gyűjtőknek.',features:['Korlátlan albumok','Korlátlan cserék','Prioritásos párosítás','Okos csomagok (5, 10)','Kötelező nyomkövetés','Reklámok nélkül'],disabled:[],cta:'Pro kipróbálása',featured:true},
        {name:'Kereskedő',price:'9,99€',per:'/ hó',desc:'Duplikátokat vásárló vagy eladó üzleteknek.',features:['Eladási funkció','Üzlet oldal','CSV tömeges import','Elemzések és jelentés','Ellenőrzött kereskedő jelvény','5% jutalék eladásonként'],disabled:[],cta:'Kereskedőként kezdés'},
      ],
      revenue:{title:'Bevételi modellek',items:[{icon:'💳',title:'Előfizetések',desc:'Ingyenes → Pro → Kereskedő.'},{icon:'🏪',title:'5% piaci díj',desc:'Minden matrica eladásnál 5%-ot veszünk.'},{icon:'🎯',title:'Panini partnerség',desc:'Affiliate linkek hivatalos csomagokhoz.'},{icon:'📊',title:'Közösségi adatok (anon)',desc:'Hiányzó matricák adatainak licencelése.'}]},
    },
    concept:{title:'Koncepció & Technológia',sub:'Mi áll mögötte — és hova tart.',cards:[{icon:'🏗️',title:'Tech stack',items:['React / CRA frontend (Vercel)','Supabase backend','Stripe fizetésekhez','Brevo e-mailekhez','i18next 15 nyelvhez','Claude API','Cloudinary']},{icon:'📅',title:'Ütemterv',items:['1. fázis: MVP','2. fázis: Mobilalkalmazás','3. fázis: Kereskedői modul','4. fázis: Gamifikáció','5. fázis: AI értékelés','6. fázis: Kiterjesztés']},{icon:'🎯',title:'Célcsoport',items:['6–16M aktív Panini gyűjtő Európában','VB/EB: 5–10x növekedési csúcsok','Gyerekek, fiatalok, felnőttek','Alkalmi és teljesítésre törekvő gyűjtők','Klubok, iskolák, egyesületek']},{icon:'🔑',title:'USP',items:['Intelligens párosítás','Teljes csalásvédelem','1.000+ matrica albumonként','Többnyelvű (15 nyelv)','Nincs névtelen felhasználó','Tech startup app minőség']}]},
    cta:{line1:'AZ ALBUMOD.',line2:'VÁR RÁD.',sub:'Regisztrálj ingyen. Kezdj el azonnal.',btn:'🚀 Kezdj most ingyen',fine:'Nincs előfizetés. Nincs kártya. Örökre ingyenes.'},
    footer:{copy:'© 2026 StickerSwap · GDPR-kompatibilis · Hamburg',impressum:'Impresszum',privacy:'Adatvédelem',terms:'Feltételek'},
  },

  /* ── TÜRKÇE ── */
  tr: {
    nav:{ login:'Giriş yap', start:'Ücretsiz başla' },
    hero:{ eyebrow:'🏆 2026 Dünya Kupası Panini koleksiyoncuları için', line1:'TAKAS ET.', line2:'TOPLA.\nKAZAN.', sub:'Doğrulanmış kullanıcı sistemi, dolandırıcılık koruması ve albüm başına 1.000\'den fazla çıkartma ile ilk Panini takas borsası.', cta:'Ücretsiz kayıt ol', demo:'Demo izle →' },
    stats:{ users:'Aktif koleksiyoncular', swaps:'Başarılı takaslar', satisfaction:'Memnuniyet', albums:'Aktif albümler' },
    features:{ title:'Neden StickerSwap?', sub:'Çünkü Facebook grupları 2006\'dan kalma.',
      items:[{icon:'🔐',title:'%100 Doğrulanmış kullanıcılar',desc:'Anonim profil yok. Her kullanıcı e-posta ile doğrulanır.'},{icon:'🎯',title:'Akıllı eşleştirme',desc:'Algoritmamız ihtiyacın olanları otomatik bulur.'},{icon:'📱',title:'Uygulama ile tarama',desc:'Kamera ile tara veya numara gir. Albümün otomatik güncellenir.'},{icon:'🌍',title:'Çok dilli',desc:'Almanca, İngilizce, Fransızca, İspanyolca ve 11 dil daha.'},{icon:'🛡️',title:'Dolandırıcılık koruması',desc:'Puanlama sistemi, takas blokları, anonimleştirilmiş adresler.'},{icon:'⚡',title:'Canlı pazar',desc:'Gerçek zamanlı teklifler — bölge, kargo ve değerlendirmeye göre filtrele.'}] },
    trust:{ title:'Güvenlik önce gelir', sub:'Topluluğumuzu dolandırıcılığa karşı aktif olarak koruyoruz.',
      items:[{icon:'🔒',title:'Adres anonimleştirme',desc:'Gerçek adresler karşılıklı onaya kadar gizli kalır.'},{icon:'⭐',title:'İtibar sistemi',desc:'Her takas puan kazandırır. Kötü puanlar görünürlüğü etkiler.'},{icon:'🚨',title:'Şikayet sistemi',desc:'Dolandırıcılığı bildir — 24 saatte araştırırız.'},{icon:'📦',title:'Takip kodu (Pro)',desc:'Premium kullanıcılar takip kodu zorunlu tutabilir.'},{icon:'🤝',title:'Karşılıklı onay',desc:'Takas ancak her iki taraf teslim aldığını onayladığında tamamlanır.'},{icon:'🏷️',title:'Doğrulanmış profil rozeti',desc:'Doğrulanmış kullanıcılarla takas yapmayı tercih et.'}] },
    pricing:{ title:'Planlar ve Fiyatlar', sub:'Toplamak ücretsiz — daha fazlası için adil öde.', popular:'POPÜLER',
      plans:[
        {name:'Ücretsiz',price:'€0',per:'/ ay',desc:'Ara sıra koleksiyon yapanlar için.',features:['1 aktif albüm','10 takas / ay','Temel eşleştirme','Herkese açık profil'],disabled:['Öncelikli eşleştirme','Akıllı paketler'],cta:'Ücretsiz başla'},
        {name:'Pro',price:'€2,99',per:'/ ay',desc:'Gerçek koleksiyoncular için.',features:['Sınırsız albüm','Sınırsız takas','Öncelikli eşleştirme','Akıllı paketler (5, 10)','Takip kodu zorunluluğu','Reklamsız deneyim'],disabled:[],cta:'Pro\'yu dene',featured:true},
        {name:'Satıcı',price:'€9,99',per:'/ ay',desc:'Çift çıkartma alan veya satan mağazalar için.',features:['Satış işlevi (sabit fiyat)','Profilli mağaza sayfası','Toplu CSV içe aktarma','Analitik ve rapor','Doğrulanmış satıcı rozeti','Satış başına %5 komisyon'],disabled:[],cta:'Satıcı olarak başla'},
      ],
      revenue:{title:'Gelir modelleri',items:[{icon:'💳',title:'Abonelikler',desc:'Ücretsiz → Pro → Satıcı.'},{icon:'🏪',title:'%5 pazar payı',desc:'Her çıkartma satışından %5 alırız.'},{icon:'🎯',title:'Panini ortaklığı',desc:'Resmi başlangıç paketlerine bağlı linkler.'},{icon:'📊',title:'Topluluk verileri (anonim)',desc:'Eksik çıkartma verilerini yayıncılara lisansla.'}]},
    },
    concept:{title:'Konsept & Teknoloji',sub:'Arkasında ne var — ve nereye gidiyor.',cards:[{icon:'🏗️',title:'Teknoloji yığını',items:['React / CRA frontend (Vercel)','Supabase backend','Stripe ödemeler için','Brevo e-postalar için','i18next 15 dil için','Claude API','Cloudinary']},{icon:'📅',title:'Yol haritası',items:['Aşama 1: MVP','Aşama 2: Mobil uygulama','Aşama 3: Satıcı modülü','Aşama 4: Oyunlaştırma','Aşama 5: AI değerleme','Aşama 6: Genişleme']},{icon:'🎯',title:'Hedef kitle',items:['Avrupa\'da 6–16M aktif Panini koleksiyoncusu','Dünya Kupası: 5–10x büyüme','Çocuklar, gençler, yetişkinler','Sıradan ve tamamlayıcı koleksiyoncular','Kulüpler, okullar, dernekler']},{icon:'🔑',title:'USP',items:['Manuel arama yerine akıllı eşleştirme','Tam dolandırıcılık koruması','Albüm başına 1.000+ çıkartma','15 dilden oluşan çok dilli yapı','Anonim kullanıcı yok','Teknoloji girişimi uygulama kalitesi']}]},
    cta:{line1:'ALBÜMÜN.',line2:'SENİ BEKLİYOR.',sub:'Ücretsiz kayıt ol. Hemen başla.',btn:'🚀 Şimdi ücretsiz başla',fine:'Abonelik yok. Kart yok. Sonsuza kadar ücretsiz.'},
    footer:{copy:'© 2026 StickerSwap · GDPR uyumlu · Hamburg',impressum:'Künye',privacy:'Gizlilik',terms:'Koşullar'},
  },

  /* ── РУССКИЙ ── */
  ru: {
    nav:{ login:'Войти', start:'Начать бесплатно' },
    hero:{ eyebrow:'🏆 Для коллекционеров Panini ЧМ 2026', line1:'ОБМЕНИВАЙ.', line2:'СОБИРАЙ.\nПОБЕЖДАЙ.', sub:'Первая биржа обменов Panini с верифицированными пользователями, защитой от мошенников и более 1000 наклеек на альбом.', cta:'Зарегистрироваться бесплатно', demo:'Смотреть демо →' },
    stats:{ users:'Активных коллекционеров', swaps:'Успешных обменов', satisfaction:'Удовлетворённость', albums:'Активных альбомов' },
    features:{ title:'Почему StickerSwap?', sub:'Потому что группы в Facebook — это 2006 год.',
      items:[{icon:'🔐',title:'100% Верифицированные пользователи',desc:'Никаких анонимных профилей. Каждый пользователь проверен по email.'},{icon:'🎯',title:'Умный подбор партнёров',desc:'Наш алгоритм автоматически находит партнёров с нужными наклейками.'},{icon:'📱',title:'Сканирование через приложение',desc:'Сканируй наклейки камерой или вводи номер. Альбом обновляется автоматически.'},{icon:'🌍',title:'Многоязычный',desc:'Немецкий, английский, французский, испанский и ещё 11 языков.'},{icon:'🛡️',title:'Защита от мошенников',desc:'Система рейтингов, блокировки обменов, анонимные адреса.'},{icon:'⚡',title:'Живой маркетплейс',desc:'Предложения в реальном времени — фильтр по региону и рейтингу.'}] },
    trust:{ title:'Безопасность прежде всего', sub:'Мы активно защищаем нашу Community от мошенников.',
      items:[{icon:'🔒',title:'Анонимизация адреса',desc:'Реальные адреса скрыты до взаимного подтверждения.'},{icon:'⭐',title:'Система репутации',desc:'Каждый обмен приносит очки. Плохие оценки сразу влияют на видимость.'},{icon:'🚨',title:'Система жалоб',desc:'Пожалуйся на мошенника — рассмотрим в течение 24ч.'},{icon:'📦',title:'Код отслеживания (Pro)',desc:'Премиум-пользователи могут требовать отслеживание посылки.'},{icon:'🤝',title:'Взаимное подтверждение',desc:'Обмен завершён только когда обе стороны подтвердили получение.'},{icon:'🏷️',title:'Значок верифицированного профиля',desc:'Предпочитай обмены с верифицированными пользователями.'}] },
    pricing:{ title:'Планы и Цены', sub:'Собирать бесплатно — за большее платишь справедливо.', popular:'ПОПУЛЯРНО',
      plans:[
        {name:'Бесплатный',price:'€0',per:'/ мес',desc:'Для случайных коллекционеров.',features:['1 активный альбом','10 обменов / месяц','Базовый подбор','Публичный профиль'],disabled:['Приоритет подбора','Умные пакеты'],cta:'Начать бесплатно'},
        {name:'Pro',price:'€2,99',per:'/ мес',desc:'Для серьёзных коллекционеров.',features:['Неограниченные альбомы','Неограниченные обмены','Приоритет подбора','Умные пакеты (5, 10)','Обязательный код отслеживания','Без рекламы'],disabled:[],cta:'Попробовать Pro',featured:true},
        {name:'Продавец',price:'€9,99',per:'/ мес',desc:'Для магазинов, покупающих или продающих дубликаты.',features:['Функция продажи','Страница магазина','Импорт CSV','Аналитика и отчёт','Значок проверенного продавца','5% комиссия за продажу'],disabled:[],cta:'Начать как продавец'},
      ],
      revenue:{title:'Модели дохода',items:[{icon:'💳',title:'Подписки',desc:'Бесплатный → Pro → Продавец.'},{icon:'🏪',title:'Комиссия 5%',desc:'С каждой продажи наклеек берём 5%.'},{icon:'🎯',title:'Партнёрство Panini',desc:'Партнёрские ссылки на официальные пакеты.'},{icon:'📊',title:'Данные сообщества (анон)',desc:'Лицензирование данных о недостающих наклейках.'}]},
    },
    concept:{title:'Концепция & Технологии',sub:'Что стоит за этим — и куда движется.',cards:[{icon:'🏗️',title:'Технологии',items:['Frontend React / CRA (Vercel)','Backend Supabase','Stripe для платежей','Brevo для email','i18next для 15 языков','Claude API','Cloudinary']},{icon:'📅',title:'Дорожная карта',items:['Фаза 1: MVP','Фаза 2: Мобильное приложение','Фаза 3: Модуль продавца','Фаза 4: Геймификация','Фаза 5: ИИ-оценка','Фаза 6: Расширение']},{icon:'🎯',title:'Целевая аудитория',items:['6–16M активных коллекционеров Panini в Европе','ЧМ/ЧЕ: рост x5–10','Дети, подростки, взрослые','Случайные и hardcore-коллекционеры','Клубы, школы, ассоциации']},{icon:'🔑',title:'УТП',items:['Умный подбор вместо ручного поиска','Полная защита от мошенников','1000+ наклеек на альбом','Многоязычный (15 языков)','Нет анонимных пользователей','Дизайн уровня tech-стартапа']}]},
    cta:{line1:'ТВОЙ АЛЬБОМ.',line2:'ЖДЁТ ТЕБЯ.',sub:'Регистрация бесплатно. Начни сразу.',btn:'🚀 Начать бесплатно',fine:'Без подписки. Без карты. Бесплатно навсегда.'},
    footer:{copy:'© 2026 StickerSwap · GDPR · Гамбург',impressum:'Реквизиты',privacy:'Конфиденциальность',terms:'Условия'},
  },

  /* ── УКРАЇНСЬКА ── */
  uk: {
    nav:{ login:'Увійти', start:'Почати безкоштовно' },
    hero:{ eyebrow:'🏆 Для колекціонерів Panini ЧС 2026', line1:'ОБМІНЮЙ.', line2:'ЗБИРАЙ.\nВИГРАВАЙ.', sub:'Перша біржа обмінів Panini з верифікованими користувачами, захистом від шахраїв та понад 1000 наклейок на альбом.', cta:'Зареєструватись безкоштовно', demo:'Дивитись демо →' },
    stats:{ users:'Активних колекціонерів', swaps:'Успішних обмінів', satisfaction:'Задоволеність', albums:'Активних альбомів' },
    features:{ title:'Чому StickerSwap?', sub:'Тому що групи у Facebook — це 2006 рік.',
      items:[{icon:'🔐',title:'100% Верифіковані користувачі',desc:'Ніяких анонімних профілів. Кожен користувач перевіряється email.'},{icon:'🎯',title:'Розумний підбір',desc:'Наш алгоритм автоматично знаходить партнерів з потрібними наклейками.'},{icon:'📱',title:'Сканування через додаток',desc:'Скануй наклейки камерою або введи номер. Альбом оновлюється автоматично.'},{icon:'🌍',title:'Багатомовний',desc:'Німецька, англійська, французька, іспанська та ще 11 мов.'},{icon:'🛡️',title:'Захист від шахраїв',desc:'Рейтингова система, блокування обмінів, анонімні адреси.'},{icon:'⚡',title:'Живий маркетплейс',desc:'Пропозиції в реальному часі — фільтруй за регіоном та рейтингом.'}] },
    trust:{ title:'Безпека перш за все', sub:'Ми активно захищаємо нашу спільноту від шахраїв.',
      items:[{icon:'🔒',title:'Анонімізація адреси',desc:'Справжні адреси приховані до взаємного підтвердження.'},{icon:'⭐',title:'Система репутації',desc:'Кожен обмін дає очки. Погані оцінки одразу впливають на видимість.'},{icon:'🚨',title:'Система скарг',desc:'Поскаржся на шахрая — розглянемо протягом 24 годин.'},{icon:'📦',title:'Код відстеження (Pro)',desc:'Преміум-користувачі можуть вимагати відстеження посилки.'},{icon:'🤝',title:'Взаємне підтвердження',desc:'Обмін завершено лише коли обидві сторони підтвердили отримання.'},{icon:'🏷️',title:'Значок верифікованого профілю',desc:'Надавай перевагу обмінам з верифікованими користувачами.'}] },
    pricing:{ title:'Плани та Ціни', sub:'Збирати безкоштовно — за більше платиш чесно.', popular:'ПОПУЛЯРНО',
      plans:[
        {name:'Безкоштовний',price:'€0',per:'/ міс',desc:'Для випадкових колекціонерів.',features:['1 активний альбом','10 обмінів / місяць','Базовий підбір','Публічний профіль'],disabled:['Пріоритет підбору','Розумні пакети'],cta:'Почати безкоштовно'},
        {name:'Pro',price:'€2,99',per:'/ міс',desc:'Для серйозних колекціонерів.',features:['Необмежені альбоми','Необмежені обміни','Пріоритет підбору','Розумні пакети (5, 10)','Обов\'язковий код відстеження','Без реклами'],disabled:[],cta:'Спробувати Pro',featured:true},
        {name:'Продавець',price:'€9,99',per:'/ міс',desc:'Для магазинів, що купують або продають дублікати.',features:['Функція продажу','Сторінка магазину','Імпорт CSV','Аналітика та звіт','Значок перевіреного продавця','5% комісія за продаж'],disabled:[],cta:'Почати як продавець'},
      ],
      revenue:{title:'Моделі доходу',items:[{icon:'💳',title:'Підписки',desc:'Безкоштовний → Pro → Продавець.'},{icon:'🏪',title:'Комісія 5%',desc:'З кожного продажу наклейок беремо 5%.'},{icon:'🎯',title:'Партнерство Panini',desc:'Партнерські посилання на офіційні пакети.'},{icon:'📊',title:'Дані спільноти (анон)',desc:'Ліцензування даних про відсутні наклейки.'}]},
    },
    concept:{title:'Концепція & Технології',sub:'Що стоїть за цим — і куди рухається.',cards:[{icon:'🏗️',title:'Технології',items:['Frontend React / CRA (Vercel)','Backend Supabase','Stripe для платежів','Brevo для email','i18next для 15 мов','Claude API','Cloudinary']},{icon:'📅',title:'Дорожня карта',items:['Фаза 1: MVP','Фаза 2: Мобільний додаток','Фаза 3: Модуль продавця','Фаза 4: Гейміфікація','Фаза 5: ІІ-оцінка','Фаза 6: Розширення']},{icon:'🎯',title:'Цільова аудиторія',items:['6–16M активних колекціонерів Panini в Європі','ЧС/ЧЄ: зростання x5–10','Діти, підлітки, дорослі','Випадкові та hardcore-колекціонери','Клуби, школи, асоціації']},{icon:'🔑',title:'УТП',items:['Розумний підбір замість ручного пошуку','Повний захист від шахраїв','1000+ наклейок на альбом','Багатомовний (15 мов)','Нема анонімних користувачів','Дизайн рівня tech-стартапу']}]},
    cta:{line1:'ТВІЙ АЛЬБОМ.',line2:'ЧЕКАЄ НА ТЕБЕ.',sub:'Реєстрація безкоштовно. Починай одразу.',btn:'🚀 Почати безкоштовно',fine:'Без підписки. Без картки. Безкоштовно назавжди.'},
    footer:{copy:'© 2026 StickerSwap · GDPR · Гамбург',impressum:'Реквізити',privacy:'Конфіденційність',terms:'Умови'},
  },

  /* ── HRVATSKI ── */
  hr: {
    nav:{ login:'Prijava', start:'Počni besplatno' },
    hero:{ eyebrow:'🏆 Za Panini kolekcionare SP 2026', line1:'ZAMIJENI.', line2:'SKUPLJAJ.\nPOBIJEDI.', sub:'Prva mjenjačnica Panini naljepnica s verificiranim korisnicima, zaštitom od prijevare i više od 1.000 naljepnica po albumu.', cta:'Registriraj se besplatno', demo:'Pogledaj demo →' },
    stats:{ users:'Aktivnih kolekcionara', swaps:'Uspješnih zamjena', satisfaction:'Zadovoljstvo', albums:'Aktivnih albuma' },
    features:{ title:'Zašto StickerSwap?', sub:'Jer su Facebook grupe ostale u 2006.',
      items:[{icon:'🔐',title:'100% Verificirani korisnici',desc:'Nema anonimnih profila. Svaki korisnik verificiran je emailom.'},{icon:'🎯',title:'Pametno uparivanje',desc:'Naš algoritam automatski pronalazi partnere s naljepnicama koje trebaš.'},{icon:'📱',title:'Skeniranje putem aplikacije',desc:'Skeniraj naljepnice kamerom ili upiši broj. Album se automatski ažurira.'},{icon:'🌍',title:'Višejezičan',desc:'Njemački, engleski, francuski, španjolski i još 11 jezika.'},{icon:'🛡️',title:'Zaštita od prijevare',desc:'Sustav ocjenjivanja, blokade zamjena, anonimne adrese.'},{icon:'⚡',title:'Živo tržište',desc:'Ponude zamjena u realnom vremenu — filtriraj po regiji i ocjeni.'}] },
    trust:{ title:'Sigurnost na prvom mjestu', sub:'Aktivno štitimo našu zajednicu od prijevara.',
      items:[{icon:'🔒',title:'Anonimizacija adrese',desc:'Prave adrese ostaju skrivene do uzajamne potvrde.'},{icon:'⭐',title:'Sustav reputacije',desc:'Svaka zamjena donosi bodove. Loše ocjene odmah utječu na vidljivost.'},{icon:'🚨',title:'Sustav prijave',desc:'Prijavi prijevaru — istražujemo u 24h.'},{icon:'📦',title:'Kod za praćenje (Pro)',desc:'Premium korisnici mogu zahtijevati praćenje paketa.'},{icon:'🤝',title:'Uzajamna potvrda',desc:'Zamjena je dovršena tek kad obje strane potvrde primitak.'},{icon:'🏷️',title:'Verificirana oznaka profila',desc:'Preferiraj zamjene s verificiranim korisnicima.'}] },
    pricing:{ title:'Planovi i Cijene', sub:'Skupljanje je besplatno — za više plaćaš pošteno.', popular:'POPULARNO',
      plans:[
        {name:'Besplatno',price:'0€',per:'/ mj.',desc:'Za povremene kolekcionare.',features:['1 aktivan album','10 zamjena / mj.','Osnovno uparivanje','Javni profil'],disabled:['Prioritetno uparivanje','Pametni paketi'],cta:'Počni besplatno'},
        {name:'Pro',price:'2,99€',per:'/ mj.',desc:'Za ozbiljne kolekcionare.',features:['Neograničeni albumi','Neograničene zamjene','Prioritetno uparivanje','Pametni paketi (5, 10)','Obvezni kod praćenja','Bez oglasa'],disabled:[],cta:'Isprobaj Pro',featured:true},
        {name:'Prodavač',price:'9,99€',per:'/ mj.',desc:'Za trgovine koje kupuju ili prodaju duplikate.',features:['Funkcija prodaje','Stranica trgovine','Masovni uvoz CSV','Analitika i izvješće','Verificirana oznaka prodavača','5% provizija po prodaji'],disabled:[],cta:'Počni kao prodavač'},
      ],
      revenue:{title:'Modeli prihoda',items:[{icon:'💳',title:'Pretplate',desc:'Besplatno → Pro → Prodavač.'},{icon:'🏪',title:'Naknada 5%',desc:'Na svaku prodaju naljepnica uzimamo 5%.'},{icon:'🎯',title:'Panini partnerstvo',desc:'Affiliate linkovi na službene pakete.'},{icon:'📊',title:'Podaci zajednice (anon)',desc:'Licenciranje podataka o nedostajućim naljepnicama.'}]},
    },
    concept:{title:'Koncept & Tehnologija',sub:'Što stoji iza toga — i kamo ide.',cards:[{icon:'🏗️',title:'Tech stack',items:['Frontend React / CRA (Vercel)','Backend Supabase','Stripe za plaćanja','Brevo za emailove','i18next za 15 jezika','Claude API','Cloudinary']},{icon:'📅',title:'Plan razvoja',items:['Faza 1: MVP','Faza 2: Mobilna aplikacija','Faza 3: Modul prodavača','Faza 4: Gamifikacija','Faza 5: AI procjena','Faza 6: Proširenje']},{icon:'🎯',title:'Ciljana skupina',items:['6–16M aktivnih Panini kolekcionara u Europi','SP/EP: rasti 5–10x','Djeca, mladi, odrasli','Povremeni i hardcore kolekcionari','Klubovi, škole, udruge']},{icon:'🔑',title:'USP',items:['Pametno uparivanje umjesto ručne pretrage','Potpuna zaštita od prijevare','1.000+ naljepnica po albumu','Višejezičan (15 jezika)','Nema anonimnih korisnika','Dizajn kvalitete tech startupa']}]},
    cta:{line1:'TVOJ ALBUM.',line2:'ČEKA TE.',sub:'Registriraj se besplatno. Počni odmah.',btn:'🚀 Počni besplatno sada',fine:'Bez pretplate. Bez kartice. Besplatno zauvijek.'},
    footer:{copy:'© 2026 StickerSwap · GDPR · Hamburg',impressum:'Impressum',privacy:'Privatnost',terms:'Uvjeti'},
  },

};

export default landing;
