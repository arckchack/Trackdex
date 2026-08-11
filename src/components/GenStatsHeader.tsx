import React from 'react';
import { Trophy, CheckCircle, Circle, RefreshCw, CheckCheck, XCircle, Sparkles } from 'lucide-react';
import { GenFilter, DexMode } from '../types';
import { GENERATIONS_INFO } from '../data/pokemonData';

interface GenStatsHeaderProps {
  activeGen: GenFilter;
  dexMode: DexMode;
  caughtCount: number;
  totalCount: number;
  filteredCount: number;
  onMarkVisibleCaught: () => void;
  onUnmarkVisibleCaught: () => void;
  onResetActiveGen: () => void;
}

export const GenStatsHeader: React.FC<GenStatsHeaderProps> = ({
  activeGen,
  dexMode,
  caughtCount,
  totalCount,
  filteredCount,
  onMarkVisibleCaught,
  onUnmarkVisibleCaught,
  onResetActiveGen,
}) => {
  const percentage = Math.round((caughtCount / totalCount) * 100) || 0;
  const remainingCount = totalCount - caughtCount;

  const currentGenInfo = activeGen === 'all'
    ? { name: 'Nacional Completa', fullTitle: 'Todas las Generaciones (I - IX)', region: 'Kanto a Paldea', rangeStr: '#001 - #1025', color: 'from-neutral-900 via-neutral-950 to-neutral-900' }
    : GENERATIONS_INFO.find((g) => g.gen === activeGen) || GENERATIONS_INFO[0];

  const isShiny = dexMode === 'shiny';

  return (
    <div className={`border rounded-2xl p-4 sm:p-6 mb-6 shadow-2xl relative overflow-hidden backdrop-blur-md transition-all ${
      isShiny
        ? 'bg-gradient-to-r from-[#141414] via-[#1c1917] to-[#141414] border-amber-500/30'
        : 'bg-[#141414] border-neutral-800'
    }`}>
      {/* Background Decorative Glow */}
      <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
        isShiny ? 'bg-amber-500/15' : 'bg-[#ff3e3e]/10'
      }`} />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Information Column */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              isShiny
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-red-500/10 text-[#ff3e3e] border-red-500/20'
            }`}>
              {currentGenInfo.rangeStr}
            </span>
            <span className="text-xs text-neutral-400 font-medium">
              Región de {currentGenInfo.region}
            </span>
            {isShiny && (
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" /> Variocolor
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{currentGenInfo.name}</span>
            {percentage === 100 && (
              <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold border animate-bounce ${
                isShiny
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              }`}>
                <Trophy className="w-3.5 h-3.5" /> ¡Living Dex 100%!
              </span>
            )}
          </h2>

          {/* Detailed Count Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-semibold">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
              isShiny
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-red-500/10 text-[#ff3e3e] border-red-500/20'
            }`}>
              <CheckCircle className="w-4 h-4" />
              <span>{caughtCount} {isShiny ? 'Shiny Obtenidos' : 'Capturados'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-900 text-neutral-400 border border-neutral-800 px-3 py-1 rounded-lg">
              <Circle className="w-4 h-4 text-neutral-500" />
              <span>{remainingCount} Faltantes</span>
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-900 text-neutral-300 border border-neutral-800 px-3 py-1 rounded-lg">
              <span>Total: {totalCount}</span>
            </div>
          </div>
        </div>

        {/* Progress Metric Section */}
        <div className="flex-1 max-w-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-neutral-400">Progreso {isShiny ? 'Variocolor' : 'Colección'}</span>
            <span className={isShiny ? 'text-amber-400 font-extrabold' : 'text-[#ff3e3e] font-extrabold'}>
              {percentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#0a0a0a] h-3.5 rounded-full overflow-hidden p-0.5 border border-neutral-800 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 relative ${
                isShiny
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-amber-500/30'
                  : 'bg-gradient-to-r from-red-600 via-[#ff3e3e] to-rose-400 shadow-red-500/30'
              }`}
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute top-0 bottom-0 right-0 w-2 bg-white/40 rounded-full animate-pulse" />
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 text-right">
            {caughtCount} de {totalCount} registrados
          </p>
        </div>

      </div>

      {/* Quick Actions Toolbar */}
      <div className="mt-5 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-neutral-400 font-medium">
          {filteredCount < totalCount ? (
            <span>Mostrando <strong className="text-white">{filteredCount}</strong> Pokémon filtrados</span>
          ) : (
            <span>Mostrando todos los <strong className="text-white">{totalCount}</strong> Pokémon</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onMarkVisibleCaught}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-all flex items-center gap-1.5 ${
              isShiny
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                : 'bg-red-500/15 hover:bg-red-500/25 text-[#ff3e3e] border-red-500/30'
            }`}
            title="Marcar Pokémon filtrados como capturados"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Marcar Filtrados ({filteredCount})</span>
          </button>

          <button
            onClick={onUnmarkVisibleCaught}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 font-semibold transition-all flex items-center gap-1.5"
            title="Desmarcar Pokémon filtrados"
          >
            <XCircle className="w-3.5 h-3.5 text-neutral-400" />
            <span>Desmarcar Filtrados</span>
          </button>

          <button
            onClick={onResetActiveGen}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 font-semibold transition-all flex items-center gap-1"
            title="Reiniciar captura en esta generación"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
