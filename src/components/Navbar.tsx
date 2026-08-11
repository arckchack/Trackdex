import React from 'react';
import { Sparkles, Download, Trophy, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { GenFilter, DexMode } from '../types';
import { GENERATIONS_INFO } from '../data/pokemonData';

interface NavbarProps {
  activeGen: GenFilter;
  setActiveGen: (gen: GenFilter) => void;
  dexMode: DexMode;
  setDexMode: (mode: DexMode) => void;
  totalCaught: number;
  totalShinyCaught: number;
  totalPokemon: number;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeGen,
  setActiveGen,
  dexMode,
  setDexMode,
  totalCaught,
  totalShinyCaught,
  totalPokemon,
  onOpenExportModal,
}) => {
  const currentCaught = dexMode === 'shiny' ? totalShinyCaught : totalCaught;
  const currentPercentage = Math.round((currentCaught / totalPokemon) * 100) || 0;

  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-neutral-800 text-neutral-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        
        {/* Top Row: Logo, Mode Selector, Progress & Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Main Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Pokéball Logo */}
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-b from-[#ff3e3e] via-red-600 to-white p-0.5 shadow-md flex items-center justify-center border-2 border-neutral-800 flex-shrink-0">
                <div className="w-full h-1/2 bg-[#ff3e3e] rounded-t-full absolute top-0 left-0" />
                <div className="w-full h-1/2 bg-neutral-100 rounded-b-full absolute bottom-0 left-0" />
                <div className="w-full h-1 bg-neutral-900 absolute top-1/2 -translate-y-1/2 z-10" />
                <div className="w-4 h-4 bg-white rounded-full border-2 border-neutral-900 z-20 shadow-inner flex items-center justify-center">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${dexMode === 'shiny' ? 'bg-amber-400' : 'bg-[#ff3e3e]'}`} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black tracking-wider uppercase text-white font-mono flex items-center gap-1.5">
                    TrackDex
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-500/10 text-[#ff3e3e] border border-red-500/20">
                    Gen 1-9 • 1025 Pokémon
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  {dexMode === 'shiny' ? 'Apartado de Captura Variocolor (Shiny Living Dex)' : 'Control de Captura Nacional Completo'}
                </p>
              </div>
            </div>

            {/* Mobile Actions: Backup & Mode Switch */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setDexMode(dexMode === 'normal' ? 'shiny' : 'normal')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${
                  dexMode === 'shiny'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{dexMode === 'shiny' ? 'Shiny' : 'Normal'}</span>
              </button>
              <button
                onClick={onOpenExportModal}
                className="p-2 rounded-lg text-xs bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700"
                title="Guardar y Cargar"
              >
                <Download className="w-4 h-4 text-[#ff3e3e]" />
              </button>
            </div>
          </div>

          {/* Dex Mode Toggle & Controls */}
          <div className="flex items-center gap-3 justify-between md:justify-end">
            
            {/* Mode Switcher: Pokédex Normal vs Apartado Shiny */}
            <div className="flex items-center bg-[#141414] p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => setDexMode('normal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  dexMode === 'normal'
                    ? 'bg-[#ff3e3e] text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pokédex Normal</span>
              </button>

              <button
                onClick={() => setDexMode('shiny')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  dexMode === 'shiny'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-neutral-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-neutral-400 hover:text-amber-300'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${dexMode === 'shiny' ? 'text-neutral-950 fill-neutral-950' : 'text-amber-400'}`} />
                <span>Apartado Shiny ✨</span>
              </button>
            </div>

            {/* Save / Load Modal Trigger Button */}
            <button
              onClick={onOpenExportModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#141414] hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#ff3e3e]" />
              <span>Guardar / Cargar</span>
            </button>

            {/* Total Progress Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-[#141414] border border-neutral-800 px-3 py-1.5 rounded-xl">
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {dexMode === 'shiny' ? 'Shiny Dex Total' : 'Progreso Global'}
                </div>
                <div className="text-xs font-black text-white">
                  {currentCaught} / {totalPokemon} <span className={dexMode === 'shiny' ? 'text-amber-400' : 'text-[#ff3e3e]'}>({currentPercentage}%)</span>
                </div>
              </div>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border ${
                dexMode === 'shiny' 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                  : 'bg-red-500/10 text-[#ff3e3e] border-red-500/30'
              }`}>
                {currentPercentage}%
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Scrollable Generation Tabs Bar (Gen 1 to Gen 9) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-[#141414] p-1.5 rounded-xl border border-neutral-800/80">
          <button
            onClick={() => setActiveGen('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeGen === 'all'
                ? dexMode === 'shiny'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 shadow-md font-black'
                  : 'bg-[#ff3e3e] text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
            }`}
          >
            <Trophy className={`w-3.5 h-3.5 ${dexMode === 'shiny' ? 'text-neutral-950' : 'text-amber-300'}`} />
            <span>Todas (1025)</span>
          </button>

          {GENERATIONS_INFO.map((g) => {
            const isActive = activeGen === g.gen;
            return (
              <button
                key={g.gen}
                onClick={() => setActiveGen(g.gen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                  isActive
                    ? dexMode === 'shiny'
                      ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
                      : `bg-gradient-to-r ${g.color} text-white shadow-md`
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                }`}
              >
                <span>Gen {g.gen}</span>
                <span className="text-[10px] opacity-75 font-normal">({g.region})</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
