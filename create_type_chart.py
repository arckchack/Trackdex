import json

types = ["Normal", "Fuego", "Agua", "Planta", "Eléctrico", "Hielo", "Lucha", "Veneno", "Tierra", "Volador", "Psíquico", "Bicho", "Roca", "Fantasma", "Dragón", "Siniestro", "Acero", "Hada"]

chart = {
    "Normal":   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 1, 1, 0.5, 1],
    "Fuego":    [1, 0.5, 0.5, 2, 1, 2, 1, 1, 1, 1, 1, 2, 0.5, 1, 0.5, 1, 2, 1],
    "Agua":     [1, 2, 0.5, 0.5, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0.5, 1, 1, 1],
    "Planta":   [1, 0.5, 2, 0.5, 1, 1, 1, 0.5, 2, 0.5, 1, 0.5, 2, 1, 0.5, 1, 0.5, 1],
    "Eléctrico":[1, 1, 2, 0.5, 0.5, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0.5, 1, 1, 1],
    "Hielo":    [1, 0.5, 0.5, 2, 1, 0.5, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 0.5, 1],
    "Lucha":    [2, 1, 1, 1, 1, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 2, 0, 1, 2, 2, 0.5],
    "Veneno":   [1, 1, 1, 2, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 0, 2],
    "Tierra":   [1, 2, 1, 0.5, 2, 1, 1, 2, 1, 0, 1, 0.5, 2, 1, 1, 1, 2, 1],
    "Volador":  [1, 1, 1, 2, 0.5, 1, 2, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 0.5, 1],
    "Psíquico": [1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 1, 0, 0.5, 1],
    "Bicho":    [1, 0.5, 1, 2, 1, 1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 2, 0.5, 0.5],
    "Roca":     [1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 0.5, 1],
    "Fantasma": [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 1],
    "Dragón":   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0.5, 0],
    "Siniestro":[1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 0.5],
    "Acero":    [1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0.5, 2],
    "Hada":     [1, 0.5, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 1, 2, 2, 0.5, 1]
}

formatted_chart = {}
for atk in types:
    formatted_chart[atk] = {}
    for i in range(len(types)):
        formatted_chart[atk][types[i]] = chart[atk][i]

ts_code = f"""// Type Effectiveness Matrix and Utilities
import {{ PokemonType }} from '../types';

export const TYPE_LIST: PokemonType[] = [
  'Normal', 'Fuego', 'Agua', 'Planta', 'Eléctrico', 'Hielo',
  'Lucha', 'Veneno', 'Tierra', 'Volador', 'Psíquico', 'Bicho',
  'Roca', 'Fantasma', 'Dragón', 'Siniestro', 'Acero', 'Hada'
];

export const TYPE_CHART: Record<PokemonType, Record<PokemonType, number>> = {json.dumps(formatted_chart, indent=2, ensure_ascii=False)};

export interface TypeEffectiveness {{
  weaknesses4x: PokemonType[];
  weaknesses2x: PokemonType[];
  resistances05x: PokemonType[];
  resistances025x: PokemonType[];
  immunities0x: PokemonType[];
}}

export function getPokemonWeaknesses(pokemonTypes: PokemonType[]): TypeEffectiveness {{
  const multipliers: Record<PokemonType, number> = {{
    Normal: 1, Fuego: 1, Agua: 1, Planta: 1, Eléctrico: 1, Hielo: 1,
    Lucha: 1, Veneno: 1, Tierra: 1, Volador: 1, Psíquico: 1, Bicho: 1,
    Roca: 1, Fantasma: 1, Dragón: 1, Siniestro: 1, Acero: 1, Hada: 1
  }};

  TYPE_LIST.forEach((atkType) => {{
    let mult = 1;
    pokemonTypes.forEach((defType) => {{
      if (TYPE_CHART[atkType] && TYPE_CHART[atkType][defType] !== undefined) {{
        mult *= TYPE_CHART[atkType][defType];
      }}
    }});
    multipliers[atkType] = mult;
  }});

  const weaknesses4x: PokemonType[] = [];
  const weaknesses2x: PokemonType[] = [];
  const resistances05x: PokemonType[] = [];
  const resistances025x: PokemonType[] = [];
  const immunities0x: PokemonType[] = [];

  (Object.keys(multipliers) as PokemonType[]).forEach((t) => {{
    const val = multipliers[t];
    if (val === 4) weaknesses4x.push(t);
    else if (val === 2) weaknesses2x.push(t);
    else if (val === 0.5) resistances05x.push(t);
    else if (val === 0.25) resistances025x.push(t);
    else if (val === 0) immunities0x.push(t);
  }});

  return {{
    weaknesses4x,
    weaknesses2x,
    resistances05x,
    resistances025x,
    immunities0x
  }};
}}
"""

with open('src/utils/typeChart.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("Created src/utils/typeChart.ts successfully!")
