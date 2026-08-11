import React, { useState, useEffect, useRef, useCallback } from 'react';
import heic2any from 'heic2any';
import confetti from 'canvas-confetti';
import {
  Upload,
  Shuffle,
  Download,
  Share2,
  Sparkles,
  RefreshCw,
  Check,
  Copy,
  Layers,
  ZoomIn,
  Move,
  Terminal,
  ShieldCheck,
  AlertCircle,
  X,
  Zap,
  MapPin,
  Calendar,
  Ticket,
  User,
  Briefcase,
  Award,
  Image as ImageIcon,
  Code2,
  Palmtree,
  Sliders,
  Code
} from 'lucide-react';

import ThreeBackground from './ThreeBackground';
import Card3DShowcase from './Card3DShowcase';
import HackerHouseGoaLogo from './HackerHouseGoaLogo';

import defaultAvatar from './default_avatar.jpg';
import defaultBg from './default_bg.jpg';
import logoSvg from './logo.svg';

// Preset Builder Titles for the Randomizer button
const BUILDER_TITLES = [
  "Chain Architect",
  "GPU Whisperer",
  "Zero-Knowledge Ninja",
  "Protocol Hacker",
  "Solana Sorcerer",
  "DeFi Alchemist",
  "Autonomous Agent Dev",
  "Rust Kernel Wizard",
  "LLM Prompt Engineer",
  "Fullstack Cypherpunk",
  "Matrix Operative",
  "Byte Sculptor",
  "Consensus Crafter",
  "Wasm Wrangler",
  "Smart Contract Auditor",
  "Neural Net Hacker"
];

// Hacker House Goa Rich Green Theme Palettes
const THEMES = [
  {
    id: 'hh-goa-green',
    name: 'Goa Rich Green',
    gradient: ['#0c6838', '#084d28', '#04331a'],
    accentPrimary: '#ff007a', // Hot Pink
    accentSecondary: '#facc15', // Gold/Yellow
    accentTertiary: '#38bdf8', // Sky Blue
    accentGlow: 'rgba(250, 204, 21, 0.65)',
    pillBg: '#ff007a',
    pillText: '#ffffff',
    borderColor: '#facc15',
    textColor: '#ffffff',
    subtextColor: '#fef08a',
    devanagariBg: '#ff007a',
    devanagariText: '#ffffff',
    circleLogoBg: '#0c6838',
    circleLogoText: '#facc15',
  },
  {
    id: 'sunset-workspace',
    name: 'Goa Sunset Workspace',
    gradient: ['#2a0a18', '#50122e', '#1c0712'],
    accentPrimary: '#f59e0b', // Sunset Amber
    accentSecondary: '#ff007a', // Hot Pink
    accentTertiary: '#fbbf24', // Sun Yellow
    accentGlow: 'rgba(245, 158, 11, 0.65)',
    pillBg: '#f59e0b',
    pillText: '#1c0712',
    borderColor: '#ff007a',
    textColor: '#ffffff',
    subtextColor: '#fde68a',
    devanagariBg: '#ec4899',
    devanagariText: '#ffffff',
    circleLogoBg: '#0c6838',
    circleLogoText: '#facc15',
  },
  {
    id: 'coastal-breeze',
    name: 'Coastal Ocean Tech',
    gradient: ['#032b45', '#064e3b', '#021827'],
    accentPrimary: '#06b6d4', // Ocean Cyan
    accentSecondary: '#10b981', // Emerald
    accentTertiary: '#facc15', // Gold
    accentGlow: 'rgba(6, 182, 212, 0.65)',
    pillBg: '#06b6d4',
    pillText: '#032b45',
    borderColor: '#38bdf8',
    textColor: '#ffffff',
    subtextColor: '#a7f3d0',
    devanagariBg: '#059669',
    devanagariText: '#ffffff',
    circleLogoBg: '#0c6838',
    circleLogoText: '#facc15',
  },
  {
    id: 'cyber-midnight',
    name: 'Cyber Night Goa',
    gradient: ['#090d16', '#1e1b4b', '#030712'],
    accentPrimary: '#e11d48', // Cyber Crimson
    accentSecondary: '#38bdf8', // Neon Sky
    accentTertiary: '#facc15', // Gold
    accentGlow: 'rgba(225, 29, 72, 0.65)',
    pillBg: '#e11d48',
    pillText: '#ffffff',
    borderColor: '#f43f5e',
    textColor: '#ffffff',
    subtextColor: '#cbd5e1',
    devanagariBg: '#be123c',
    devanagariText: '#ffffff',
    circleLogoBg: '#0c6838',
    circleLogoText: '#facc15',
  }
];

