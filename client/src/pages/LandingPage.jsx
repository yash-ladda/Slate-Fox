// change the dull background color, make it more attractive, also change the fonts use better fonts, make the page look like more beautiful

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   PALETTE
   #F8FBF5  bright cream  — light bg (updated)
   #EDF1D6  sage cream    — secondary bg
   #9DC08B  medium sage   — accents
   #609966  forest green  — primary
   #40513B  deep pine     — headings / dark bg
───────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:  #F8FBF5;
    --cream-soft: #EDF1D6;
    --sage:   #9DC08B;
    --forest: #609966;
    --pine:   #40513B;
    --pine-deep: #2c3828;
    --white:  #ffffff;
    --radius-sm: 12px;
    --radius-md: 20px;
    --radius-lg: 28px;
    --radius-xl: 36px;
    --shadow-sm: 0 2px 12px rgba(64,81,59,0.08);
    --shadow-md: 0 8px 32px rgba(64,81,59,0.13);
    --shadow-lg: 0 20px 60px rgba(64,81,59,0.18);
    --font-display: 'Cinzel', Georgia, serif;
    --font-body:    'Inter', system-ui, sans-serif;
    --transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font-body);
    background: linear-gradient(135deg, #F8FBF5 0%, #EDF1D6 45%, #E8F0E0 100%);
    color: var(--pine);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-14px) rotate(3deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -400% center; }
    100% { background-position:  400% center; }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes pulseDot {
    0%,100% { opacity:1; transform:scale(1); }
    50%     { opacity:0.5; transform:scale(0.8); }
  }

  .animate-fade-up { animation: fadeSlideUp 0.7s cubic-bezier(0.4,0,0.2,1) both; }
  .delay-1 { animation-delay: 0.12s; }
  .delay-2 { animation-delay: 0.26s; }
  .delay-3 { animation-delay: 0.42s; }
  .delay-4 { animation-delay: 0.58s; }

  /* ── NAVBAR ── */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 0 48px; height: 74px;
    display: flex; align-items: center; justify-content: space-between;
    transition: background 0.35s ease, box-shadow 0.35s ease;
  }
  .navbar.scrolled {
    background: rgba(44,56,40,0.97);
    backdrop-filter: blur(20px);
    box-shadow: 0 1px 0 rgba(157,192,139,0.12), 0 8px 40px rgba(44,56,40,0.4);
  }
  .navbar-logo {
    display: flex; align-items: center; gap: 12px;
    text-decoration: none; flex-shrink: 0;
  }
  .navbar-logo-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: rgba(157,192,139,0.15);
    border: 1px solid rgba(157,192,139,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; transition: var(--transition);
  }
  .navbar-logo:hover .navbar-logo-icon { transform: scale(1.05) rotate(-3deg); }
  .navbar-logo-text {
    font-family: var(--font-display);
    font-size: 22px; font-weight: 700;
    color: #EDF1D6; letter-spacing: -0.03em;
  }
  .navbar-logo-text .accent { color: var(--sage); }
  .nav-links { display: flex; align-items: center; gap: 4px; list-style: none; }
  .nav-links a {
    padding: 9px 18px; font-size: 14px; font-weight: 500;
    color: var(--sage); text-decoration: none; border-radius: 10px;
    position: relative; transition: var(--transition);
  }
  .nav-links a::after {
    content: ''; position: absolute;
    bottom: 5px; left: 50%; width: 0; height: 2px;
    background: var(--sage); border-radius: 9999px;
    transform: translateX(-50%); transition: width 0.25s ease;
  }
  .nav-links a:hover { color: #EDF1D6; }
  .nav-links a:hover::after { width: 50%; }
  .nav-actions { display: flex; align-items: center; gap: 10px; }
  .btn-ghost {
    padding: 9px 18px; font-family: var(--font-body);
    font-size: 14px; font-weight: 500;
    color: var(--sage); background: transparent; border: none;
    cursor: pointer; border-radius: 10px; transition: var(--transition);
  }
  .btn-ghost:hover { color: #EDF1D6; background: rgba(96,153,102,0.2); }
  .btn-primary-nav {
    padding: 11px 24px; font-family: var(--font-body);
    font-size: 14px; font-weight: 600;
    color: var(--pine); background: var(--sage);
    border: none; border-radius: 12px; cursor: pointer;
    transition: var(--transition); box-shadow: 0 4px 16px rgba(157,192,139,0.35);
  }
  .btn-primary-nav:hover {
    background: var(--cream-soft); transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(157,192,139,0.45);
  }
  .btn-primary-nav:active { transform: scale(0.97); }
  .hamburger {
    display: none; padding: 8px; background: transparent;
    border: none; cursor: pointer; color: var(--sage);
    border-radius: 8px; transition: background 0.2s;
  }
  .hamburger:hover { background: rgba(96,153,102,0.2); }
  .mobile-menu {
    position: fixed; top: 74px; left: 0; right: 0; z-index: 99;
    background: rgba(44,56,40,0.98); backdrop-filter: blur(20px);
    border-top: 1px solid rgba(96,153,102,0.2);
    padding: 12px 24px 24px;
  }
  .mobile-menu a {
    display: block; padding: 13px 16px;
    font-size: 14px; font-weight: 500; color: var(--sage);
    text-decoration: none; border-radius: 10px;
    transition: var(--transition); margin-bottom: 2px;
  }
  .mobile-menu a:hover { background: rgba(96,153,102,0.15); color: #EDF1D6; }

  /* ── HERO ── */
  .hero {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 120px 48px 96px;
    position: relative; overflow: hidden;
    background: linear-gradient(155deg, #1e2a1b 0%, #2c3828 35%, var(--pine) 70%, #253021 100%);
  }
  .hero-grain {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  .hero-glow-tl {
    position: absolute; width: 560px; height: 560px; border-radius: 50%;
    background: radial-gradient(circle, rgba(96,153,102,0.22) 0%, transparent 72%);
    top: -120px; left: -120px; pointer-events: none;
  }
  .hero-glow-br {
    position: absolute; width: 480px; height: 480px; border-radius: 50%;
    background: radial-gradient(circle, rgba(157,192,139,0.16) 0%, transparent 72%);
    bottom: -80px; right: -80px; pointer-events: none;
  }
  .hero-glow-bottom {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 80% 50% at 50% 110%, rgba(96,153,102,0.32) 0%, transparent 65%);
  }
  .hero-float {
    position: absolute; font-size: 34px;
    opacity: 0.15; user-select: none; pointer-events: none;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(96,153,102,0.18);
    border: 1px solid rgba(157,192,139,0.28);
    color: var(--sage); font-size: 11px; font-weight: 700;
    letter-spacing: 0.13em; text-transform: uppercase;
    padding: 9px 22px; border-radius: 9999px; margin-bottom: 40px;
  }
  .pulse-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--sage); animation: pulseDot 2s ease infinite;
  }
  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(2.8rem, 6.5vw, 5.2rem);
    font-weight: 700; line-height: 1.06;
    letter-spacing: -0.04em; margin-bottom: 28px;
    color: #EDF1D6;
  }
  .hero-title-shimmer {
    background: linear-gradient(90deg, var(--sage) 0%, #EDF1D6 30%, var(--sage) 55%, #EDF1D6 80%, var(--sage) 100%);
    background-size: 300% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; animation: shimmer 5s linear infinite;
  }
  .hero-sub {
    font-size: 17px; font-weight: 400; line-height: 1.8;
    color: rgba(157,192,139,0.78); max-width: 620px;
    margin: 0 auto 52px;
  }
  .hero-cta-row {
    display: flex; align-items: center; justify-content: center;
    gap: 16px; margin-bottom: 52px; flex-wrap: wrap;
  }
  .btn-hero-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 17px 38px; font-family: var(--font-body);
    font-size: 15px; font-weight: 600;
    color: var(--pine); background: var(--sage);
    border: none; border-radius: var(--radius-md); cursor: pointer;
    transition: var(--transition);
    box-shadow: 0 8px 32px rgba(157,192,139,0.3); white-space: nowrap;
    transform: translateY(0); /* base */
  }
  .btn-hero-primary:hover {
    background: var(--cream-soft); transform: translateY(-3px) scale(1.01);
    box-shadow: 0 18px 52px rgba(157,192,139,0.46);
  }
  .btn-hero-primary:active { transform: scale(0.97); }
  .btn-hero-outline {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 16px 38px; font-family: var(--font-body);
    font-size: 15px; font-weight: 600;
    color: #EDF1D6; background: transparent;
    border: 1.5px solid rgba(96,153,102,0.55);
    border-radius: var(--radius-md); cursor: pointer;
    transition: var(--transition); white-space: nowrap;
  }
  .btn-hero-outline:hover {
    background: rgba(96,153,102,0.18);
    border-color: rgba(157,192,139,0.7); transform: translateY(-2px);
  }
  .btn-hero-outline:active { transform: scale(0.97); }
  .hero-trust {
    display: flex; align-items: center; justify-content: center;
    gap: 36px; flex-wrap: wrap;
  }
  .hero-trust-item {
    font-size: 13px; font-weight: 500;
    color: rgba(157,192,139,0.6);
  }
  .scroll-indicator {
    position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px; opacity: 0.3;
  }
  .scroll-indicator span {
    font-size: 10px; font-weight: 700; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--sage);
  }
  .scroll-line { width: 1px; height: 32px; background: linear-gradient(to bottom, var(--sage), transparent); }

  /* ── MARQUEE ── */
  .marquee-strip {
    background: var(--forest);
    border-top: 1px solid rgba(157,192,139,0.18);
    border-bottom: 1px solid rgba(157,192,139,0.18);
    padding: 15px 0; overflow: hidden;
  }
  .marquee-track {
    display: flex; width: max-content;
    animation: marquee 32s linear infinite;
  }
  .marquee-track:hover { animation-play-state: paused; }
  .marquee-item {
    font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(237,241,214,0.8);
    white-space: nowrap; padding: 0 30px;
  }

  /* ── SECTIONS ── */
  .section-cream {
    background: transparent;
    padding: 100px 48px;
  }
  .section-dark {
    background: linear-gradient(155deg, #1e2a1b 0%, var(--pine) 100%);
    padding: 100px 48px; position: relative; overflow: hidden;
  }
  .section-dark::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  }
  .section-inner { max-width: 1160px; margin: 0 auto; }
  .section-inner-narrow { max-width: 760px; margin: 0 auto; }
  .section-head { text-align: center; max-width: 640px; margin: 0 auto 72px; }
  .chip {
    display: inline-block; font-size: 11px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    padding: 7px 18px; border-radius: 9999px; margin-bottom: 20px;
  }
  .chip-green  { color: var(--forest); background: rgba(96,153,102,0.1); }
  .chip-sage   { color: var(--sage);   background: rgba(157,192,139,0.14); }
  .chip-muted  { color: rgba(237,241,214,0.55); background: rgba(237,241,214,0.08); }

  .section-h2 {
    font-family: var(--font-display);
    font-size: clamp(1.9rem, 3.8vw, 3rem);
    font-weight: 700; line-height: 1.1;
    letter-spacing: -0.03em; margin-bottom: 16px;
  }
  .section-h2-dark  { color: var(--pine); }
  .section-h2-light { color: #EDF1D6; }
  .section-p-dark   { font-size: 15.5px; line-height: 1.8; color: var(--forest); }
  .section-p-muted  { font-size: 15.5px; line-height: 1.8; color: rgba(157,192,139,0.65); }

  /* ── STATS ── */
  .stats-grid {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 20px;
  }
  .stat-card {
    background: var(--white); border: 1px solid rgba(157,192,139,0.22);
    border-radius: var(--radius-lg); padding: 40px 28px;
    text-align: center; box-shadow: var(--shadow-sm);
    transition: var(--transition); position: relative; overflow: hidden;
    transform: translateY(0) scale(1);
  }
  .stat-card::after {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--forest), var(--sage));
    transform: scaleX(0); transition: transform 0.35s ease; transform-origin: left;
  }
  .stat-card:hover {
    transform: translateY(-6px) scale(1.01); box-shadow: var(--shadow-md);
  }
  .stat-card:hover::after { transform: scaleX(1); }
  .stat-icon { font-size: 28px; margin-bottom: 16px; display: block; }
  .stat-val {
    font-family: var(--font-display); font-size: 2.4rem;
    font-weight: 700; color: var(--pine); line-height: 1; margin-bottom: 10px;
  }
  .stat-label { font-size: 13px; font-weight: 500; color: var(--forest); }

  /* ── FEATURES ── */
  .features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  .feature-card {
    background: var(--white); border: 1px solid rgba(157,192,139,0.22);
    border-radius: var(--radius-xl); padding: 44px 38px;
    box-shadow: var(--shadow-sm); transition: var(--transition);
    position: relative; overflow: hidden; cursor: default;
    transform: translateY(0) scale(1);
  }
  .feature-card::after {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, var(--forest), var(--sage));
    border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    transform: scaleX(0); transition: transform 0.38s ease; transform-origin: left;
  }
  .feature-card:hover { transform: translateY(-9px) scale(1.01); box-shadow: var(--shadow-lg); }
  .feature-card:hover::after { transform: scaleX(1); }
  .feature-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
  .feature-chip {
    display: inline-block; font-size: 10px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--forest); background: rgba(96,153,102,0.1);
    padding: 5px 13px; border-radius: 9999px;
  }
  .feature-icon-box {
    width: 54px; height: 54px; border-radius: 16px;
    background: linear-gradient(135deg, var(--cream-soft), rgba(157,192,139,0.18));
    border: 1px solid rgba(157,192,139,0.28);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; transition: transform 0.3s ease;
  }
  .feature-card:hover .feature-icon-box { transform: scale(1.1) rotate(-4deg); }
  .feature-title {
    font-family: var(--font-display); font-size: 1.2rem;
    font-weight: 700; color: var(--pine); margin-bottom: 14px; line-height: 1.3;
  }
  .feature-desc { font-size: 14.5px; line-height: 1.8; color: var(--forest); }

  /* ── AUDIENCE ── */
  .audience-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .audience-card {
    border-radius: var(--radius-xl); padding: 56px 52px;
    display: flex; flex-direction: column;
    position: relative; overflow: hidden; transition: var(--transition);
    transform: translateY(0) scale(1);
  }
  .audience-card:hover { transform: translateY(-5px) scale(1.01); }
  .audience-card-cream {
    background: var(--cream-soft);
    border: 1px solid rgba(157,192,139,0.2); box-shadow: var(--shadow-md);
  }
  .audience-card-green {
    background: var(--forest);
    border: 1px solid rgba(157,192,139,0.18);
    box-shadow: 0 20px 60px rgba(44,56,40,0.4);
  }
  .audience-glow {
    position: absolute; width: 280px; height: 280px;
    border-radius: 50%; pointer-events: none;
  }
  .audience-top { display: flex; align-items: center; gap: 18px; margin-bottom: 44px; }
  .audience-emoji {
    width: 54px; height: 54px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center; font-size: 26px;
  }
  .audience-emoji-cream { background: rgba(96,153,102,0.12); border: 1px solid rgba(96,153,102,0.18); }
  .audience-emoji-green { background: rgba(44,56,40,0.28); border: 1px solid rgba(237,241,214,0.1); }
  .audience-overline {
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; display: block; margin-bottom: 5px;
  }
  .audience-overline-cream { color: var(--forest); }
  .audience-overline-green { color: rgba(237,241,214,0.5); }
  .audience-h3 {
    font-family: var(--font-display); font-size: 1.8rem;
    font-weight: 700; letter-spacing: -0.03em; line-height: 1.15;
  }
  .audience-h3-cream { color: var(--pine); }
  .audience-h3-green { color: #EDF1D6; }
  .audience-list { list-style: none; display: flex; flex-direction: column; gap: 26px; margin-bottom: 48px; flex: 1; }
  .audience-item { display: flex; align-items: flex-start; gap: 18px; }
  .audience-item-icon {
    width: 46px; height: 46px; border-radius: 13px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
  }
  .audience-item-icon-cream { background: rgba(96,153,102,0.1); border: 1px solid rgba(96,153,102,0.1); }
  .audience-item-icon-green { background: rgba(44,56,40,0.22); border: 1px solid rgba(237,241,214,0.07); }
  .audience-item-title { font-size: 14px; font-weight: 700; margin-bottom: 5px; }
  .audience-item-title-cream { color: var(--pine); }
  .audience-item-title-green { color: #EDF1D6; }
  .audience-item-desc { font-size: 13.5px; line-height: 1.7; }
  .audience-item-desc-cream { color: var(--forest); }
  .audience-item-desc-green { color: rgba(237,241,214,0.62); }
  .btn-audience-cream {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 16px 32px; font-family: var(--font-body);
    font-size: 14px; font-weight: 600;
    color: #EDF1D6; background: var(--forest);
    border: none; border-radius: var(--radius-md); cursor: pointer;
    transition: var(--transition); box-shadow: 0 6px 24px rgba(64,81,59,0.22);
  }
  .btn-audience-cream:hover { background: var(--pine); transform: translateY(-2px); }
  .btn-audience-cream:active { transform: scale(0.97); }
  .btn-audience-green {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 16px 32px; font-family: var(--font-body);
    font-size: 14px; font-weight: 600;
    color: var(--forest); background: #EDF1D6;
    border: none; border-radius: var(--radius-md); cursor: pointer;
    transition: var(--transition); box-shadow: 0 6px 24px rgba(44,56,40,0.3);
  }
  .btn-audience-green:hover { background: white; transform: translateY(-2px); }
  .btn-audience-green:active { transform: scale(0.97); }

  /* ── STEPS ── */
  .steps-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .step-card {
    background: var(--white); border: 1px solid rgba(157,192,139,0.22);
    border-radius: var(--radius-xl); padding: 44px 28px 40px;
    display: flex; flex-direction: column; align-items: center;
    text-align: center; box-shadow: var(--shadow-sm);
    transition: var(--transition);
    transform: translateY(0) scale(1);
  }
  .step-card:hover { transform: translateY(-9px) scale(1.01); box-shadow: var(--shadow-lg); }
  .step-icon-wrap { position: relative; margin-bottom: 32px; }
  .step-icon-bg {
    width: 76px; height: 76px; border-radius: 22px;
    background: linear-gradient(135deg, var(--forest), var(--pine));
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; box-shadow: 0 8px 28px rgba(64,81,59,0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .step-card:hover .step-icon-bg {
    transform: scale(1.1) rotate(4deg);
    box-shadow: 0 14px 40px rgba(64,81,59,0.42);
  }
  .step-num {
    position: absolute; top: -9px; right: -9px;
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--sage); color: var(--pine);
    font-size: 11px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(157,192,139,0.4);
  }
  .step-title {
    font-family: var(--font-display); font-size: 1.05rem;
    font-weight: 700; color: var(--pine); margin-bottom: 14px; line-height: 1.3;
  }
  .step-desc { font-size: 13.5px; line-height: 1.75; color: var(--forest); }

  /* ── TESTIMONIALS ── */
  .testimonials-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  .testimonial-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(157,192,139,0.18);
    border-radius: var(--radius-xl); padding: 44px 38px;
    display: flex; flex-direction: column; gap: 24px;
    transition: var(--transition); position: relative; overflow: hidden;
  }
  .testimonial-card::before {
    content: '"'; position: absolute; top: -8px; left: 24px;
    font-family: Georgia, serif; font-size: 110px; line-height: 1;
    color: var(--forest); opacity: 0.28;
  }
  .testimonial-card:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(157,192,139,0.32); transform: translateY(-7px);
    box-shadow: 0 24px 60px rgba(44,56,40,0.3);
  }
  .stars { display: flex; gap: 4px; }
  .star { color: var(--sage); font-size: 16px; }
  .testimonial-text {
    font-size: 14.5px; line-height: 1.82;
    color: rgba(237,241,214,0.78); font-style: italic;
    flex: 1; position: relative; z-index: 1;
  }
  .testimonial-footer {
    display: flex; align-items: center; gap: 14px;
    border-top: 1px solid rgba(157,192,139,0.14); padding-top: 24px;
  }
  .testimonial-avatar {
    width: 46px; height: 46px; border-radius: 50%;
    background: linear-gradient(135deg, var(--forest), var(--pine));
    color: #EDF1D6; display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(44,56,40,0.35);
  }
  .testimonial-name {
    font-size: 14px; font-weight: 600; color: #EDF1D6; display: block; margin-bottom: 3px;
  }
  .testimonial-role { font-size: 12px; color: rgba(157,192,139,0.5); }
  .testimonial-stat {
    margin-left: auto; font-size: 11px; font-weight: 700;
    color: var(--sage); background: rgba(157,192,139,0.12);
    padding: 6px 14px; border-radius: 9999px; white-space: nowrap;
  }

  /* ── FAQ ── */
  .faq-wrap {
    background: var(--white); border: 1px solid rgba(157,192,139,0.22);
    border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); overflow: hidden;
  }
  .faq-item { border-bottom: 1px solid rgba(157,192,139,0.14); }
  .faq-item:last-child { border-bottom: none; }
  .faq-btn {
    width: 100%; display: flex; align-items: center;
    justify-content: space-between; gap: 24px;
    padding: 28px 40px; background: transparent; border: none;
    cursor: pointer; text-align: left;
    transition: background 0.2s ease; font-family: var(--font-body);
  }
  .faq-btn:hover { background: rgba(237,241,214,0.4); }
  .faq-q { font-size: 15px; font-weight: 600; color: var(--pine); line-height: 1.5; }
  .faq-toggle {
    width: 34px; height: 34px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: var(--transition);
    font-size: 22px; font-weight: 300; line-height: 1; font-family: var(--font-body);
  }
  .faq-toggle-closed { background: rgba(96,153,102,0.1); color: var(--sage); }
  .faq-toggle-open { background: var(--forest); color: var(--cream); transform: rotate(45deg); }
  .faq-body {
    overflow: hidden; transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1);
  }
  .faq-a {
    padding: 0 40px 30px;
    font-size: 14.5px; line-height: 1.82; color: var(--forest);
  }

  /* ── FINAL CTA ── */
  .final-cta {
    text-align: center; padding: 128px 48px;
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #1e2a1b 0%, var(--pine) 50%, #253021 100%);
  }
  .final-cta-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 75% 55% at 50% 108%, rgba(96,153,102,0.32) 0%, transparent 65%);
  }
  .final-cta-h2 {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 5vw, 4rem);
    font-weight: 700; letter-spacing: -0.04em; line-height: 1.1;
    color: #EDF1D6; margin-bottom: 24px;
  }
  .final-cta-p {
    font-size: 17px; line-height: 1.75;
    color: rgba(157,192,139,0.62);
    max-width: 520px; margin: 0 auto 56px;
  }
  .final-cta-note {
    margin-top: 32px; font-size: 12px;
    color: rgba(157,192,139,0.32); letter-spacing: 0.05em;
  }

  /* ── FOOTER ── */
  .footer { background: #1a251a; border-top: 1px solid rgba(96,153,102,0.16); }
  .footer-inner { max-width: 1160px; margin: 0 auto; padding: 80px 48px 44px; }
  .footer-grid {
    display: grid; grid-template-columns: 2fr 1fr 1fr;
    gap: 64px; padding-bottom: 56px;
    border-bottom: 1px solid rgba(96,153,102,0.13); margin-bottom: 36px;
  }
  .footer-about { font-size: 14px; line-height: 1.8; color: rgba(157,192,139,0.42); max-width: 300px; margin: 20px 0 30px; }
  .footer-socials { display: flex; gap: 10px; }
  .footer-social {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(96,153,102,0.1); border: 1px solid rgba(96,153,102,0.16);
    color: var(--sage); font-size: 11.5px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: var(--transition); font-family: var(--font-body);
  }
  .footer-social:hover { background: rgba(96,153,102,0.22); color: #EDF1D6; }
  .footer-col-title {
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.17em;
    text-transform: uppercase; color: rgba(157,192,139,0.32); margin-bottom: 24px;
  }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 16px; }
  .footer-links a {
    font-size: 14px; color: rgba(157,192,139,0.48);
    text-decoration: none; transition: color 0.2s;
  }
  .footer-links a:hover { color: #EDF1D6; }
  .footer-bottom { display: flex; align-items: center; justify-content: space-between; }
  .footer-copy { font-size: 12.5px; color: rgba(157,192,139,0.28); }
  .footer-live { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(157,192,139,0.32); }
  .live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--sage); animation: pulseDot 2s ease infinite; }
  .logout-btn {
    padding: 11px 24px;
    background: #FFECEC;
    color: #AE2E2E;
    border: 1.5px solid #fee2e2;
    border-radius: 12px;
    cursor: pointer;
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.5px;
    transition: var(--transition);
  }
  .logout-btn:hover {
    background: #AE2E2E;
    color: #ffffff;
    transform: translateY(-1px);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .stats-grid       { grid-template-columns: repeat(2,1fr); }
    .features-grid    { grid-template-columns: 1fr 1fr; }
    .steps-grid       { grid-template-columns: 1fr 1fr; }
    .testimonials-grid { grid-template-columns: 1fr 1fr; }
    .footer-grid      { grid-template-columns: 1fr 1fr; gap: 44px; }
  }
  @media (max-width: 768px) {
    .navbar           { padding: 0 20px; }
    .nav-links        { display: none; }
    .btn-ghost        { display: none; }
    .hamburger        { display: flex; }
    .hero             { padding: 100px 24px 80px; }
    .hero-float       { display: none; }
    .hero-cta-row     { flex-direction: column; }
    .btn-hero-primary,.btn-hero-outline { width: 100%; justify-content: center; }
    .section-cream,.section-dark,.final-cta { padding: 72px 24px; }
    .stats-grid       { grid-template-columns: 1fr 1fr; gap: 14px; }
    .features-grid    { grid-template-columns: 1fr; }
    .audience-grid    { grid-template-columns: 1fr; }
    .audience-card    { padding: 40px 32px; }
    .steps-grid       { grid-template-columns: 1fr; }
    .testimonials-grid { grid-template-columns: 1fr; }
    .footer-grid      { grid-template-columns: 1fr; gap: 36px; }
    .footer-inner     { padding: 60px 24px 36px; }
    .footer-bottom    { flex-direction: column; gap: 12px; text-align: center; }
    .faq-btn          { padding: 22px 24px; }
    .faq-a            { padding: 0 24px 26px; }
  }
