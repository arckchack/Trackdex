import React from 'react';
import { ArrowRight, Check, Sparkles, GitCommit, ChevronRight, Crown } from 'lucide-react';
import pokemonEvolutionsData from '../data/pokemonEvolutions.json';
import { EvolutionChainData, EvolutionMember } from '../types';
import {
  formatPokedexNumber,
  getPokemonSpriteUrl,
  isLegendaryPokemon,
  isMythicalPokemon,
} from '../data/pokemonData';

interface EvolutionChainViewProps {
  currentPokemonId: number;
  isShiny: boolean;
  caughtSet: Set<number>;
  onSelectPokemonById: (id: number) => void;
  onToggleCaughtById: (id: number) => void;
}

const evolutionsDict = pokemonEvolutionsData as Record<string, EvolutionChainData>;

export const EvolutionChainView: React.FC<EvolutionChainViewProps> = ({
  currentPokemonId,
  isShiny,
  caughtSet,
  onSelectPokemonById,
  onToggleCaughtById,
}) => {
  const evoData = evolutionsDict[currentPokemonId.toString()];

  if (!evoData || !evoData.chain || evoData.chain.length <= 1) {
    return (
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-neutral-400">
          <GitCommit className="w-4 h-4 text-neutral-500" />
          <span>Este Pokémon no posee evoluciones registradas.</span>
        </div>
      </div>
    );
  }

  const { chain } = evoData;

  // Group members into stages: Root (no evolvesFromId), Stage 1 (evolves from Root), Stage 2 (evolves from Stage 1)
  const rootMembers = chain.filter((m) => !m.evolvesFromId);
  const rootIds = new Set(rootMembers.map((m) => m.id));

  const stage1Members = chain.filter((m) => m.evolvesFromId && rootIds.has(m.evolvesFromId));
  const stage1Ids = new Set(stage1Members.map((m) => m.id));

  const stage2Members = chain.filter((m) => m.evolvesFromId && stage1Ids.has(m.evolvesFromId));

  // Determine if it's a branching evolution (like Eevee or Tyrogue)
  const isBranching = stage1Members.length > 3;

  return (
    <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <GitCommit className={`w-4 h-4 ${isShiny ? 'text-amber-400' : 'text-[#ff3e3e]'}`} />
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-200">
            Línea Evolutiva y Métodos
          </h3>
        </div>
        <span className="text-[10px] text-neutral-500 font-medium">
          Haz clic en un Pokémon para abrirlo
        </span>
      </div>

      {/* Render Evolution Chain Flow */}
      <div className="pt-2">
        {isBranching ? (
          /* Special Branching Layout for Eevee, Applin, Tyrogue etc */
          <div className="space-y-4">
            {/* Root Pokemon */}
            {rootMembers.map((root) => {
              const isCurrent = root.id === currentPokemonId;
              const isCaught = caughtSet.has(root.id);
              const sprite = getPokemonSpriteUrl(root.id, isShiny);

              return (
                <div key={root.id} className="flex flex-col items-center">
                  <div
                    onClick={() => onSelectPokemonById(root.id)}
                    className={`group relative p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      isCurrent
                        ? isShiny
                          ? 'bg-amber-500/20 border-amber-500/60 ring-2 ring-amber-500/30'
                          : 'bg-red-500/20 border-red-500/60 ring-2 ring-red-500/30'
                        : 'bg-[#141414] hover:bg-[#1c1c1c] border-neutral-800'
                    }`}
                  >
                    <img src={sprite} alt={root.name} className="w-10 h-10 object-contain" />
                    <div>
                      <div className="text-[10px] font-mono text-neutral-400">
                        {formatPokedexNumber(root.id)}
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-[#ff3e3e]">
                        {root.name}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCaughtById(root.id);
                      }}
                      className={`ml-2 w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                        isCaught
                          ? isShiny
                            ? 'bg-amber-400 text-neutral-950 border-amber-300'
                            : 'bg-[#ff3e3e] text-white border-red-400'
                          : 'border-neutral-700 bg-neutral-900 text-neutral-500 hover:border-neutral-500'
                      }`}
                    >
                      {isCaught && (
                        isShiny ? <Sparkles className="w-3.5 h-3.5 fill-neutral-950" /> : <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </button>
                  </div>

                  {/* Branching targets grid */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-neutral-800/80">
                    {stage1Members.map((evo) => {
                      const isEvoCurrent = evo.id === currentPokemonId;
                      const isEvoCaught = caughtSet.has(evo.id);
                      const evoSprite = getPokemonSpriteUrl(evo.id, isShiny);

                      return (
                        <div
                          key={evo.id}
                          onClick={() => onSelectPokemonById(evo.id)}
                          className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                            isEvoCurrent
                              ? isShiny
                                ? 'bg-amber-500/20 border-amber-500/60'
                                : 'bg-red-500/20 border-red-500/60'
                              : 'bg-[#141414] hover:bg-[#1a1a1a] border-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <img src={evoSprite} alt={evo.name} className="w-9 h-9 object-contain" />
                            <div>
                              <div className="text-xs font-bold text-white">{evo.name}</div>
                              <div className="text-[10px] font-semibold text-amber-300/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 inline-block mt-0.5">
                                {evo.method || 'Evolución'}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleCaughtById(evo.id);
                            }}
                            className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                              isEvoCaught
                                ? isShiny
                                  ? 'bg-amber-400 text-neutral-950 border-amber-300'
                                  : 'bg-[#ff3e3e] text-white border-red-400'
                                : 'border-neutral-700 bg-neutral-900 text-neutral-500 hover:border-neutral-500'
                            }`}
                          >
                            {isEvoCaught && (
                              isShiny ? <Sparkles className="w-3.5 h-3.5 fill-neutral-950" /> : <Check className="w-3.5 h-3.5 stroke-[3]" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Standard Linear / Simple Tree Flow */
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2">
            {chain.map((member, index) => {
              const isCurrent = member.id === currentPokemonId;
              const isCaught = caughtSet.has(member.id);
              const sprite = getPokemonSpriteUrl(member.id, isShiny);

              return (
                <React.Fragment key={member.id}>
                  {/* Evolution Arrow & Method Badge */}
                  {index > 0 && (
                    <div className="flex flex-col items-center justify-center my-1 sm:my-0 px-1 text-center">
                      <div className="text-[10px] font-bold text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full whitespace-nowrap mb-1">
                        {member.method || 'Evolución'}
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500 hidden sm:block" />
                      <div className="w-0.5 h-3 bg-neutral-800 sm:hidden" />
                    </div>
                  )}

                  {/* Pokemon Node Card */}
                  <div
                    onClick={() => onSelectPokemonById(member.id)}
                    className={`group relative p-2.5 rounded-xl border flex flex-col items-center justify-center min-w-[100px] cursor-pointer transition-all ${
                      isCurrent
                        ? isShiny
                          ? 'bg-amber-500/20 border-amber-500/60 ring-2 ring-amber-500/30 shadow-md shadow-amber-500/10'
                          : 'bg-red-500/20 border-red-500/60 ring-2 ring-red-500/30 shadow-md shadow-red-500/10'
                        : 'bg-[#141414] hover:bg-[#1a1a1a] border-neutral-800'
                    }`}
                  >
                    {/* Sprite */}
                    <img
                      src={sprite}
                      alt={member.name}
                      className="w-12 h-12 object-contain transition-transform group-hover:scale-110"
                    />

                    {/* Number & Name */}
                    <span className="text-[10px] font-mono font-bold text-neutral-400 mt-1">
                      {formatPokedexNumber(member.id)}
                    </span>
                    <span className={`text-xs font-bold truncate max-w-[110px] ${
                      isCurrent ? 'text-white font-extrabold' : 'text-neutral-300 group-hover:text-white'
                    }`}>
                      {member.name}
                    </span>

                    {/* Catch Status Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCaughtById(member.id);
                      }}
                      className={`mt-2 w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                        isCaught
                          ? isShiny
                            ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-xs'
                            : 'bg-[#ff3e3e] text-white border-red-400 shadow-xs'
                          : 'border-neutral-700 bg-neutral-900 text-neutral-500 hover:border-neutral-500'
                      }`}
                      title={isCaught ? 'Capturado' : 'Pendiente'}
                    >
                      {isCaught && (
                        isShiny ? <Sparkles className="w-3.5 h-3.5 fill-neutral-950" /> : <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </button>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
