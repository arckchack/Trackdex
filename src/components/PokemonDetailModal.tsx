import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, ChevronLeft, ChevronRight, Volume2, VolumeX, Crown, MapPin, ShieldAlert, Zap, Compass, Clock } from 'lucide-react';
import { Pokemon } from '../types';
import {
  TYPE_COLORS,
  GENERATIONS_INFO,
  formatPokedexNumber,
  getPokemonImageUrl,
  isLegendaryPokemon,
  isMythicalPokemon,
} from '../data/pokemonData';
import { EvolutionChainView } from './EvolutionChainView';
import { getPokemonWeaknesses } from '../utils/typeChart';
import { getCobblemonSpawnInfo } from '../utils/cobblemonLocations';

interface PokemonDetailModalProps {
  pokemon: Pokemon | null;
  isCaught: boolean;
  isShinyMode?: boolean;
  onClose: () => void;
  onToggleCaught: (id: number) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  activeCaughtSet: Set<number>;
  onSelectPokemonById: (id: number) => void;
}

export const PokemonDetailModal: React.FC<PokemonDetailModalProps> = ({
  pokemon,
  isCaught,
  isShinyMode = false,
  onClose,
  onToggleCaught,
  onNavigate,
  activeCaughtSet,
  onSelectPokemonById,
}) => {
  const [showShiny, setShowShiny] = useState(isShinyMode);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Cry Audio Volume state (persisted in localStorage, default 0.3 = 30%)
  const [volume, setVolume] = useState<number>(() => {
    try {
      const savedVol = localStorage.getItem('pokemon_cry_volume');
      return savedVol !== null ? parseFloat(savedVol) : 0.3;
    } catch {
      return 0.3;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pokemon_cry_volume', volume.toString());
    } catch {
      // Ignore quota or security errors
    }
  }, [volume]);

  if (!pokemon) return null;

  const genInfo = GENERATIONS_INFO.find((g) => g.gen === pokemon.gen) || GENERATIONS_INFO[0];
  const primaryType = pokemon.types[0];
  const typeStyle = TYPE_COLORS[primaryType] || TYPE_COLORS.Normal;

  const weaknesses = getPokemonWeaknesses(pokemon.types);
  const spawnInfo = getCobblemonSpawnInfo(pokemon.id, pokemon.types);

  const handlePlayCry = () => {
    try {
      setIsPlayingAudio(true);
      const audio = new Audio(
        `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg`
      );
      audio.volume = volume;
      audio.play().catch(() => {
        setIsPlayingAudio(false);
      });
      audio.onended = () => setIsPlayingAudio(false);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#141414] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl text-white">
        
        {/* Background Glow */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${typeStyle.bg}`} />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-[#1a1a1a] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-neutral-400 bg-[#0a0a0a] px-2.5 py-1 rounded-lg border border-neutral-800">
              {formatPokedexNumber(pokemon.id)}
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff3e3e] bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
              {genInfo.region} (Gen {pokemon.gen})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition-all border border-neutral-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="relative z-10 p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Main Pokemon Artwork Display */}
          <div className="relative flex flex-col items-center justify-center bg-[#0a0a0a] rounded-2xl p-6 border border-neutral-800">
            {/* Prev / Next Navigation Arrows */}
            <button
              onClick={() => onNavigate('prev')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all border border-neutral-700 shadow-md"
              title="Anterior Pokémon"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('next')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all border border-neutral-700 shadow-md"
              title="Siguiente Pokémon"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Artwork Image */}
            <img
              src={getPokemonImageUrl(pokemon.id, showShiny)}
              alt={pokemon.name}
              className="w-44 h-44 sm:w-48 sm:h-48 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:scale-105"
            />

            {/* Shiny & Audio Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 w-full justify-center">
              <button
                onClick={() => setShowShiny(!showShiny)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  showShiny
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                <span>{showShiny ? 'Ver Forma Normal' : 'Ver Forma Variocolor'}</span>
              </button>

              {/* Cry Audio Button & Volume Control */}
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl">
                <button
                  onClick={handlePlayCry}
                  className={`text-xs font-bold text-neutral-200 transition-all flex items-center gap-1.5 ${
                    isPlayingAudio ? 'text-emerald-400 animate-pulse' : 'hover:text-white'
                  }`}
                  title="Reproducir grito del Pokémon"
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  <span>Grito</span>
                </button>

                <div className="flex items-center gap-1.5 border-l border-neutral-800 pl-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-16 sm:w-20 accent-emerald-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    title={`Volumen del grito: ${Math.round(volume * 100)}%`}
                  />
                  <span className="text-[10px] font-mono text-neutral-400 w-7 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pokemon Details Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {pokemon.name}
                </h2>
                {(pokemon.isLegendary || isLegendaryPokemon(pokemon.id)) && (
                  <span className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                    <Crown className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Legendario</span>
                  </span>
                )}
                {(pokemon.isMythical || isMythicalPokemon(pokemon.id)) && (
                  <span className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 fill-white" />
                    <span>Mítico</span>
                  </span>
                )}
              </div>

              {/* Catch Toggle Button in Modal */}
              <button
                onClick={() => onToggleCaught(pokemon.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isCaught
                    ? showShiny
                      ? 'bg-amber-400 text-neutral-950 font-black shadow-lg shadow-amber-500/30'
                      : 'bg-[#ff3e3e] text-white font-bold shadow-lg shadow-red-500/30'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                }`}
              >
                {isCaught && (showShiny ? <Sparkles className="w-4 h-4 fill-neutral-950" /> : <Check className="w-4 h-4 stroke-[3]" />)}
                <span>{isCaught ? 'Capturado' : 'Marcar Capturado'}</span>
              </button>
            </div>

            {/* Type Badges */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Tipos:</span>
              <div className="flex gap-1.5">
                {pokemon.types.map((type) => {
                  const st = TYPE_COLORS[type] || TYPE_COLORS.Normal;
                  return (
                    <span
                      key={type}
                      className={`text-xs font-extrabold uppercase tracking-wide px-3 py-1 rounded-lg border ${st.badgeBg} text-white border-white/20`}
                    >
                      {type}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COBBLEMON SPAWN LOCATION SECTION */}
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                  ¿Dónde encontrarlo en Cobblemon?
                </h3>
              </div>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                spawnInfo.rarity.includes('Legendario')
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}>
                Rareza: {spawnInfo.rarity}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 bg-[#121212] p-2.5 rounded-xl border border-neutral-800/80">
                <div className="flex items-center gap-1.5 text-neutral-400 font-bold text-[11px]">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Biomas de Minecraft:</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {spawnInfo.biomes.map((b) => (
                    <span key={b} className="bg-neutral-800 text-neutral-200 px-2 py-0.5 rounded text-[11px] font-medium border border-neutral-700">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1 bg-[#121212] p-2.5 rounded-xl border border-neutral-800/80">
                <div className="flex items-center gap-1.5 text-neutral-400 font-bold text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Momento y Entorno:</span>
                </div>
                <p className="text-neutral-200 font-medium">
                  {spawnInfo.timeOfDay} • {spawnInfo.environment}
                </p>
                {spawnInfo.yLevels && (
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Nivel Y: {spawnInfo.yLevels}
                  </p>
                )}
              </div>
            </div>

            {spawnInfo.notes && (
              <p className="text-[11px] text-neutral-400 italic bg-[#121212] p-2.5 rounded-xl border border-neutral-800/80">
                💡 <strong className="text-neutral-300 font-bold">Consejo Cobblemon:</strong> {spawnInfo.notes}
              </p>
            )}
          </div>

          {/* TYPE WEAKNESSES & RESISTANCES MATRIX */}
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Debilidades y Resistencias de Tipo
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {/* 4x Weaknesses */}
              {weaknesses.weaknesses4x.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase bg-red-600/30 text-red-300 px-2 py-0.5 rounded border border-red-500/50 w-28 flex-shrink-0 text-center">
                    ⚡ Súper Débil (4x)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {weaknesses.weaknesses4x.map((t) => {
                      const st = TYPE_COLORS[t] || TYPE_COLORS.Normal;
                      return (
                        <span key={t} className={`text-[11px] font-bold px-2 py-0.5 rounded border ${st.badgeBg} text-white`}>
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2x Weaknesses */}
              {weaknesses.weaknesses2x.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase bg-amber-600/30 text-amber-300 px-2 py-0.5 rounded border border-amber-500/50 w-28 flex-shrink-0 text-center">
                    🔴 Débil (2x)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {weaknesses.weaknesses2x.map((t) => {
                      const st = TYPE_COLORS[t] || TYPE_COLORS.Normal;
                      return (
                        <span key={t} className={`text-[11px] font-bold px-2 py-0.5 rounded border ${st.badgeBg} text-white`}>
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 0.5x Resistances */}
              {weaknesses.resistances05x.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-600/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/50 w-28 flex-shrink-0 text-center">
                    🟢 Resistente (½x)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {weaknesses.resistances05x.map((t) => {
                      const st = TYPE_COLORS[t] || TYPE_COLORS.Normal;
                      return (
                        <span key={t} className={`text-[11px] font-bold px-2 py-0.5 rounded border ${st.badgeBg} text-white`}>
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 0.25x Resistances */}
              {weaknesses.resistances025x.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase bg-teal-600/30 text-teal-300 px-2 py-0.5 rounded border border-teal-500/50 w-28 flex-shrink-0 text-center">
                    🛡️ Muy Resistente (¼x)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {weaknesses.resistances025x.map((t) => {
                      const st = TYPE_COLORS[t] || TYPE_COLORS.Normal;
                      return (
                        <span key={t} className={`text-[11px] font-bold px-2 py-0.5 rounded border ${st.badgeBg} text-white`}>
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 0x Immunities */}
              {weaknesses.immunities0x.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded border border-purple-500/50 w-28 flex-shrink-0 text-center">
                    🚫 Inmune (0x)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {weaknesses.immunities0x.map((t) => {
                      const st = TYPE_COLORS[t] || TYPE_COLORS.Normal;
                      return (
                        <span key={t} className={`text-[11px] font-bold px-2 py-0.5 rounded border ${st.badgeBg} text-white`}>
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Evolution Chain Section */}
          <EvolutionChainView
            currentPokemonId={pokemon.id}
            isShiny={showShiny}
            caughtSet={activeCaughtSet}
            onSelectPokemonById={onSelectPokemonById}
            onToggleCaughtById={onToggleCaught}
          />

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0a0a0a] border-t border-neutral-800 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-all border border-neutral-700"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