`;

const ArrowRight = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const LandingPage = ({user, onLogout}) => {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const faqRefs = useRef([]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const features = [
        { icon: '⭐', tag: 'Trust', title: 'Verified Reputation System', desc: 'Every worker carries a public profile with verified star ratings, authentic bios, and real reviews from completed gigs — so you always hire with full confidence.' },
        { icon: '⚡', tag: 'Speed', title: 'Real-Time Hiring', desc: 'See applicants the moment they apply. Review profiles, accept the perfect fit with one click, and keep your operations moving without any delays.' },
        { icon: '🛡️', tag: 'Safety', title: 'Secure & Transparent', desc: 'Upfront salary details (₹), clear schedules, and fixed terms. No hidden surprises — both parties know exactly what to expect before day one.' },
    ];

    const steps = [
        { n: 1, icon: '👤', title: 'Create Your Profile', desc: 'Sign up in minutes. Add your bio, skills, and a photo to get discovered by top recruiters in your area.' },
        { n: 2, icon: '🔍', title: 'Post or Browse Jobs', desc: 'Recruiters post detailed listings. Workers browse hundreds of local gigs by category, pay, and location.' },
        { n: 3, icon: '🤝', title: 'Connect & Get Hired', desc: 'Apply instantly or accept the best applicant. Job status moves to In Progress automatically.' },
        { n: 4, icon: '⭐', title: 'Rate & Get Paid', desc: 'Job done? Both parties leave honest reviews that build lasting reputation and unlock better opportunities.' },
    ];

    const faqs = [
        { q: 'Is it free to sign up?', a: 'Yes! Creating a profile, browsing jobs, and posting listings is completely free for both workers and recruiters. No credit card required.' },
        { q: 'How does the rating system work?', a: 'Only users who have successfully completed a job together can leave a review. This guarantees every rating on Slate Fox is 100% authentic and verified.' },
        { q: 'Can I cancel an application or job?', a: "Absolutely. Workers can withdraw applications and recruiters can cancel jobs at any time while the status is still 'Open' — no penalties applied." },
        { q: 'What types of jobs are available?', a: 'From event management and catering to construction, logistics, and retail — Slate Fox covers a wide range of skilled and semi-skilled local gig categories across India.' },
        { q: 'Is my personal information secure?', a: 'We use industry-standard encryption and never share your personal data with third parties. Your privacy and data security are our highest priorities.' },
    ];

    const testimonials = [
        { quote: 'Finding reliable event staff in Pune used to take me days of phone calls. Now I post a job, check applicant star ratings, and hire the best ones in minutes. The review system is a total game-changer.', name: 'Rohan K.', role: 'Event Manager · Pune', initials: 'RK', stat: '140+ hires' },
        { quote: "I love the flexibility of picking up weekend shifts around my schedule. Building my profile and collecting 5-star reviews has made it so much easier to land the higher-paying gigs.", name: 'Priya S.', role: 'Catering Pro · Mumbai', initials: 'PS', stat: '60+ gigs' },
        { quote: "Slate Fox is the only platform where I actually trust the worker profiles. The verified reviews mean I never get surprised by someone underdelivering. Worth every second.", name: 'Aditya M.', role: 'Operations Lead · Bangalore', initials: 'AM', stat: '85+ hires' },
    ];

    const marqueeItems = [
        '✓ Verified Reviews', '✓ Instant Booking', '✓ No Hidden Fees', '✓ 12,000+ Workers',
        '✓ 3,500+ Monthly Jobs', '✓ 4.8★ Rating', '✓ Free to Sign Up', '✓ Real-Time Hiring',
        '✓ Verified Reviews', '✓ Instant Booking', '✓ No Hidden Fees', '✓ 12,000+ Workers',
        '✓ 3,500+ Monthly Jobs', '✓ 4.8★ Rating', '✓ Free to Sign Up', '✓ Real-Time Hiring',
    ];

    const getFaqH = (i) => {
        if (openFaq !== i) return '0px';
        const el = faqRefs.current[i];
        return el ? el.scrollHeight + 'px' : '180px';
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: css }} />

            {/* NAVBAR */}
            <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
                <a href="/" className="navbar-logo">
                    <div className="navbar-logo-icon">🦊</div>
                    <span className="navbar-logo-text">Slate<span className="accent">Fox</span></span>
                </a>
                <ul className="nav-links">
                    {[['Features', '#features'], ['How it Works', '#how-it-works'], ['Stories', '#testimonials'], ['FAQ', '#faq']].map(([l, h]) => (
                        <li key={l}><a href={h}>{l}</a></li>
                    ))}
                </ul>
                <div className="nav-actions">
                    {user ? (
                        <>
                            <button className="btn-primary-nav" onClick={() => navigate('/dashboard')}>Dashboard</button>
                            <button
                                onClick={onLogout}
                                style={{
                                    padding: '11px 24px',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#7f1d1d', // Deep red text
                                    background: '#fecaca', // Light red/sage-like background
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)',
                                    boxShadow: '0 4px 16px rgba(127, 29, 29, 0.15)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#fee2e2'; // Lighter on hover
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(127, 29, 29, 0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#fecaca';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(127, 29, 29, 0.15)';
                                }}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.transform = 'scale(0.97)';
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn-ghost" onClick={() => navigate('/login')}>Log In</button>
                            <button className="btn-primary-nav" onClick={() => navigate('/signup')}>Sign Up Free</button>
                        </>
                    )}
                    <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
                        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {mobileOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                        </svg>
                    </button>
                </div>
            </header>

            {mobileOpen && (
                <div className="mobile-menu">
                    {[['Features', '#features'], ['How it Works', '#how-it-works'], ['Stories', '#testimonials'], ['FAQ', '#faq'], ['Log In', '/login']].map(([l, h]) => (
                        <a key={l} href={h} onClick={() => setMobileOpen(false)}>{l}</a>
                    ))}
                </div>
            )}

            <main>
                {/* HERO */}
                <section className="hero">
                    <div className="hero-grain" />
                    <div className="hero-glow-tl" />
                    <div className="hero-glow-br" />
                    <div className="hero-glow-bottom" />
                    {[
                        { e: '💼', style: { top: '18%', left: '5%', animation: 'float 5s ease-in-out 0s infinite' } },
                        { e: '⭐', style: { top: '28%', right: '6%', animation: 'float 5s ease-in-out 1.5s infinite' } },
                        { e: '🎯', style: { bottom: '28%', left: '7%', animation: 'float 5s ease-in-out 3s infinite' } },
                        { e: '✅', style: { bottom: '22%', right: '5%', animation: 'float 5s ease-in-out 2s infinite' } },
                    ].map(({ e, style }, i) => (
                        <div key={i} className="hero-float" style={style}>{e}</div>
                    ))}

                    <div style={{ position: 'relative', maxWidth: 760, width: '100%' }}>
                        <div className="animate-fade-up">
                            <div className="hero-badge"><span className="pulse-dot" />India's Fastest Growing Gig Platform</div>
                        </div>
                        <h1 className="hero-title animate-fade-up delay-1">
                            Hire Top Local Talent.<br />
                            <span className="hero-title-shimmer">Find Your Next Great Gig.</span>
                        </h1>
                        <p className="hero-sub animate-fade-up delay-2">
                            Whether you need reliable workers for your next project or you're looking to earn extra income on your own schedule — Slate Fox brings transparent reviews, instant booking, and seamless job management to your fingertips.
                        </p>
                        <div className="hero-cta-row animate-fade-up delay-3">
                            <button className="btn-hero-primary" onClick={() => navigate('/jobs')}>
                                Browse Open Jobs <ArrowRight />
                            </button>
                            <button className="btn-hero-outline" onClick={() => navigate('/auth/signup')}>
                                Post a Job — It's Free
                            </button>
                        </div>
                        <div className="hero-trust animate-fade-up delay-4">
                            {['🔒 No hidden fees', '✨ Free to sign up', '⭐ 5-star verified reviews'].map(t => (
                                <span key={t} className="hero-trust-item">{t}</span>
                            ))}
                        </div>
                    </div>
                    <div className="scroll-indicator">
                        <span>Scroll</span><div className="scroll-line" />
                    </div>
                </section>

                {/* MARQUEE */}
                <div className="marquee-strip">
                    <div className="marquee-track">
                        {marqueeItems.map((item, i) => <span key={i} className="marquee-item">{item}</span>)}
                    </div>
                </div>

                {/* STATS */}
                <section className="section-cream">
                    <div className="section-inner">
                        <div className="stats-grid">
                            {[
                                { icon: '👷', val: '12,000+', label: 'Active Workers' },
                                { icon: '📋', val: '3,500+', label: 'Jobs Posted Monthly' },
                                { icon: '💚', val: '98%', label: 'Satisfaction Rate' },
                                { icon: '⭐', val: '4.8★', label: 'Average Rating' },
                            ].map(({ icon, val, label }) => (
                                <div key={label} className="stat-card">
                                    <span className="stat-icon">{icon}</span>
                                    <div className="stat-val">{val}</div>
                                    <div className="stat-label">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FEATURES */}
                <section id="features" className="section-cream" style={{ paddingTop: 0 }}>
                    <div className="section-inner">
                        <div className="section-head">
                            <span className="chip chip-green">Why Slate Fox</span>
                            <h2 className="section-h2 section-h2-dark">Built for Trust, Speed & Transparency</h2>
                            <p className="section-p-dark" style={{ textAlign: 'center' }}>
                                Designed from the ground up to prioritise confidence and speed for both recruiters and workers across India.
                            </p>
                        </div>
                        <div className="features-grid">
                            {features.map(({ icon, tag, title, desc }) => (
                                <article key={title} className="feature-card">
                                    <div className="feature-header">
                                        <span className="feature-chip">{tag}</span>
                                        <div className="feature-icon-box">{icon}</div>
                                    </div>
                                    <h3 className="feature-title">{title}</h3>
                                    <p className="feature-desc">{desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* DUAL AUDIENCE */}
                <section className="section-dark">
                    <div className="section-inner" style={{ position: 'relative' }}>
                        <div className="section-head">
                            <span className="chip chip-sage">Who It's For</span>
                            <h2 className="section-h2 section-h2-light">One Platform. Two Superpowers.</h2>
                        </div>
                        <div className="audience-grid">
                            {/* Workers */}
                            <div className="audience-card audience-card-cream">
                                <div className="audience-glow" style={{ background: 'radial-gradient(circle,rgba(157,192,139,0.1) 0%,transparent 70%)', top: -60, right: -60 }} />
                                <div className="audience-top">
                                    <div className="audience-emoji audience-emoji-cream">👷</div>
                                    <div>
                                        <span className="audience-overline audience-overline-cream">For Workers</span>
                                        <h3 className="audience-h3 audience-h3-cream">Be Your Own Boss</h3>
                                    </div>
                                </div>
                                <ul className="audience-list">
                                    {[
                                        { e: '🗓️', t: 'Flexible Schedule', d: 'Browse and apply for jobs that fit your availability — mornings, weekends, or full-time.' },
                                        { e: '📈', t: 'Build Your Brand', d: 'Every 5-star review boosts your profile rank, making you more visible to top recruiters.' },
                                        { e: '💬', t: 'No Middle-Men', d: 'Deal directly with recruiters. No commissions, no delays, no gatekeepers.' },
                                    ].map(({ e, t, d }) => (
                                        <li key={t} className="audience-item">
                                            <div className="audience-item-icon audience-item-icon-cream">{e}</div>
                                            <div>
                                                <div className="audience-item-title audience-item-title-cream">{t}</div>
                                                <div className="audience-item-desc audience-item-desc-cream">{d}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <button className="btn-audience-cream" onClick={() => navigate('/auth/signup')}>
                                    Create Worker Profile <ArrowRight />
                                </button>
                            </div>
                            {/* Recruiters */}
                            <div className="audience-card audience-card-green">
                                <div className="audience-glow" style={{ background: 'radial-gradient(circle,rgba(44,56,40,0.4) 0%,transparent 70%)', bottom: -60, left: -60 }} />
                                <div className="audience-top">
                                    <div className="audience-emoji audience-emoji-green">🏢</div>
                                    <div>
                                        <span className="audience-overline audience-overline-green">For Recruiters</span>
                                        <h3 className="audience-h3 audience-h3-green">Scale Your Team Fast</h3>
                                    </div>
                                </div>
                                <ul className="audience-list">
                                    {[
                                        { e: '🏆', t: 'Quality Assured', d: 'Filter every applicant by their verified star ratings — only hire the absolute best.' },
                                        { e: '📊', t: 'One Dashboard', d: 'Post jobs, track applications, accept workers, and mark jobs complete — all in one place.' },
                                        { e: '🔖', t: 'Build a Talent Roster', d: 'Rate workers after each gig and build a trusted list of go-to professionals for future needs.' },
                                    ].map(({ e, t, d }) => (
                                        <li key={t} className="audience-item">
                                            <div className="audience-item-icon audience-item-icon-green">{e}</div>
                                            <div>
                                                <div className="audience-item-title audience-item-title-green">{t}</div>
                                                <div className="audience-item-desc audience-item-desc-green">{d}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <button className="btn-audience-green" onClick={() => navigate('/auth/signup')}>
                                    Start Hiring Today <ArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section id="how-it-works" className="section-cream">
                    <div className="section-inner">
                        <div className="section-head">
                            <span className="chip chip-green">Simple Process</span>
                            <h2 className="section-h2 section-h2-dark">From Sign-Up to Hired in Minutes</h2>
                        </div>
                        <div className="steps-grid">
                            {steps.map(({ n, icon, title, desc }) => (
                                <div key={n} className="step-card">
                                    <div className="step-icon-wrap">
                                        <div className="step-icon-bg">{icon}</div>
                                        <div className="step-num">{n}</div>
                                    </div>
                                    <h4 className="step-title">{title}</h4>
                                    <p className="step-desc">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <section id="testimonials" className="section-dark">
                    <div className="section-inner" style={{ position: 'relative' }}>
                        <div className="section-head">
                            <span className="chip chip-muted">Success Stories</span>
                            <h2 className="section-h2 section-h2-light">Trusted by Thousands Across India</h2>
                        </div>
                        <div className="testimonials-grid">
                            {testimonials.map(({ quote, name, role, initials, stat }) => (
                                <blockquote key={name} className="testimonial-card" style={{ margin: 0 }}>
                                    <div className="stars">{'★★★★★'.split('').map((s, i) => <span key={i} className="star">{s}</span>)}</div>
                                    <p className="testimonial-text">{quote}</p>
                                    <footer className="testimonial-footer">
                                        <div className="testimonial-avatar">{initials}</div>
                                        <div>
                                            <span className="testimonial-name">{name}</span>
                                            <span className="testimonial-role">{role}</span>
                                        </div>
                                        <span className="testimonial-stat">{stat}</span>
                                    </footer>
                                </blockquote>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="section-cream">
                    <div className="section-inner-narrow">
                        <div className="section-head">
                            <span className="chip chip-green">Got Questions?</span>
                            <h2 className="section-h2 section-h2-dark">Frequently Asked Questions</h2>
                        </div>
                        <div className="faq-wrap">
                            {faqs.map((faq, i) => (
                                <div key={i} className="faq-item">
                                    <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                        <span className="faq-q">{faq.q}</span>
                                        <span className={`faq-toggle ${openFaq === i ? 'faq-toggle-open' : 'faq-toggle-closed'}`}>+</span>
                                    </button>
                                    <div className="faq-body" ref={el => faqRefs.current[i] = el} style={{ maxHeight: getFaqH(i) }}>
                                        <p className="faq-a">{faq.a}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="final-cta">
                    <div className="final-cta-glow" />
                    <div className="hero-grain" />
                    <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
                        <div className="hero-badge" style={{ marginBottom: 40 }}>
                            <span className="pulse-dot" />Join Thousands Already Working Smarter
                        </div>
                        <h2 className="final-cta-h2">Ready to transform<br />how you work?</h2>
                        <p className="final-cta-p">Join our growing community and take full control of your career or business today.</p>
                        <div className="hero-cta-row">
                            <button className="btn-hero-primary" onClick={() => navigate('/auth/signup')}>
                                Get Started for Free <ArrowRight />
                            </button>
                            <button className="btn-hero-outline" onClick={() => navigate('/jobs')}>
                                Browse Jobs First
                            </button>
                        </div>
                        <p className="final-cta-note">✓ No credit card required · ✓ Free forever plan · ✓ Cancel anytime</p>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-grid">
                        <div>
                            <a href="/" className="navbar-logo" style={{ display: 'inline-flex', marginBottom: 4 }}>
                                <div className="navbar-logo-icon">🦊</div>
                                <span className="navbar-logo-text">Slate<span className="accent">Fox</span></span>
                            </a>
                            <p className="footer-about">Connecting ambition with opportunity. India's trusted marketplace for local gig work and skilled hiring across every city.</p>
                            <div className="footer-socials">
                                {[['T', 'Twitter'], ['in', 'LinkedIn'], ['IG', 'Instagram']].map(([l, n]) => (
                                    <button key={n} aria-label={n} className="footer-social">{l}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="footer-col-title">Platform</h4>
                            <ul className="footer-links">
                                {[['Browse Jobs', '/jobs'], ['Post a Job', '/auth/signup'], ['Pricing', '/pricing']].map(([l, h]) => (
                                    <li key={l}><a href={h}>{l}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="footer-col-title">Company</h4>
                            <ul className="footer-links">
                                {[['About Us', '/about'], ['Contact', '/contact'], ['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']].map(([l, h]) => (
                                    <li key={l}><a href={h}>{l}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <span className="footer-copy">© 2026 Slate Fox Marketplace. All rights reserved.</span>
                        <div className="footer-live"><span className="live-dot" />&nbsp;Live &amp; Hiring Now</div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default LandingPage;