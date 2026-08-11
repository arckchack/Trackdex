import React, { useState } from 'react';
import { Check, Sparkles, ImageOff, GitCommit, Crown, ShieldAlert } from 'lucide-react';
import { Pokemon } from '../types';
import {
  TYPE_COLORS,
  formatPokedexNumber,
  getPokemonImageUrl,
  getPokemonSpriteUrl,
  isLegendaryPokemon,
  isMythicalPokemon,
} from '../data/pokemonData';
import pokemonEvolutionsData from '../data/pokemonEvolutions.json';

interface PokemonCardProps {
  pokemon: Pokemon;
  isCaught: boolean;
  isShiny: boolean;
  onToggleCaught: (id: number) => void;
  onSelectPokemon: (pokemon: Pokemon) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isCaught,
  isShiny,
  onToggleCaught,
  onSelectPokemon,
}) => {
  const [imgError, setImgError] = useState(false);
  const [useFallbackSprite, setUseFallbackSprite] = useState(false);

  const primaryType = pokemon.types[0];
  const typeStyle = TYPE_COLORS[primaryType] || TYPE_COLORS.Normal;

  const handleCatchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCaught(pokemon.id);
  };

  const handleImageError = () => {
    if (!useFallbackSprite) {
      setUseFallbackSprite(true);
    } else {
      setImgError(true);
    }
  };

  const currentImgSrc = useFallbackSprite
    ? getPokemonSpriteUrl(pokemon.id, isShiny)
    : getPokemonImageUrl(pokemon.id, isShiny);

  // Evolution Info
  const evoData = (pokemonEvolutionsData as any)[pokemon.id.toString()];
  const evolvesTo = evoData?.chain?.filter((m: any) => m.evolvesFromId === pokemon.id);

  // Rarity check
  const isLeg = pokemon.isLegendary || isLegendaryPokemon(pokemon.id);
  const isMyth = pokemon.isMythical || isMythicalPokemon(pokemon.id);

  return (
    <div
      onClick={() => onSelectPokemon(pokemon)}
      className={`group relative rounded-2xl p-3.5 transition-all duration-300 cursor-pointer border flex flex-col justify-between overflow-hidden ${
        isCaught
          ? isShiny
            ? 'bg-gradient-to-b from-[#1c1917] via-[#171412] to-[#0d0d0d] border-amber-500/50 shadow-lg shadow-amber-500/10 hover:border-amber-400'
            : 'bg-gradient-to-b from-[#1a1414] via-[#141010] to-[#0a0a0a] border-red-500/50 shadow-lg shadow-red-500/10 hover:border-[#ff3e3e]'
          : isLeg
          ? 'bg-gradient-to-b from-[#1a1508] to-[#0f0d06] border-amber-500/40 hover:border-amber-400 shadow-md shadow-amber-500/5'
          : isMyth
          ? 'bg-gradient-to-b from-[#180f1a] to-[#0d070f] border-purple-500/40 hover:border-purple-400 shadow-md shadow-purple-500/5'
          : 'bg-[#141414] hover:bg-[#1a1a1a] border-neutral-800/90 hover:border-neutral-700 shadow-sm'
      }`}
    >
      {/* Type Ambient Glow */}
      <div
        className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-opacity duration-300 ${
          isCaught ? 'opacity-30' : 'opacity-10 group-hover:opacity-20'
        } ${typeStyle.bg}`}
      />

      {/* Top Bar: Pokedex ID, Rarity Badge & Catch Button */}
      <div className="flex items-center justify-between z-10 mb-1.5 gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono font-bold text-neutral-400 bg-[#0a0a0a] border border-neutral-800 px-2 py-0.5 rounded-md shadow-inner">
            {formatPokedexNumber(pokemon.id)}
          </span>

          {isLeg && (
            <span className="text-[9px] font-black uppercase bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs font-mono">
              <Crown className="w-3 h-3 stroke-[2.5]" />
              <span className="hidden sm:inline">Legendario</span>
            </span>
          )}

          {isMyth && (
            <span className="text-[9px] font-black uppercase bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs font-mono">
              <Sparkles className="w-3 h-3 fill-white" />
              <span className="hidden sm:inline">Mítico</span>
            </span>
          )}
        </div>

        {/* Catch Toggle Button */}
        <button
          onClick={handleCatchClick}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 z-20 ${
            isCaught
              ? isShiny
                ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/40 scale-105'
                : 'bg-[#ff3e3e] text-white shadow-md shadow-red-500/40 scale-105'
              : 'bg-neutral-800/90 text-neutral-400 border border-neutral-700 hover:border-neutral-500 hover:text-white hover:scale-110'
          }`}
          title={isCaught ? 'Marcar como pendiente' : 'Marcar como capturado'}
        >
          {isCaught ? (
            isShiny ? <Sparkles className="w-4 h-4 fill-neutral-950" /> : <Check className="w-4 h-4 stroke-[3]" />
          ) : (
            <div className="w-3 h-3 rounded-full border-2 border-neutral-500 group-hover:border-neutral-300 transition-colors" />
          )}
        </button>
      </div>

      {/* Center Image Container */}
      <div className="relative my-1 py-1 flex items-center justify-center min-h-[100px]">
        {!imgError ? (
          <img
            src={currentImgSrc}
            alt={pokemon.name}
            onError={handleImageError}
            loading="lazy"
            className={`w-24 h-24 sm:w-26 sm:h-26 object-contain transition-all duration-300 filter ${
              isCaught
                ? isShiny
                  ? 'drop-shadow-[0_8px_16px_rgba(245,158,11,0.35)] scale-100'
                  : 'drop-shadow-[0_8px_16px_rgba(255,62,62,0.3)] scale-100'
                : 'opacity-40 grayscale group-hover:opacity-80 group-hover:grayscale-0 group-hover:scale-105'
            }`}
          />
        ) : (
          <div className="w-24 h-24 flex flex-col items-center justify-center text-neutral-600">
            <ImageOff className="w-7 h-7 mb-1" />
            <span className="text-[10px]">Sin imagen</span>
          </div>
        )}

        {isShiny && (
          <div className="absolute top-0 right-1 bg-amber-500/20 text-amber-300 p-1 rounded-full border border-amber-500/40 shadow-xs">
            <Sparkles className="w-3 h-3 fill-amber-300/40 text-amber-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* Bottom Row: Name, Types & Evolution Tag */}
      <div className="z-10 mt-1 space-y-1.5">
        <h3 className={`text-sm font-bold tracking-tight truncate transition-colors ${
          isCaught ? 'text-white' : 'text-neutral-300 group-hover:text-white'
        }`}>
          {pokemon.name}
        </h3>

        {/* Type Badges */}
        <div className="flex flex-wrap items-center gap-1">
          {pokemon.types.map((type) => {
            const st = TYPE_COLORS[type] || TYPE_COLORS.Normal;
            return (
              <span
                key={type}
                className={`text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-md border ${st.badgeBg} text-white border-white/20`}
              >
                {type}
              </span>
            );
          })}
        </div>

        {/* Evolution Preview Badge */}
        {evolvesTo && evolvesTo.length > 0 && (
          <div className="pt-1">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-neutral-400 bg-neutral-900/90 border border-neutral-800 px-1.5 py-0.5 rounded-md truncate max-w-full">
              <GitCommit className="w-3 h-3 text-[#ff3e3e] flex-shrink-0" />
              <span className="truncate">
                {evolvesTo.length === 1
                  ? `${evolvesTo[0].method || 'Evolución'}`
                  : `${evolvesTo.length} evoluciones`}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
