import React, { useState, useRef } from 'react';
import { ShieldCheck, RotateCw, Layers, Sparkles, Code, Flame } from 'lucide-react';
import HackerHouseGoaLogo from './HackerHouseGoaLogo';

export default function Card3DShowcase({ cardDataUrl, serialId }) {
  const [rotateX, setRotateX] = useState(12);
  const [rotateY, setRotateY] = useState(-14);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [showHoloFoil, setShowHoloFoil] = useState(true);
  const cardContainerRef = useRef(null);

  // Smooth mouse move 3D tilt calculation
  const handleMouseMove = (e) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rY = (mouseX / (rect.width / 2)) * 24;
    const rX = -(mouseY / (rect.height / 2)) * 24;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(10);
    setRotateY(-12);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 my-2">
      
      {/* 3D Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 z-20">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-3.5 py-1.5 rounded-xl bg-[#084d28] hover:bg-[#0c6838] text-[#facc15] border border-[#facc15]/40 text-xs font-mono font-bold transition flex items-center space-x-1.5 shadow-md active:scale-95"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#ff007a]" />
          <span>{isFlipped ? "Show Front" : "Flip 3D Pass"}</span>
        </button>

        <button
          onClick={() => setIsExploded(!isExploded)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 shadow-md active:scale-95 ${
            isExploded
              ? 'bg-[#ff007a] text-white border border-white shadow-lg shadow-[#ff007a]/40'
              : 'bg-[#084d28] hover:bg-[#0c6838] text-slate-200 border border-[#facc15]/40'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#facc15]" />
          <span>{isExploded ? "Collapse 3D Layers" : "Explode 3D Layers"}</span>
        </button>

        <button
          onClick={() => setShowHoloFoil(!showHoloFoil)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 shadow-md active:scale-95 ${
            showHoloFoil
              ? 'bg-[#facc15] text-[#0c6838] border border-white font-black'
              : 'bg-[#084d28] hover:bg-[#0c6838] text-slate-200 border border-[#facc15]/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ff007a]" />
          <span>{showHoloFoil ? "3D Holo Foil ON" : "3D Holo Foil OFF"}</span>
        </button>
      </div>

      {/* Sleek 3D Card Perspective Box */}
      <div className="perspective-2000 w-full max-w-3xl flex justify-center px-4">
        <div
          ref={cardContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative w-full aspect-[16/9] max-w-2xl cursor-pointer preserve-3d transition-transform duration-300 ease-out group"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`,
          }}
          title="Click to flip 3D Builder Pass"
        >
          {/* FRONT SIDE OF 3D PASS */}
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#facc15]/60 bg-[#0c6838] backface-hidden preserve-3d glow-pink">
            
            {/* Base Image Layer */}
            {cardDataUrl ? (
              <img
                src={cardDataUrl}
                alt="Hacker House Goa 2026 Pass"
                className={`w-full h-full object-contain block rounded-2xl transition-transform duration-500 ${
                  isExploded ? 'translate-z-10 scale-95' : ''
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#facc15] font-mono text-xs">
                Generating Pass...
              </div>
            )}
            
            {/* 3D Exploded Floating Logo Badge Layer */}
            {isExploded && (
              <div className="absolute top-6 left-24 preserve-3d exploded-layer-3 pointer-events-none">
                <div className="bg-[#ff007a] text-white px-3.5 py-1 rounded-xl border-2 border-white shadow-2xl font-black text-sm tracking-wider animate-bounce">
                  गोवा 2026 ⚡
                </div>
              </div>
            )}

            {/* 3D Holographic Foil Rainbow Layer */}
            {showHoloFoil && (
              <div
                className={`absolute inset-0 pointer-events-none holo-foil opacity-30 transition-opacity duration-300 group-hover:opacity-60 ${
                  isExploded ? 'exploded-layer-2' : ''
                }`}
                style={{
                  backgroundPosition: `${rotateY * 4}% ${rotateX * 4}%`,
                  transform: isExploded ? 'translateZ(60px)' : 'translateZ(20px)',
                }}
              />
            )}

            {/* Glare Lighting Layer */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-tr from-transparent via-white to-transparent transition-opacity duration-300 group-hover:opacity-40"
              style={{
                transform: `translateZ(40px) rotate(${rotateY}deg)`,
              }}
            />
          </div>

          {/* BACK SIDE OF 3D PASS */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-[#ff007a]/60 bg-gradient-to-br from-[#0c6838] via-[#084d28] to-[#04331a] backface-hidden preserve-3d flex flex-col justify-between"
            style={{ transform: 'rotateY(180deg)' }}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-[#facc15]/30 pb-3">
              <div className="flex items-center space-x-3">
                <HackerHouseGoaLogo className="w-10 h-10" />
                <div>
                  <h3 className="font-orbitron font-bold text-white text-sm sm:text-base">BUILDER ID PASS</h3>
                  <p className="text-[11px] font-mono text-[#facc15]">HACKER HOUSE GOA 2026</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#ff007a]/20 border border-[#ff007a] text-[#ff007a] font-mono text-xs font-bold">
                {serialId}
              </span>
            </div>

            {/* Back Card Details */}
            <div className="grid grid-cols-3 gap-4 my-2 items-center">
              <div className="col-span-2 space-y-2 font-mono text-xs text-emerald-100">
                <p className="text-[#facc15] font-bold">BUILDER ID CARD GENERATOR</p>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  Interactive 3D HTML5 Canvas ID Card Generator for Hacker House Goa 2026.
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-[#ff007a] font-bold pt-1">
                  <Code className="w-3.5 h-3.5" />
                  <span>Developed by T.Sathvik</span>
                </div>
              </div>

              {/* Magnetic Chip */}
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 border border-amber-200 shadow-inner">
                <div className="w-10 h-8 border border-amber-700/60 rounded grid grid-cols-2 gap-1 p-1 bg-amber-600/30">
                  <div className="border border-amber-700/40 rounded"></div>
                  <div className="border border-amber-700/40 rounded"></div>
                  <div className="border border-amber-700/40 rounded"></div>
                  <div className="border border-amber-700/40 rounded"></div>
                </div>
                <span className="text-[9px] font-mono font-bold text-amber-950 mt-1">GOA 2026</span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#facc15]/30 pt-2 flex items-center justify-between text-[11px] font-mono text-[#facc15]">
              <span>HACKER HOUSE GOA 2026</span>
              <span>Developed by T.Sathvik</span>
            </div>
          </div>

        </div>
      </div>

      {/* Hint text */}
      <p className="text-[11px] font-mono text-[#facc15] flex items-center space-x-1">
        <Flame className="w-3.5 h-3.5 text-[#ff007a] animate-pulse" />
        <span>Move mouse to tilt in 3D • Click card to flip • Explode 3D layers above</span>
      </p>

    </div>
  );
}
