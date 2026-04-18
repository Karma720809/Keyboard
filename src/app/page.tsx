"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight, Shield, Zap, Settings, Command } from "lucide-react";

import HeroCanvasVideo from "@/components/HeroCanvasVideo";

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-accent selection:text-white">
      {/* Sticky Header / CTA */}
      <header className="fixed top-0 w-full z-50 apple-nav py-3 px-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-2 text-white/90 hover:text-white transition-colors cursor-pointer">
            <Command className="w-5 h-5" />
            <span className="font-semibold text-lg tracking-tight">Aura Pro</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/community" className="hidden sm:block text-[13px] font-medium text-white/70 hover:text-white transition-colors">
              Community
            </Link>
            <button className="bg-[#f5f5f7] text-black px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-white transition-colors">
              Pre-order
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroCanvasVideo totalFrames={150} imagePathPrefix="/hero-sequence/frame_" imagePathSuffix=".webp" />


      {/* Configurator & Sound Simulator Placeholder */}
      <section className="py-32 px-6 relative z-20 bg-background" id="configurator">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-16 text-center text-foreground">
            Craft Your Sound.
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Real-time Configurator UI */}
            <div className="apple-panel p-10 rounded-[32px] transition-colors">
              <h3 className="text-2xl font-semibold mb-8 flex items-center gap-2 tracking-tight text-foreground">
                <Settings className="w-6 h-6"/> Customize Layout
              </h3>
              <div className="space-y-8">
                <div>
                  <label className="text-sm text-muted font-medium mb-3 block">Switch Type</label>
                  <div className="flex gap-3 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                    <button className="flex-1 py-3 px-4 rounded-xl bg-[#333336] text-white shadow-sm text-sm font-medium transition-all">Linear</button>
                    <button className="flex-1 py-3 px-4 rounded-xl text-muted hover:text-white text-sm font-medium transition-all">Tactile</button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted font-medium mb-3 block">Plate Material</label>
                  <div className="flex gap-3 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                    <button className="flex-1 py-3 px-4 rounded-xl text-muted hover:text-white text-sm font-medium transition-all">Aluminum</button>
                    <button className="flex-1 py-3 px-4 rounded-xl bg-[#333336] text-white shadow-sm text-sm font-medium transition-all">Polycarbonate</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sound Simulator UI */}
            <div className="apple-panel p-10 rounded-[32px] flex flex-col items-center justify-center text-center transition-colors">
              <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center mb-8 hover:bg-black transition-colors cursor-pointer active:scale-95 group">
                <Zap className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 tracking-tight text-foreground">Hear The Thock</h3>
              <p className="text-muted mb-8 text-base leading-relaxed max-w-[280px]">
                48kHz / 24-bit lossless audio simulation with randomized pitch for true realism.
              </p>
              <button className="text-[15px] flex items-center gap-1 text-accent font-medium hover:underline underline-offset-4 transition-all">
                Play Sample <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & B2B Ecosystem Section */}
      <section className="py-32 px-6 relative z-20 bg-background border-t border-[#333336]/40">
        <div className="max-w-5xl mx-auto">
          {/* Social Proof / Brands */}
          <div className="flex flex-col items-center justify-center mb-32">
            <p className="text-[11px] font-bold tracking-[0.25em] text-muted uppercase mb-10">Trusted by Professionals</p>
            <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="text-xl font-black italic text-foreground">WIRED</div>
               <div className="text-xl font-bold tracking-tighter text-foreground">THE VERGE</div>
               <div className="text-xl font-bold text-foreground">TechCrunch</div>
            </div>
          </div>

          {/* Ecosystem / Cross-Selling & B2B */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="apple-panel p-10 md:p-12 rounded-[32px] flex flex-col items-start text-left">
              <Shield className="w-10 h-10 text-foreground mb-8" />
              <h4 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-foreground">Enterprise Ready.</h4>
              <p className="text-muted mb-10 max-w-sm text-[15px] leading-relaxed">
                Empower your workforce with our custom workspace solutions. 
                Experience a boost in daily productivity with ergonomic designs.
              </p>
              <button className="mt-auto text-accent text-[17px] font-medium flex items-center gap-1 hover:underline underline-offset-4">
                Contact Sales <ChevronRight className="w-4 h-4"/>
              </button>
            </div>

            <div className="apple-panel p-10 md:p-12 rounded-[32px] flex flex-col justify-between">
              <div>
                <h4 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-foreground">The Ecosystem.</h4>
                <p className="text-muted mb-10 text-[15px] leading-relaxed max-w-sm">
                  Complete your Deskterior with premium wrist rests, coiled aviator cables, and seamless lighting integration.
                </p>
              </div>
              <div className="flex gap-4 mt-auto">
               <div className="w-16 h-16 rounded-[20px] bg-black/40 border border-white/5" />
               <div className="w-16 h-16 rounded-[20px] bg-black/40 border border-white/5" />
               <div className="w-16 h-16 rounded-[20px] bg-black/40 border border-white/5 flex items-center justify-center text-[13px] text-muted hover:text-foreground cursor-pointer transition-colors font-medium">More</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Very simple footer to cap it off */}
      <footer className="py-8 px-6 bg-background border-t border-[#333336]/40 text-center text-xs text-muted">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>Copyright © 2026 Aura Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Use</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