// Helper function to draw rounded rectangles compatible with all browsers
function drawRoundRect(ctx, x, y, width, height, radius) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

export default function App() {
  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState("hh-goa-green");
  const [serialId, setSerialId] = useState("HH26-BLDR-8942");

  // Rendered Canvas Data URL for 3D card sync
  const [cardDataUrl, setCardDataUrl] = useState('');

  // Image & Canvas Controls State
  const [photoUrl, setPhotoUrl] = useState(defaultAvatar);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [zoom, setZoom] = useState(1.0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // References
  const canvasRef = useRef(null);
  const studioRef = useRef(null);
  const photoImgRef = useRef(null);
  const bgImgRef = useRef(null);
  const logoImgRef = useRef(null);

  const activeTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];

  // Preload default background art and logo SVG
  useEffect(() => {
    const bg = new Image();
    bg.crossOrigin = "anonymous";
    bg.src = defaultBg;
    bg.onload = () => {
      bgImgRef.current = bg;
      renderCanvas();
    };

    const logo = new Image();
    logo.crossOrigin = "anonymous";
    logo.src = logoSvg;
    logo.onload = () => {
      logoImgRef.current = logo;
      renderCanvas();
    };
  }, []);

  // Preload/Update photo image object whenever photoUrl changes
  useEffect(() => {
    if (!photoUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = photoUrl;
    img.onload = () => {
      photoImgRef.current = img;
      renderCanvas();
    };
    img.onerror = () => {
      setErrorMessage("Failed to render the image. Please try uploading another photo.");
    };
  }, [photoUrl]);

  // Main Canvas Rendering Function
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed HD 16:9 Canvas Dimensions
    const W = 1200;
    const H = 675;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw Theme Background Gradient (Hacker House Goa Rich Green Base)
    const bgGradient = ctx.createLinearGradient(0, 0, W, H);
    bgGradient.addColorStop(0, activeTheme.gradient[0]);
    bgGradient.addColorStop(0.5, activeTheme.gradient[1]);
    bgGradient.addColorStop(1, activeTheme.gradient[2]);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, W, H);

    // 2. Draw Background Image Art (Subtle Overlay)
    if (bgImgRef.current) {
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.drawImage(bgImgRef.current, 0, 0, W, H);
      ctx.restore();
    }

    // 3. Draw Floating Developer Symbols ({}, </>, Σ, =>)
    ctx.save();
    ctx.fillStyle = 'rgba(250, 204, 21, 0.08)';
    ctx.font = '700 28px "Fira Code", monospace';
    const codeSymbols = ['{ }', '</>', 'Σ', '=>', 'fn()', 'git', '0x1', 'npm'];
    let symbolIdx = 0;
    for (let x = 80; x < W; x += 160) {
      for (let y = 60; y < H; y += 140) {
        ctx.fillText(codeSymbols[symbolIdx % codeSymbols.length], x, y);
        symbolIdx++;
      }
    }
    ctx.restore();

    // 4. Tropical Sun Rays / Ambient Glow Orbs
    ctx.save();
    const sunGlow = ctx.createRadialGradient(1050, 150, 20, 1050, 150, 450);
    sunGlow.addColorStop(0, 'rgba(250, 204, 21, 0.35)');
    sunGlow.addColorStop(0.5, 'rgba(255, 0, 122, 0.2)');
    sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(1050, 150, 450, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Card Outer Frame (Golden/Pink Dual Bezel)
    ctx.save();
    ctx.strokeStyle = activeTheme.accentSecondary;
    ctx.lineWidth = 4;
    ctx.shadowColor = activeTheme.accentGlow;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    drawRoundRect(ctx, 20, 20, W - 40, H - 40, 28);
    ctx.stroke();

    ctx.strokeStyle = activeTheme.accentPrimary;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    drawRoundRect(ctx, 28, 28, W - 56, H - 56, 22);
    ctx.stroke();
    ctx.restore();

    // 6. Header Banner Box
    ctx.save();
    ctx.fillStyle = 'rgba(8, 77, 40, 0.88)';
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    drawRoundRect(ctx, 60, 40, 1080, 80, 22);
    ctx.fill();
    ctx.stroke();

    // 6a. Draw Hacker House Goa SVG Logo on Canvas
    if (logoImgRef.current) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.drawImage(logoImgRef.current, 72, 46, 85, 68);
    }


    // 6b. Header Title: "HH GOA 2026"
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 34px Orbitron, sans-serif';
    ctx.shadowColor = activeTheme.accentSecondary;
    ctx.shadowBlur = 18;
    ctx.fillText('HH GOA 2026', 158, 77);

    // 6c. Header Subtitle: "BUILDER ID PASS"
    ctx.font = '700 13px "Fira Code", monospace';
    ctx.fillStyle = activeTheme.accentSecondary;
    ctx.shadowBlur = 0;
    ctx.fillText('/// BUILDER ID PASS • T.SATHVIK', 160, 100);

    // 6d. Header Hashtag Pill Badge: "#FrameInGoa"
    ctx.fillStyle = 'rgba(255, 0, 122, 0.2)';
    ctx.strokeStyle = activeTheme.accentPrimary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    drawRoundRect(ctx, 935, 57, 175, 44, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 14px "Fira Code", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('#FrameInGoa', 1022, 84);
    ctx.restore();

    // 7. Dynamic Aspect-Ratio Photo Container (Left Side)
    const photoBoxX = 60;
    const photoBoxY = 140;
    const photoBoxW = 380;
    const photoBoxH = 470;
    const photoBoxRadius = 24;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#0c6838';
    ctx.beginPath();
    drawRoundRect(ctx, photoBoxX, photoBoxY, photoBoxW, photoBoxH, photoBoxRadius);
    ctx.fill();
    ctx.restore();

    if (photoImgRef.current) {
      const img = photoImgRef.current;
      const imgW = img.naturalWidth || img.width;
      const imgH = img.naturalHeight || img.height;

      if (imgW && imgH) {
        const scale = Math.max(photoBoxW / imgW, photoBoxH / imgH) * zoom;
        const renderW = imgW * scale;
        const renderH = imgH * scale;

        const drawX = photoBoxX + (photoBoxW - renderW) / 2 + offsetX;
        const drawY = photoBoxY + (photoBoxH - renderH) / 2 + offsetY;

        ctx.save();
        ctx.beginPath();
        drawRoundRect(ctx, photoBoxX, photoBoxY, photoBoxW, photoBoxH, photoBoxRadius);
        ctx.clip();
        ctx.drawImage(img, drawX, drawY, renderW, renderH);

        const photoOverlay = ctx.createLinearGradient(0, photoBoxY + photoBoxH - 120, 0, photoBoxY + photoBoxH);
        photoOverlay.addColorStop(0, 'rgba(0, 0, 0, 0)');
        photoOverlay.addColorStop(1, 'rgba(12, 104, 56, 0.85)');
        ctx.fillStyle = photoOverlay;
        ctx.fillRect(photoBoxX, photoBoxY + photoBoxH - 120, photoBoxW, 120);

        ctx.restore();
      }
    }

    ctx.save();
    ctx.strokeStyle = activeTheme.accentSecondary;
    ctx.lineWidth = 3.5;
    ctx.shadowColor = activeTheme.accentGlow;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    drawRoundRect(ctx, photoBoxX, photoBoxY, photoBoxW, photoBoxH, photoBoxRadius);
    ctx.stroke();

    ctx.strokeStyle = activeTheme.accentPrimary;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    drawRoundRect(ctx, photoBoxX + 5, photoBoxY + 5, photoBoxW - 10, photoBoxH - 10, photoBoxRadius - 4);
    ctx.stroke();

    const drawCross = (cx, cy) => {
      ctx.strokeStyle = activeTheme.accentSecondary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy);
      ctx.lineTo(cx + 8, cy);
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx, cy + 8);
      ctx.stroke();
    };
    drawCross(photoBoxX + 20, photoBoxY + 20);
    drawCross(photoBoxX + photoBoxW - 20, photoBoxY + 20);
    drawCross(photoBoxX + 20, photoBoxY + photoBoxH - 20);
    drawCross(photoBoxX + photoBoxW - 20, photoBoxY + photoBoxH - 20);

    // Verified Stamp on Photo
    ctx.fillStyle = 'rgba(8, 77, 40, 0.9)';
    ctx.strokeStyle = activeTheme.accentSecondary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    drawRoundRect(ctx, photoBoxX + 16, photoBoxY + photoBoxH - 46, 145, 30, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = activeTheme.accentSecondary;
    ctx.font = '700 11px "Fira Code", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✓ BUILDER VERIFIED', photoBoxX + 88, photoBoxY + photoBoxH - 26);
    ctx.restore();

    // 8. Builder Details Section
    const rightX = 470;

    // Title Pill
    ctx.save();
    const formattedTitle = (title || "CHAIN ARCHITECT").toUpperCase();
    ctx.font = 'bold 15px Orbitron, sans-serif';
    const titleWidth = ctx.measureText(formattedTitle).width + 38;

    ctx.fillStyle = activeTheme.pillBg;
    ctx.shadowColor = activeTheme.accentGlow;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    drawRoundRect(ctx, rightX, 140, Math.max(titleWidth, 230), 42, 21);
    ctx.fill();

    ctx.fillStyle = activeTheme.pillText;
    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';
    ctx.fillText(formattedTitle, rightX + 19, 167);
    ctx.restore();

    // Name Text
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Orbitron, sans-serif';
    ctx.shadowColor = activeTheme.accentSecondary;
    ctx.shadowBlur = 16;
    ctx.textAlign = 'left';
    const truncatedName = name.length > 22 ? name.substring(0, 22) + '...' : name;
    ctx.fillText(truncatedName || "Alex Rivera", rightX, 236);
    ctx.restore();

    // Role Text
    ctx.save();
    ctx.fillStyle = activeTheme.accentTertiary;
    ctx.font = '600 22px "Fira Code", monospace';
    ctx.textAlign = 'left';
    const formattedRole = role || "Fullstack AI Engineer";
    const truncatedRole = formattedRole.length > 34 ? formattedRole.substring(0, 34) + '...' : formattedRole;
    ctx.fillText(truncatedRole, rightX, 278);
    ctx.restore();

    // Detailed Info Glass Box
    ctx.save();
    const infoBoxY = 305;
    const infoBoxW = 670;
    const infoBoxH = 238;

    ctx.fillStyle = 'rgba(8, 77, 40, 0.85)';
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    drawRoundRect(ctx, rightX, infoBoxY, infoBoxW, infoBoxH, 20);
    ctx.fill();
    ctx.stroke();

    const col1X = rightX + 24;
    let rowY = infoBoxY + 38;

    const drawMetaRow = (label, val, highlight = false) => {
      ctx.fillStyle = '#fef08a';
      ctx.font = '600 12px "Fira Code", monospace';
      ctx.fillText(label, col1X, rowY);

      ctx.fillStyle = highlight ? activeTheme.accentSecondary : '#ffffff';
      ctx.font = highlight ? 'bold 15px Orbitron, sans-serif' : '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(val, col1X + 130, rowY);
      rowY += 38;
    };

    drawMetaRow('PASS ID:', serialId, true);
    drawMetaRow('EVENT:', 'HACKER HOUSE GOA 2026');
    drawMetaRow('LOCATION:', 'GOA, INDIA 🌴');
    drawMetaRow('DATES:', 'NOV 12 - NOV 18, 2026');
    drawMetaRow('AUTHOR:', 'DEVELOPED BY T.SATHVIK');

    // QR Matrix Block
    const qrBoxX = rightX + 490;
    const qrBoxY = infoBoxY + 24;
    const qrSize = 155;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    drawRoundRect(ctx, qrBoxX, qrBoxY, qrSize, qrSize, 14);
    ctx.fill();

    ctx.fillStyle = '#0c6838';
    const cellCount = 13;
    const startX = qrBoxX + 12;
    const startY = qrBoxY + 12;

    const drawFinder = (fx, fy) => {
      ctx.fillRect(fx, fy, 35, 35);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fx + 5, fy + 5, 25, 25);
      ctx.fillStyle = '#0c6838';
      ctx.fillRect(fx + 10, fy + 10, 15, 15);
    };

    drawFinder(startX, startY);
    drawFinder(startX + 88, startY);
    drawFinder(startX, startY + 88);

    const seed = (name + serialId).length;
    for (let r = 0; r < cellCount; r++) {
      for (let c = 0; c < cellCount; c++) {
        if ((r < 4 && c < 4) || (r < 4 && c > 8) || (r > 8 && c < 4)) continue;
        if ((r * 7 + c * 13 + seed) % 3 === 0) {
          ctx.fillRect(startX + c * 9.8, startY + r * 9.8, 8, 8);
        }
      }
    }

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 10px "Fira Code", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN TO VERIFY', qrBoxX + qrSize / 2, qrBoxY + qrSize + 18);
    ctx.restore();

    // Footer Hashtags
    ctx.save();
    ctx.fillStyle = activeTheme.accentSecondary;
    ctx.font = '700 13px "Fira Code", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('#FrameInGoa  •  #HHGoa2026  •  Developed by T.Sathvik', rightX, 582);

    ctx.fillStyle = '#fef08a';
    ctx.font = '500 12px "Fira Code", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('BUILDER PASS v2.6', W - 60, 582);
    ctx.restore();

    try {
      const dataUrl = canvas.toDataURL('image/png');
      setCardDataUrl(dataUrl);
    } catch (e) {
      console.warn("Canvas data URL sync warning:", e);
    }

  }, [name, role, title, activeTheme, zoom, offsetX, offsetY, serialId]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleImageFile = async (file) => {
    if (!file) return;

    setErrorMessage(null);
    setIsProcessingImage(true);

    const fileName = file.name.toLowerCase();
    const isHeic = fileName.endsWith('.heic') || fileName.endsWith('.heif') || file.type.includes('heic') || file.type.includes('heif');

    try {
      if (isHeic) {
        const conversionResult = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9,
        });

        const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
        const objectUrl = URL.createObjectURL(blob);
        setPhotoUrl(objectUrl);
        setZoom(1.0);
        setOffsetX(0);
        setOffsetY(0);
      } else {
        const objectUrl = URL.createObjectURL(file);
        setPhotoUrl(objectUrl);
        setZoom(1.0);
        setOffsetX(0);
        setOffsetY(0);
      }
    } catch (err) {
      console.error("Image parsing or HEIC conversion error:", err);
      setErrorMessage("Failed to process image. If using HEIC, ensure it is a valid iPhone photo, or try uploading a JPG/PNG.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRandomizeTitle = () => {
    let nextTitle = title;
    while (nextTitle === title) {
      const randomIndex = Math.floor(Math.random() * BUILDER_TITLES.length);
      nextTitle = BUILDER_TITLES[randomIndex];
    }
    setTitle(nextTitle);
  };

  const handleRandomizeSerial = () => {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    setSerialId(`HH26-BLDR-${randNum}`);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 }
    });

    const safeName = (name || "Alex_Rivera").trim().replace(/\s+/g, '_');
    const filename = `HH_Goa_2026_${safeName}.png`;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const handleShareToX = () => {
    const tweetText = `Just generated my Hacker House Goa 2026 Builder Pass! 🚀🌴\n\nRole: ${role}\nTitle: ${title}\n\nDeveloped by T.Sathvik 🌊💻 #FrameInGoa #HHGoa2026`;
    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 3000);
      });
    } catch (err) {
      console.error("Clipboard copy error:", err);
      alert("Image copy to clipboard not supported on this browser. Use the Download PNG button!");
    }
  };

  const scrollToStudio = () => {
    if (studioRef.current) {
      studioRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c6838] text-slate-100 flex flex-col font-sans selection:bg-[#ff007a] selection:text-white relative overflow-x-hidden">
      
      {/* 3D WebGL Background Canvas */}
      <ThreeBackground />

      {/* Top Navbar in Rich Green Style */}
      <header className="border-b border-[#facc15]/30 bg-[#0c6838]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {/* Hacker House Goa Logo Component */}
            <HackerHouseGoaLogo className="w-11 h-11" />

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-orbitron font-extrabold text-base sm:text-xl tracking-wider text-white">
                  HACKER HOUSE <span className="text-[#ff007a]">GOA</span> <span className="text-[#facc15]">2026</span>
                </h1>
              </div>
              <p className="text-xs text-[#facc15] font-mono flex items-center space-x-1">
                <Code className="w-3 h-3 text-[#ff007a]" />
                <span>Developed by T.Sathvik</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={scrollToStudio}
              className="text-xs font-mono font-bold px-4 py-2 rounded-xl bg-[#ff007a] hover:bg-rose-600 text-white shadow-lg shadow-[#ff007a]/30 transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Pass</span>
            </button>
          </div>
        </div>
      </header>

      {/* SIMPLE & CLEAN 3D INTRO HERO SECTION */}
      <section className="relative z-10 py-8 sm:py-12 max-w-5xl mx-auto px-4 text-center space-y-6">
        
        {/* Hacker House Goa Logo Header Banner */}
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center space-y-4">
          <HackerHouseGoaLogo className="w-20 h-20 shadow-2xl animate-pulse-goa" />

          <h1 className="font-orbitron font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
            HACKER HOUSE <span className="text-[#ff007a]">GOA</span> 2026
          </h1>
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#084d28] border border-[#facc15]/40 text-[#facc15] text-xs font-mono font-bold">
            <Code className="w-3.5 h-3.5 text-[#ff007a]" />
            <span>ID Card Generator Project • Developed by T.Sathvik</span>
          </div>
        </div>

        {/* 3D Card Showcase */}
        <Card3DShowcase
          cardDataUrl={cardDataUrl}
          serialId={serialId}
        />

      </section>

      {/* GENERATOR STUDIO SECTION */}
      <section ref={studioRef} id="studio" className="relative z-10 pt-6 pb-16 border-t border-[#facc15]/30 bg-[#084d28]/95">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center max-w-md mx-auto mb-6 space-y-1">
            <h2 className="font-orbitron font-bold text-xl text-white flex items-center justify-center space-x-2">
              <Sliders className="w-5 h-5 text-[#facc15]" />
              <span>BUILDER PASS STUDIO</span>
            </h2>
            <p className="text-xs font-mono text-[#facc15]">
              Customize name, role, title, photo, and download PNG
            </p>
          </div>

          {/* Main Studio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Form Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="glass-panel-goa rounded-2xl p-5 border border-[#facc15]/30 space-y-5 shadow-xl">
                
                {/* Error Message Toast */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold">Image Parsing Issue</p>
                      <p className="text-[11px] text-rose-300">{errorMessage}</p>
                    </div>
                    <button onClick={() => setErrorMessage(null)} className="text-rose-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* File Upload Drag & Drop Area */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-100 uppercase tracking-wider flex items-center space-x-1">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Upload Photo (JPG, PNG, HEIC)</span>
                  </label>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      isDraggingFile
                        ? 'border-[#ff007a] bg-[#ff007a]/15 scale-[1.01]'
                        : 'border-[#facc15]/40 hover:border-[#facc15] bg-[#0c6838]/70'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/heic,image/heif"
                      onChange={(e) => e.target.files && handleImageFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    {isProcessingImage ? (
                      <div className="flex items-center justify-center space-x-2 py-2">
                        <RefreshCw className="w-5 h-5 text-[#ff007a] animate-spin" />
                        <span className="text-xs font-mono text-[#facc15]">Converting HEIC image...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <Upload className="w-5 h-5 text-[#ff007a]" />
                        <span className="text-xs font-semibold text-slate-100">
                          Drop photo here or <span className="text-[#ff007a] underline">Browse</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Photo Zoom & Pan */}
                <div className="p-3 rounded-xl bg-[#0c6838]/80 border border-[#facc15]/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#facc15] font-mono">
                    <span className="flex items-center space-x-1">
                      <ZoomIn className="w-3.5 h-3.5 text-[#facc15]" />
                      <span>Crop Zoom</span>
                    </span>
                    <span>{(zoom * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="2.5"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[#04331a] rounded-lg appearance-none cursor-pointer accent-[#ff007a]"
                  />

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] font-mono text-[#facc15] flex justify-between">
                        <span>Pan X</span>
                        <span>{offsetX}px</span>
                      </label>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        step="5"
                        value={offsetX}
                        onChange={(e) => setOffsetX(parseInt(e.target.value))}
                        className="w-full h-1 bg-[#04331a] rounded appearance-none accent-[#facc15]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[#facc15] flex justify-between">
                        <span>Pan Y</span>
                        <span>{offsetY}px</span>
                      </label>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        step="5"
                        value={offsetY}
                        onChange={(e) => setOffsetY(parseInt(e.target.value))}
                        className="w-full h-1 bg-[#04331a] rounded appearance-none accent-[#facc15]"
                      />
                    </div>
                  </div>
                </div>

                {/* Name Input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-100 uppercase tracking-wider flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-[#ff007a]" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full px-3.5 py-2 bg-[#0c6838] border border-[#facc15]/30 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-[#ff007a]"
                  />
                </div>

                {/* Stack / Role Input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-100 uppercase tracking-wider flex items-center space-x-1">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Stack / Role</span>
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Fullstack AI Engineer"
                    className="w-full px-3.5 py-2 bg-[#0c6838] border border-[#facc15]/30 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Builder Title with Randomize Button */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-100 uppercase tracking-wider flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5 text-[#facc15]" />
                      <span>Builder Title</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleRandomizeTitle}
                      className="text-[11px] font-mono text-[#facc15] hover:underline flex items-center space-x-1"
                    >
                      <Shuffle className="w-3 h-3" />
                      <span>Randomize</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Chain Architect"
                    className="w-full px-3.5 py-2 bg-[#0c6838] border border-[#facc15]/30 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-[#facc15]"
                  />
                </div>

                {/* Theme Selector */}
                <div className="space-y-1.5 pt-1 border-t border-[#facc15]/30">
                  <label className="text-xs font-semibold text-slate-100 uppercase tracking-wider flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-[#facc15]" />
                    <span>Theme Aesthetic</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedThemeId(t.id)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                          selectedThemeId === t.id
                            ? 'border-[#facc15] bg-[#facc15]/10 text-white'
                            : 'border-[#facc15]/30 bg-[#0c6838]/70 text-[#facc15] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ backgroundColor: t.accentPrimary }}
                          />
                          <span className="text-xs font-semibold truncate">{t.name}</span>
                        </div>
                        {selectedThemeId === t.id && <Check className="w-3.5 h-3.5 text-[#facc15]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Canvas Live Preview & Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-5 sticky top-24">
              <div className="glass-panel-goa rounded-2xl p-5 border border-[#facc15]/30 space-y-5 shadow-xl">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code2 className="w-4 h-4 text-[#ff007a]" />
                    <h3 className="font-orbitron font-bold text-base text-white">Live Canvas Render</h3>
                  </div>
                  <button
                    onClick={handleRandomizeSerial}
                    className="text-xs font-mono text-[#facc15] hover:text-white flex items-center space-x-1 bg-[#0c6838] px-2 py-0.5 rounded-lg border border-[#facc15]/40"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{serialId}</span>
                  </button>
                </div>

                {/* HTML5 Canvas Container (1200x675 16:9 Aspect Ratio) */}
                <div className="relative rounded-2xl overflow-hidden border border-[#facc15]/40 bg-[#0c6838] shadow-2xl">
                  <div className="w-full aspect-[16/9] relative">
                    <canvas
                      ref={canvasRef}
                      width={1200}
                      height={675}
                      className="w-full h-full object-contain block rounded-2xl"
                    />
                  </div>
                </div>

                {/* Action Buttons: Download PNG & Share to X */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleDownload}
                    className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#ff007a] to-rose-600 hover:from-rose-600 hover:to-[#ff007a] text-white font-orbitron font-bold text-xs tracking-wide shadow-lg shadow-[#ff007a]/25 transition flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD PASS (.PNG)</span>
                  </button>

                  <button
                    onClick={handleShareToX}
                    className="w-full py-3 px-5 rounded-xl bg-[#0c6838] hover:bg-[#084d28] text-white border border-[#facc15]/40 hover:border-[#facc15] font-orbitron font-bold text-xs tracking-wide transition flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-4 h-4 text-[#facc15]" />
                    <span>SHARE TO X (#FrameInGoa)</span>
                  </button>
                </div>

                {/* Copy Image Button */}
                <div className="flex items-center justify-between pt-1 border-t border-[#facc15]/30">
                  <button
                    onClick={handleCopyImage}
                    className="text-xs font-mono text-[#facc15] hover:text-white flex items-center space-x-1 transition"
                  >
                    {copiedNotification ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied Image to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Image</span>
                      </>
                    )}
                  </button>

                  <span className="text-xs font-mono text-[#facc15]">Developed by T.Sathvik</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#facc15]/30 bg-[#084d28] py-5 text-center text-xs text-[#facc15] font-mono space-y-1">
        <p>HACKER HOUSE GOA 2026 — BUILDER ID CARD GENERATOR</p>
        <p className="text-emerald-200/80 font-bold">Developed by T.Sathvik</p>
      </footer>
    </div>
  );
}
