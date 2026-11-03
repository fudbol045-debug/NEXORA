import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types';

interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceHover: string;
  surfaceBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  primaryGlow: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
}

export const THEME_CONFIGS: Record<ThemeMode, { name: string; description: string; previewColor: string; tokens: ThemeTokens }> = {
  dark: {
    name: 'Dark',
    description: 'Qora va qorong‘i dizayn (Carbon & Obsidian)',
    previewColor: '#0b0f19',
    tokens: {
      bg: 'bg-[#090d16]',
      surface: 'bg-[#111726]',
      surfaceHover: 'hover:bg-[#182035]',
      surfaceBorder: 'border-slate-800/80',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-500',
      primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      primaryHover: 'bg-indigo-500',
      primaryGlow: 'shadow-[0_0_20px_rgba(99,102,241,0.25)]',
      accent: 'text-indigo-400',
      badgeBg: 'bg-indigo-950/70 border border-indigo-700/50',
      badgeText: 'text-indigo-300',
    },
  },
  light: {
    name: 'Light',
    description: 'Oq va yorug‘ dizayn (Crisp Studio Clean)',
    previewColor: '#ffffff',
    tokens: {
      bg: 'bg-slate-50',
      surface: 'bg-white',
      surfaceHover: 'hover:bg-slate-100/80',
      surfaceBorder: 'border-slate-200',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textMuted: 'text-slate-400',
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      primaryHover: 'bg-blue-700',
      primaryGlow: 'shadow-[0_0_15px_rgba(37,99,235,0.2)]',
      accent: 'text-blue-600',
      badgeBg: 'bg-blue-50 border border-blue-200',
      badgeText: 'text-blue-700',
    },
  },
  ocean: {
    name: 'Ocean',
    description: 'Ko‘k va dengiz ranglari (Deep Maritime Cyan)',
    previewColor: '#07162c',
    tokens: {
      bg: 'bg-[#051324]',
      surface: 'bg-[#0a203c]',
      surfaceHover: 'hover:bg-[#0f2d54]',
      surfaceBorder: 'border-cyan-900/60',
      textPrimary: 'text-cyan-50',
      textSecondary: 'text-cyan-200',
      textMuted: 'text-cyan-600/70',
      primary: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold',
      primaryHover: 'bg-cyan-400',
      primaryGlow: 'shadow-[0_0_20px_rgba(6,182,212,0.35)]',
      accent: 'text-cyan-400',
      badgeBg: 'bg-cyan-950/80 border border-cyan-800',
      badgeText: 'text-cyan-300',
    },
  },
  warm: {
    name: 'Warm',
    description: 'Iliq va sokin ranglar (Terracotta & Amber Bronze)',
    previewColor: '#1c1511',
    tokens: {
      bg: 'bg-[#18110d]',
      surface: 'bg-[#241a14]',
      surfaceHover: 'hover:bg-[#32241c]',
      surfaceBorder: 'border-amber-950/70',
      textPrimary: 'text-amber-50',
      textSecondary: 'text-amber-200/90',
      textMuted: 'text-amber-700/80',
      primary: 'bg-amber-600 hover:bg-amber-500 text-white',
      primaryHover: 'bg-amber-500',
      primaryGlow: 'shadow-[0_0_20px_rgba(217,119,6,0.3)]',
      accent: 'text-amber-400',
      badgeBg: 'bg-amber-950/70 border border-amber-800/60',
      badgeText: 'text-amber-300',
    },
  },
  neon: {
    name: 'Neon',
    description: 'Futuristik va yorqin ranglar (Cyberpunk Violet & Fuchsia)',
    previewColor: '#070512',
    tokens: {
      bg: 'bg-[#080512]',
      surface: 'bg-[#110c24]',
      surfaceHover: 'hover:bg-[#1a1236]',
      surfaceBorder: 'border-purple-800/50',
      textPrimary: 'text-fuchsia-50',
      textSecondary: 'text-fuchsia-200',
      textMuted: 'text-purple-500/80',
      primary: 'bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-500 hover:to-pink-400 text-white font-semibold',
      primaryHover: 'bg-fuchsia-500',
      primaryGlow: 'shadow-[0_0_25px_rgba(217,70,239,0.45)]',
      accent: 'text-fuchsia-400',
      badgeBg: 'bg-fuchsia-950/80 border border-fuchsia-700/60',
      badgeText: 'text-fuchsia-300',
    },
  },
  nature: {
    name: 'Nature',
    description: 'Yashil va tabiiy ranglar (Deep Forest Emerald & Bamboo)',
    previewColor: '#06170f',
    tokens: {
      bg: 'bg-[#05140d]',
      surface: 'bg-[#0a2217]',
      surfaceHover: 'hover:bg-[#0f2e20]',
      surfaceBorder: 'border-emerald-900/60',
      textPrimary: 'text-emerald-50',
      textSecondary: 'text-emerald-200',
      textMuted: 'text-emerald-600',
      primary: 'bg-emerald-600 hover:bg-emerald-500 text-white font-medium',
      primaryHover: 'bg-emerald-500',
      primaryGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      accent: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/80 border border-emerald-800/60',
      badgeText: 'text-emerald-300',
    },
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  tokens: ThemeTokens;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('nexora_theme') as ThemeMode;
    return saved && THEME_CONFIGS[saved] ? saved : 'dark';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('nexora_theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [theme]);

  const tokens = THEME_CONFIGS[theme].tokens;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, tokens }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
