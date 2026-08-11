import React from 'react';
import { Check, Sparkles, GitCommit, Crown } from 'lucide-react';
import { Pokemon } from '../types';
import {
  TYPE_COLORS,
  formatPokedexNumber,
  getPokemonSpriteUrl,
  isLegendaryPokemon,
  isMythicalPokemon,
} from '../data/pokemonData';
import pokemonEvolutionsData from '../data/pokemonEvolutions.json';

interface PokemonListItemProps {
  pokemon: Pokemon;
  isCaught: boolean;
  isShiny: boolean;
  onToggleCaught: (id: number) => void;
  onSelectPokemon: (pokemon: Pokemon) => void;
}

export const PokemonListItem: React.FC<PokemonListItemProps> = ({
  pokemon,
  isCaught,
  isShiny,
  onToggleCaught,
  onSelectPokemon,
}) => {
  const spriteUrl = getPokemonSpriteUrl(pokemon.id, isShiny);

  // Evolution Info
  const evoData = (pokemonEvolutionsData as any)[pokemon.id.toString()];
  const evolvesTo = evoData?.chain?.filter((m: any) => m.evolvesFromId === pokemon.id);

  const isLeg = pokemon.isLegendary || isLegendaryPokemon(pokemon.id);
  const isMyth = pokemon.isMythical || isMythicalPokemon(pokemon.id);

  return (
    <div
      onClick={() => onSelectPokemon(pokemon)}
      className={`group flex items-center justify-between p-2.5 sm:px-4 rounded-xl border transition-all duration-150 cursor-pointer ${
        isCaught
          ? isShiny
            ? 'bg-[#1c1917] border-amber-500/40 hover:border-amber-400'
            : 'bg-[#1a1414] border-red-500/40 hover:border-[#ff3e3e]'
          : isLeg
          ? 'bg-[#1a1508] border-amber-500/30 hover:border-amber-400'
          : isMyth
          ? 'bg-[#180f1a] border-purple-500/30 hover:border-purple-400'
          : 'bg-[#141414] hover:bg-[#1a1a1a] border-neutral-800'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Toggle Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCaught(pokemon.id);
          }}
          className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center transition-all ${
            isCaught
              ? isShiny
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs'
                : 'bg-[#ff3e3e] text-white font-bold shadow-xs'
              : 'border border-neutral-700 bg-neutral-900 hover:border-neutral-500 text-neutral-500'
          }`}
        >
          {isCaught && (
            isShiny ? <Sparkles className="w-3.5 h-3.5 fill-neutral-950" /> : <Check className="w-3.5 h-3.5 stroke-[3]" />
          )}
        </button>

        {/* Sprite */}
        <img
          src={spriteUrl}
          alt={pokemon.name}
          className={`w-10 h-10 object-contain flex-shrink-0 transition-all ${
            isCaught ? 'opacity-100 scale-100' : 'opacity-40 grayscale group-hover:opacity-80 group-hover:grayscale-0'
          }`}
        />

        {/* Pokedex # & Name & Evolution tag */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-neutral-400">
              {formatPokedexNumber(pokemon.id)}
            </span>
            <span className={`text-sm font-bold truncate ${isCaught ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>
              {pokemon.name}
            </span>
            {isShiny && <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}

            {isLeg && (
              <span className="text-[9px] font-black uppercase bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 px-1.5 py-0.5 rounded inline-flex items-center gap-1 font-mono">
                <Crown className="w-2.5 h-2.5 stroke-[2.5]" />
                <span>Legendario</span>
              </span>
            )}

            {isMyth && (
              <span className="text-[9px] font-black uppercase bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-1.5 py-0.5 rounded inline-flex items-center gap-1 font-mono">
                <Sparkles className="w-2.5 h-2.5 fill-white" />
                <span>Mítico</span>
              </span>
            )}

            {evolvesTo && evolvesTo.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded">
                <GitCommit className="w-2.5 h-2.5 text-[#ff3e3e]" />
                <span>
                  {evolvesTo.length === 1
                    ? `${evolvesTo[0].method || 'Evolución'}`
                    : `${evolvesTo.length} evoluciones`}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Types */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {pokemon.types.map((t) => {
          const st = TYPE_COLORS[t] || TYPE_COLORS.Normal;
          return (
            <span
              key={t}
              className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${st.badgeBg} text-white border-white/20`}
            >
              {t}
            </span>
          );
        })}
      </div>
    </div>
  );
};

