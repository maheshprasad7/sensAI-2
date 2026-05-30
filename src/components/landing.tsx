import { motion } from 'framer-motion';
import { ArrowRight, Brain, Cpu, Shield, Zap, Globe, Activity } from 'lucide-react';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { SensaiLogo } from '@/components/ui/sensai-logo';

export function HeroSection() {
  const entranceDuration = 1.6;
  const entranceEase = [0.16, 1, 0.3, 1];

  return (
    <section className="relative h-screen sticky top-0 flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-b from-[#207ae2] to-[#185fb8] z-10">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#ffcc00]/20 to-transparent blur-[140px] rounded-full pointer-events-none z-0" />
      
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Synchronized scale and fade-in container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: entranceDuration, ease: entranceEase }}
        className="relative w-full max-w-[1450px] mx-auto px-6 flex flex-col items-center justify-center h-[550px] md:h-[700px] lg:h-[850px] z-10"
      >
        {/* Floating parent to sync floating loop animations of both title and robo model perfectly */}
        <motion.div
          animate={{
            y: [0, -18, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full h-full flex flex-col sm:flex-row items-center justify-center"
        >
          {/* Background Title - SENSAI styled with wide Play Pretend visual feel and curved arch effect */}
          <h1 className="absolute select-none font-playpretend font-normal text-[14vw] sm:text-[12vw] leading-none text-center text-[#ffcc00] tracking-[0.03em] z-0 uppercase pointer-events-none whitespace-nowrap -translate-y-[56vw] sm:-translate-y-[24vw] md:-translate-y-[20vw] flex justify-center items-center">
            {"SENSAI".split("").map((char, index) => {
              const angles = [-15, -9, -3, 3, 9, 15];
              const dy = [1.8, 0.6, 0, 0, 0.6, 1.8]; // in vw
              const dx = [-0.4, -0.15, 0, 0, 0.15, 0.4]; // in vw
              return (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    transform: `rotate(${angles[index]}deg) translateY(${dy[index]}vw) translateX(${dx[index]}vw)`,
                  }}
                  className="drop-shadow-[0_12px_32px_rgba(9,44,92,0.98)] mx-[2vw] sm:mx-[1.5vw]"
                >
                  {char}
                </span>
              );
            })}
          </h1>
          
          {/* Foreground Robo Element */}
          <div className="relative sm:absolute sm:inset-0 w-full h-[400px] sm:h-full flex items-center justify-center z-10 sm:[mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_80%)] pointer-events-none">
            <div className="w-full h-full max-w-full sm:max-w-5xl flex-shrink-0 pointer-events-auto">
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" 
                className="w-full h-full" 
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    { 
      icon: Globe, 
      title: "Interactive Career Roadmaps", 
      desc: "Chart personalized milestone roadmaps mapped cleanly to academic credentials and target industry achievements." 
    },
    { 
      icon: Activity, 
      title: "Skill Decay Tracking", 
      desc: "Monitor your technical proficiency and retention levels over time. Retention decays passively when idle to promote proactive memory test evaluations." 
    },
    { 
      icon: Zap, 
      title: "Smart Matchmaker Placement", 
      desc: "Instantly align your active skill matrix with active industry placements, matching you with the right apprenticeships and internships." 
    },
  ];

  // Highly-crafted stagger settings for beautiful card reveal sequence
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1] // Custom ultra-smooth cubic bezier curve
      } 
    },
  };

  return (
    <section className="relative min-h-screen py-24 sm:py-32 flex items-center justify-center sticky top-0 bg-gradient-to-b from-[#1553a1] to-[#12519e] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] shadow-[-20px_0_50px_rgba(9,44,92,0.55)] z-20 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 will-change-[transform,opacity]"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.08] backdrop-blur-md border border-white/20 hover:bg-[#ffcc00]/10 hover:border-[#ffcc00]/45 transition-all duration-300 group cursor-default relative overflow-hidden will-change-transform"
            >
              {/* Subtle top border illumination glow on hover */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-[#ffcc00]/60 transition-all duration-500" />
              
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-105 group-hover:border-[#ffcc00]/55 group-hover:bg-white/15 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-[#ffcc00] group-hover:text-[#ffcc00] transition-colors" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#ffcc00] mb-2 md:mb-3 group-hover:text-[#ffcc00] transition-colors drop-shadow-[0_1px_2px_rgba(18,81,158,0.4)]">{feature.title}</h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed font-semibold">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function ShowcaseSection() {
  const terminalVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.1
      } 
    }
  };

  return (
    <section className="relative min-h-screen py-24 sm:py-32 flex items-center justify-center sticky top-0 bg-gradient-to-b from-[#114b93] to-[#0d3b76] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] shadow-[-20px_0_50px_rgba(9,44,92,0.7)] z-30 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full flex flex-col items-center">
        <motion.div 
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative rounded-2xl sm:rounded-[2.5rem] border border-white/20 bg-white/[0.05] backdrop-blur-md overflow-hidden h-[450px] sm:h-[550px] md:h-[600px] flex items-center justify-center shadow-2xl will-change-[transform,opacity] w-full"
        >
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#ffcc00" />
          
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          {/* Mock UI Card */}
          <div className="relative z-10 p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/30 bg-[#12519e]/95 backdrop-blur-xl max-w-2xl w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/20 pb-3 md:pb-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5 flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-[10px] sm:text-xs text-white/80 font-mono ml-1 sm:ml-2 font-bold truncate max-w-[150px] xs:max-w-none">nexus-terminal ~ career-copilot</div>
              </div>
              <div className="text-[10px] sm:text-xs font-bold font-mono text-[#ffcc00] bg-[#ffcc00]/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-[0_0_8px_rgba(255,204,0,0.3)] flex-shrink-0">ONLINE</div>
            </div>
            
            <div className="font-mono text-xs sm:text-sm text-yellow-50/90 space-y-2.5 md:space-y-3 font-semibold">
              <p className="flex items-start gap-2"><span className="text-white/60 mt-0.5">→</span> <span className="flex-1">Analyzing resume and achievements...</span></p>
              <p className="flex items-start gap-2 text-[#ffcc00]"><span className="text-white mt-0.5">✓</span> <span className="flex-1">AI-powered skill extraction complete.</span></p>
              <p className="flex items-start gap-2"><span className="text-white/60 mt-0.5">→</span> <span className="flex-1">Linking repositories & academic transcripts...</span></p>
              <p className="flex items-start gap-2 text-[#ffcc00]"><span className="text-white mt-0.5">✓</span> <span className="flex-1">Interactive skill graph & roadmap generated.</span></p>
              <p className="flex items-start gap-2"><span className="text-white/60 mt-0.5">→</span> <span className="flex-1">Evaluating portfolio readiness scores...</span></p>
              <p className="text-[#ffcc00] font-extrabold mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/20 text-sm sm:text-base">&gt; Professional profile synchronized.</p>
              <span className="inline-block w-2 h-4 bg-[#ffcc00] animate-pulse mt-1 md:mt-2 shadow-[0_0_8px_rgba(255,204,0,0.8)]" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function StatsSection() {
  const stats = [
    { value: "98", suffix: "%", label: "Skills Match Accuracy" },
    { value: "10", suffix: "M+", label: "Achievements Mapped" },
    { value: "<2", suffix: "s", label: "AI Map Generation" },
    { value: "150", suffix: "+", label: "Institutions Connected" },
  ];

  const parentVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <section className="relative py-28 bg-gradient-to-b from-[#0c3161] to-[#092c5c] sticky top-0 rounded-t-[2.5rem] sm:rounded-t-[3.5rem] shadow-[-20px_0_50px_rgba(9,44,92,0.85)] z-40 overflow-hidden flex items-center justify-center">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div 
        variants={parentVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10 w-full"
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={statVariants}>
            <div className="text-4xl md:text-5xl font-black tracking-tighter text-[#ffcc00] mb-3 drop-shadow-[0_2px_4px_rgba(18,81,158,0.3)]">
              {stat.value}<span className="text-[#ffeb60] font-extrabold">{stat.suffix}</span>
            </div>
            <div className="text-xs text-white/90 font-extrabold uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export function CtaSection({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <section className="relative min-h-screen py-24 sm:py-32 flex items-center justify-center sticky top-0 bg-gradient-to-b from-[#092c5c] to-[#041226] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] shadow-[-20px_0_50px_rgba(9,44,92,0.98)] z-50 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-br from-[#ffcc00]/25 to-transparent blur-[150px] rounded-full max-w-4xl mx-auto pointer-events-none" 
      />
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center w-full">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-[#ffcc00] drop-shadow-[0_3px_6px_rgba(18,81,158,0.4)]"
        >
          Launch your intelligent career.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-yellow-50/95 mb-10 max-w-2xl mx-auto font-semibold drop-shadow-[0_1px_2px_rgba(18,81,158,0.4)]"
        >
          Built for the gap between what you know and what you can prove.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center"
        >
          <button 
            onClick={onGetStarted}
            className="px-10 py-4.5 rounded-full bg-gradient-to-r from-[#ffcc00] to-[#ffd900] text-[#092c5c] font-black hover:from-[#ffd900] hover:to-[#ffe53b] transition-all duration-300 hover:scale-[1.03] shadow-[0_0_20px_rgba(255,204,0,0.35)] hover:shadow-[0_0_30px_rgba(255,204,0,0.55)] cursor-pointer text-base uppercase tracking-wider"
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative z-50 py-12 border-t border-white/10 bg-[#041226]/95 backdrop-blur-md overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[1400px] mx-auto px-6 flex flex-col items-center justify-center gap-6 mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <SensaiLogo size={42} className="filter drop-shadow-[0_0_8px_rgba(255,204,0,0.3)]" />
          </div>
          <span className="text-[#ffcc00] font-black text-xl tracking-tight">SENSAI</span>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-[1400px] mx-auto px-6 pt-6 border-t border-white/10 flex flex-col items-center justify-center text-sm text-white/70"
      >
        <div className="font-semibold text-center">© 2026 SENSAI. All rights reserved.</div>
      </motion.div>
    </footer>
  );
}

