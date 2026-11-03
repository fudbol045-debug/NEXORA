import React, { createContext, useContext, useEffect, useState } from 'react';
import { LanguageCode } from '../types';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'uz', name: 'Uzbek', nativeName: "O'zbekcha", flag: '🇺🇿', dir: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша', flag: '🇰🇿', dir: 'ltr' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬', dir: 'ltr' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr' },
];

export const TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  slogan: {
    uz: 'One World. One Platform. Infinite Possibilities.',
    en: 'One World. One Platform. Infinite Possibilities.',
    ru: 'Один мир. Одна платформа. Бесконечные возможности.',
    zh: '同一个世界。同一个平台。无限可能。',
    tr: 'Tek Dünya. Tek Platform. Sonsuz Olasılıklar.',
    kk: 'Бір әлем. Бір платформа. Шексіз мүмкіндіктер.',
    ky: 'Бир дүйнө. Бир платформа. Чексиз мүмкүнчүлүктөр.',
    tg: 'Як ҷаҳон. Як платформа. Имкониятҳои беохир.',
    ar: 'عالم واحد. منصة واحدة. إمكانيات لا حصر لها.',
    es: 'Un Mundo. Una Plataforma. Infinitas Posibilidades.',
    fr: 'Un Monde. Une Plateforme. Possibilités Infinies.',
    de: 'Eine Welt. Eine Plattform. Unendliche Möglichkeiten.',
    ja: '一つの世界。一つのプラットフォーム。無限の可能性。',
    ko: '하나의 세상. 하나의 플랫폼. 무한한 가능성.',
    hi: 'एक विश्व। एक मंच। अनंत संभावनाएं।',
    pt: 'Um Mundo. Uma Plataforma. Possibilidades Infinitas.',
  },
  // Modules
  core: {
    uz: 'NEXORA CORE',
    en: 'NEXORA CORE',
    ru: 'NEXORA CORE',
    zh: '核心中心 (CORE)',
    tr: 'NEXORA CORE',
    kk: 'NEXORA CORE',
    ky: 'NEXORA CORE',
    tg: 'NEXORA CORE',
    ar: 'مركز نكسورا',
    es: 'NEXORA CORE',
    fr: 'NEXORA CORE',
    de: 'NEXORA CORE',
    ja: 'NEXORA CORE',
    ko: 'NEXORA CORE',
    hi: 'नेक्सोरा कोर',
    pt: 'NEXORA CORE',
  },
  market: {
    uz: 'NEXORA MARKET',
    en: 'NEXORA MARKET',
    ru: 'NEXORA МАРКЕТ',
    zh: '商品市场 (MARKET)',
    tr: 'NEXORA MARKET',
    kk: 'NEXORA МАРКЕТ',
    ky: 'NEXORA МАРКЕТ',
    tg: 'NEXORA БОЗОР',
    ar: 'سوق نكسورا',
    es: 'NEXORA MARKET',
    fr: 'NEXORA MARCHÉ',
    de: 'NEXORA MARKT',
    ja: 'NEXORA マーケット',
    ko: 'NEXORA 마켓',
    hi: 'नेक्सोरा मार्केट',
    pt: 'NEXORA MERCADO',
  },
  services: {
    uz: 'NEXORA SERVICES',
    en: 'NEXORA SERVICES',
    ru: 'NEXORA УСЛУГИ',
    zh: '专业服务 (SERVICES)',
    tr: 'NEXORA HİZMETLER',
    kk: 'NEXORA ҚЫЗМЕТТЕР',
    ky: 'NEXORA КЫЗМАТТАР',
    tg: 'NEXORA ХИЗМАТҲО',
    ar: 'خدمات نكسورا',
    es: 'NEXORA SERVICIOS',
    fr: 'NEXORA SERVICES',
    de: 'NEXORA SERVICES',
    ja: 'NEXORA サービス',
    ko: 'NEXORA 서비스',
    hi: 'नेक्सोरा सेवाएं',
    pt: 'NEXORA SERVIÇOS',
  },
  cargo: {
    uz: 'NEXORA CARGO',
    en: 'NEXORA CARGO',
    ru: 'NEXORA КАРГО',
    zh: '物流货运 (CARGO)',
    tr: 'NEXORA KARGO',
    kk: 'NEXORA ЖҮК ТАСЫМАЛ',
    ky: 'NEXORA ЖҮК',
    tg: 'NEXORA БОР',
    ar: 'شحن نكسورا',
    es: 'NEXORA CARGO',
    fr: 'NEXORA FRET',
    de: 'NEXORA FRACHT',
    ja: 'NEXORA カーゴ',
    ko: 'NEXORA 카고',
    hi: 'नेक्सोरा कार्गो',
    pt: 'NEXORA CARGA',
  },
  connect: {
    uz: 'NEXORA CONNECT',
    en: 'NEXORA CONNECT',
    ru: 'NEXORA СВЯЗЬ',
    zh: '即时通讯 (CONNECT)',
    tr: 'NEXORA BAĞLANTI',
    kk: 'NEXORA БАЙЛАНЫС',
    ky: 'NEXORA БАЙЛАНЫШ',
    tg: 'NEXORA ПАЙВАСТ',
    ar: 'تواصل نكسورا',
    es: 'NEXORA CONNECT',
    fr: 'NEXORA CONNECT',
    de: 'NEXORA CONNECT',
    ja: 'NEXORA コネクト',
    ko: 'NEXORA 커넥트',
    hi: 'नेक्सोरा कनेक्ट',
    pt: 'NEXORA CONEXÃO',
  },
  community: {
    uz: 'NEXORA COMMUNITY',
    en: 'NEXORA COMMUNITY',
    ru: 'NEXORA СООБЩЕСТВО',
    zh: '社区生态 (COMMUNITY)',
    tr: 'NEXORA TOPLULUK',
    kk: 'NEXORA ҚОҒАМДАСТЫҚ',
    ky: 'NEXORA КООМДОШТУК',
    tg: 'NEXORA ҲАМҶАВОМОН',
    ar: 'مجتمع نكسورا',
    es: 'NEXORA COMUNIDAD',
    fr: 'NEXORA COMMUNAUTÉ',
    de: 'NEXORA GEMEINSCHAFT',
    ja: 'NEXORA コミュニティ',
    ko: 'NEXORA 커뮤니티',
    hi: 'नेक्सोरा समुदाय',
    pt: 'NEXORA COMUNIDADE',
  },
  search: {
    uz: 'NEXORA SEARCH',
    en: 'NEXORA SEARCH',
    ru: 'NEXORA ПОИСК',
    zh: '全域搜索 (SEARCH)',
    tr: 'NEXORA ARAMA',
    kk: 'NEXORA ІЗДЕУ',
    ky: 'NEXORA ИЗДӨӨ',
    tg: 'NEXORA ҶУСТУҶӮ',
    ar: 'بحث نكسورا',
    es: 'NEXORA BÚSQUEDA',
    fr: 'NEXORA RECHERCHE',
    de: 'NEXORA SUCHE',
    ja: 'NEXORA 検索',
    ko: 'NEXORA 검색',
    hi: 'नेक्सोरा खोज',
    pt: 'NEXORA BUSCA',
  },
  ai: {
    uz: 'NEXORA AI',
    en: 'NEXORA AI',
    ru: 'NEXORA ИИ',
    zh: '智脑助手 (AI)',
    tr: 'NEXORA YAPAY ZEKA',
    kk: 'NEXORA ЖИ',
    ky: 'NEXORA ЖИ',
    tg: 'NEXORA ҲО',
    ar: 'ذكاء نكسورا الاصطناعي',
    es: 'NEXORA IA',
    fr: 'NEXORA IA',
    de: 'NEXORA KI',
    ja: 'NEXORA AI',
    ko: 'NEXORA 인공지능',
    hi: 'नेक्सोरा एआई',
    pt: 'NEXORA IA',
  },
  orders: {
    uz: 'BUYURTMALAR',
    en: 'ORDERS',
    ru: 'ЗАКАЗЫ',
    zh: '订单管理',
    tr: 'SİPARİŞLER',
    kk: 'ТАПСЫРЫСТАР',
    ky: 'БУЙРУТМАЛАР',
    tg: 'САФОРИШҲО',
    ar: 'الطلبات',
    es: 'PEDIDOS',
    fr: 'COMMANDES',
    de: 'BESTELLUNGEN',
    ja: '注文一覧',
    ko: '주문 관리',
    hi: 'ऑर्डर',
    pt: 'PEDIDOS',
  },
  admin: {
    uz: 'BOSHQARUV',
    en: 'ADMIN',
    ru: 'УПРАВЛЕНИЕ',
    zh: '管理后台',
    tr: 'YÖNETİM',
    kk: 'ӘКІМШІЛІК',
    ky: 'БАШКАРУУ',
    tg: 'МУДИРИЯТ',
    ar: 'لوحة التحكم',
    es: 'ADMINISTRACIÓN',
    fr: 'ADMINISTRATION',
    de: 'VERWALTUNG',
    ja: '管理者パネル',
    ko: '관리자 센터',
    hi: 'प्रशासन',
    pt: 'ADMINISTRAÇÃO',
  },
  // Common UI actions
  searchPlaceholder: {
    uz: 'Odamlar, mahsulotlar, xizmatlar, yuk yo‘nalishlari va guruhlarni qidirish...',
    en: 'Search people, products, services, cargo routes, and groups...',
    ru: 'Поиск людей, товаров, услуг, грузовых маршрутов и сообществ...',
    zh: '搜索人员、商品、服务、物流航线与社区群组...',
    tr: 'Kişiler, ürünler, hizmetler, kargo rotaları ve grupları arayın...',
    kk: 'Адамдарды, тауарларды, қызметтерді, жүк бағыттарын іздеу...',
    ky: 'Адамдарды, товарларды, кызматтарды, жүк багыттарын издөө...',
    tg: 'Ҷустуҷӯи одамон, молҳо, хадамот, хатсайрҳои боркашонӣ...',
    ar: 'ابحث عن الأشخاص، المنتجات، الخدمات، خطوط الشحن، والمجموعات...',
    es: 'Buscar personas, productos, servicios, rutas de carga y grupos...',
    fr: 'Rechercher des personnes, produits, services, frets et groupes...',
    de: 'Suche nach Personen, Produkten, Dienstleistungen, Frachtrouten...',
    ja: 'ユーザー、商品、サービス、貨物ルート、グループを検索...',
    ko: '사용자, 상품, 서비스, 운송 경로, 그룹 검색...',
    hi: 'उपयोगकर्ता, उत्पाद, सेवाएं, कार्गो मार्ग खोजें...',
    pt: 'Pesquise pessoas, produtos, serviços, rotas de carga e grupos...',
  },
  postListing: {
    uz: "E'lon berish",
    en: 'Post Listing',
    ru: 'Подать объявление',
    zh: '发布信息',
    tr: 'İlan Ver',
    kk: 'Хабарландыру беру',
    ky: 'Жарыя берүү',
    tg: 'Эълон гузоштан',
    ar: 'إضافة إعلان',
    es: 'Publicar anuncio',
    fr: 'Publier une annonce',
    de: 'Anzeige aufgeben',
    ja: '投稿を作成',
    ko: '새 등록하기',
    hi: 'लिस्टिंग जोड़ें',
    pt: 'Publicar anúncio',
  },
  localMarket: {
    uz: 'Mahalliy Savdo (Local)',
    en: 'Local Market',
    ru: 'Местный рынок (Local)',
    zh: '同城本地集市',
    tr: 'Yerel Pazar',
    kk: 'Жергілікті сауда',
    ky: 'Жергиликтүү соода',
    tg: 'Бозори маҳаллӣ',
    ar: 'السوق المحلي',
    es: 'Mercado Local',
    fr: 'Marché Local',
    de: 'Lokaler Markt',
    ja: '地域ローカル市場',
    ko: '로컬 마켓',
    hi: 'स्थानीय बाजार',
    pt: 'Mercado Local',
  },
  globalMarket: {
    uz: 'Xalqaro Savdo (Global)',
    en: 'Global Market',
    ru: 'Международный рынок (Global)',
    zh: '全球跨境贸易',
    tr: 'Küresel Pazar',
    kk: 'Халықаралық сауда',
    ky: 'Эл аралык соода',
    tg: 'Бозори байналмилалӣ',
    ar: 'السوق العالمي الدولي',
    es: 'Mercado Global',
    fr: 'Marché Mondial',
    de: 'Globaler Markt',
    ja: 'グローバル国際市場',
    ko: '글로벌 마켓',
    hi: 'वैश्विक बाजार',
    pt: 'Mercado Global',
  },
  nexoraIdBadge: {
    uz: 'NEXORA ID raqami',
    en: 'NEXORA ID Number',
    ru: 'Номер NEXORA ID',
    zh: '12位唯一身份编号',
    tr: 'NEXORA Kimlik No',
    kk: 'NEXORA ID нөмірі',
    ky: 'NEXORA ID номери',
    tg: 'Рақами NEXORA ID',
    ar: 'رقم نكسورا الموحد',
    es: 'Número NEXORA ID',
    fr: 'Numéro NEXORA ID',
    de: 'NEXORA ID-Nummer',
    ja: 'NEXORA ID番号',
    ko: 'NEXORA 고유 번호',
    hi: 'नेक्सोरा आईडी नंबर',
    pt: 'Número NEXORA ID',
  },
  mandatoryAddressNotice: {
    uz: 'Manzil ma’lumotlari majburiy va maxfiy saqlanadi.',
    en: 'Address details are mandatory and stored confidentially.',
    ru: 'Адресные данные обязательны и хранятся конфиденциально.',
    zh: '地址为强制必填项，平台严格加密保护。',
    tr: 'Adres bilgileri zorunludur ve gizli tutulur.',
    kk: 'Мекенжай деректері міндетті және құпия сақталады.',
    ky: 'Дарек маалыматтары милдеттүү жана купуя сакталат.',
    tg: 'Маълумоти суроға ҳатмӣ буда, махфӣ нигоҳ дошта мешавад.',
    ar: 'بيانات العنوان إلزامية ويتم تخزينها بسرية تامة.',
    es: 'Los datos de dirección son obligatorios y confidenciales.',
    fr: 'Les coordonnées de livraison sont obligatoires et confidentielles.',
    de: 'Adressangaben sind obligatorisch und streng vertraulich.',
    ja: '住所情報は必須であり、厳重に保護されます。',
    ko: '배송지 주소는 필수이며 안전하게 보관됩니다.',
    hi: 'पता अनिवार्य है और गोपनीय रखा जाता है।',
    pt: 'Os detalhes do endereço são obrigatórios e confidenciais.',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  currentLangInfo: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('nexora_lang') as LanguageCode;
    return saved && LANGUAGES.some((l) => l.code === saved) ? saved : 'uz';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('nexora_lang', lang);
  };

  const currentLangInfo = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = currentLangInfo.dir;
  }, [language, currentLangInfo]);

  const t = (key: string): string => {
    if (TRANSLATIONS[key] && TRANSLATIONS[key][language]) {
      return TRANSLATIONS[key][language];
    }
    return TRANSLATIONS[key]?.uz || TRANSLATIONS[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLangInfo }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
