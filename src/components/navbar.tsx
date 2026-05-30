import { useState, useEffect } from 'react';
import { Radio, ArrowLeft } from 'lucide-react';
import { SensaiLogo } from '@/components/ui/sensai-logo';

export function Navbar({ onLogoClick, showBack, onBackClick }: { onLogoClick?: () => void, showBack?: boolean, onBackClick?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Live timestamp simulation
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[rgba(9,44,92,0.85)] backdrop-blur-[16px] border-b border-white/10 shadow-[0_4px_30px_rgba(9,44,92,0.3)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1450px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        
        {/* Top Left Elements: Logo + Real-time Logs */}
        <div className="flex items-center gap-4 md:gap-6">
          {showBack && (
            <button 
              onClick={onBackClick}
              className="flex items-center justify-center p-2 rounded-full bg-white/5 hover:bg-[#ffcc00]/20 text-white/70 hover:text-[#ffcc00] transition-all border border-white/10 hover:border-[#ffcc00]/50 cursor-pointer"
              title="Return to Previous Page"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          {/* Logo */}
          <div onClick={onLogoClick} className="flex items-center gap-2.5 group cursor-pointer">
            <div className="relative flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <SensaiLogo size={42} className="filter drop-shadow-[0_0_8px_rgba(255,204,0,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(255,204,0,0.75)] transition-all duration-300" />
              {/* Pulsing state ring around the logo */}
              <span className="absolute -inset-1 rounded-full border border-[#ffcc00]/20 animate-ping opacity-50 pointer-events-none scale-125" />
            </div>
            <span className="text-[#ffcc00] font-playpretend font-normal text-lg sm:text-xl tracking-[0.02em] uppercase drop-shadow-[0_4px_12px_rgba(9,44,92,0.5)]">
              SENSAI
            </span>
          </div>

          {/* Decorative vertical separator */}
          <div className="h-5 w-[1px] bg-white/15 block md:hidden" />

          {/* Live Monospace System Log (Addressing "a log at top left") */}
          <div className="flex md:hidden items-center gap-2 font-mono text-[10px] text-white/50 tracking-wider">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">LOG:</span>
            <span className="text-white/60 font-semibold truncate max-w-[120px] sm:max-w-[160px]">
              SYS_ACTIVE // {time || "SYNCING..."}
            </span>
          </div>
        </div>

        {/* Top Right Quick Accessories */}
        <div className="flex items-center gap-4 md:hidden">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#ffcc00]/20 bg-[#ffcc00]/5 font-mono text-[9px] text-[#ffcc00] font-extrabold tracking-widest uppercase shadow-[0_0_12px_rgba(255,204,0,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ACTIVE LAYER
          </div>
        </div>

      </div>
    </header>
  );
}
